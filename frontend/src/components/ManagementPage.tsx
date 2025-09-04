import React from 'react';
import ButtonComp from './ButtonComp';
import ButtonAddComp from './ButtonAddComp'; 
import Noti from './NotiComp';
import PanelContent from './PanelContentComp';
import PanelHeaderComp from './PanelHeaderComp';
import PlaceCard from './PlaceCardComp';
import ResponsiveCardGrid from './ResponsiveCardGridComp';
import { tableColors, getHexColor, getCSSVariable } from './ColorSelectorComp';
import { useLogging } from '../hooks/useLogging';
import SyncStatus from './SyncStatus';
import { placeService, type PlaceData } from '../services/placeService';

// Icon components as SVG strings (from Figma assets)
const homeIconSvg = `data:image/svg+xml,<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 28L40 8L70 28V68C70 69.1046 69.1046 70 68 70H12C10.8954 70 10 69.1046 10 68V28Z" stroke="%23E0E0E0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 70V40H50V70" stroke="%23E0E0E0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const plusIconSvg = `data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10V30M10 20H30" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const undoIconSvg = `data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 14L4 9L9 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 20V13A4 4 0 0 0 16 9H4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

interface ManagementPageProps {
  onBack?: () => void;
  onSignOut?: () => void;
  onHome?: () => void;
}



interface Place {
  id: string;
  storeNumber: string;
  name: string;
  color: string;
  tableCount: number;
  userPin: string;
  createdAt: Date;
}

export default function ManagementPage({ onBack, onSignOut, onHome }: ManagementPageProps) {
  const [selectedTab, setSelectedTab] = React.useState('Place');
  const [isAddMode, setIsAddMode] = React.useState(false);
  const [cardsTransitioning, setCardsTransitioning] = React.useState(false);
  const [animatingCardId, setAnimatingCardId] = React.useState<string | null>(null);
  const [tabTransitioning, setTabTransitioning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  // Card editing mode state
  const [isCardEditMode, setIsCardEditMode] = React.useState(false);
  const [editingPlace, setEditingPlace] = React.useState<Place | null>(null);
  
  // Use the logging system
  const { 
    logs, 
    isLoading: logsLoading, 
    undoLog, 
    logPlaceCreated, 
    logPlaceDeleted,
    logPlaceUpdated,
    logTableCreated,
    logTableDeleted,
    logCustomerArrival,
    logUserSignIn,
    forceSyncNow,
    syncStatus,
    refreshPlacesData
  } = useLogging();
  
  const [savedPlaces, setSavedPlaces] = React.useState<Place[]>([]);
  
  // Load places from the server
  const loadPlaces = React.useCallback(async () => {
    try {
      setLoading(true);
      const placesData = await placeService.getAllPlaces();
      const mappedPlaces = placesData.map((p: PlaceData) => ({
        id: p.id!.toString(),
        storeNumber: p.store_number,
        name: p.name,
        color: p.color,
        tableCount: p.table_count,
        userPin: p.user_pin,
        createdAt: new Date(p.created_at!)
      }));
      setSavedPlaces(mappedPlaces);
    } catch (error) {
      console.error('Failed to load places:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load places from the server on component mount
  React.useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);
  
  // Function to get appropriate notification message based on selected tab
  const getNotiMessage = (tab: string) => {
    switch (tab.toLowerCase()) {
      case 'place':
        return {
          title: 'There are no places at all.',
          description: 'Press the + on the top right to add one!!'
        };
      case 'table':
        return {
          title: 'There are no tables at all.',
          description: 'Press the + on the top right to add one!!'
        };
      case 'category':
        return {
          title: 'There are no categories at all.',
          description: 'Press the + on the top right to add one!!'
        };
      case 'menu':
        return {
          title: 'There are no menus at all.',
          description: 'Press the + on the top right to add one!!'
        };
      default:
        return {
          title: 'There are no items at all.',
          description: 'Press the + on the top right to add one!!'
        };
    }
  };
  
  // Convert database logs to the format expected by the Log component
  const logEntries = logs.map(log => ({
    id: log.id!,
    serverId: log.serverId, // Add server ID for undo operations
    time: log.timeFormatted,
    message: log.text,
    type: log.eventId
  }));

  const handleLogUndo = async (logId: number) => {
    // Find the log entry to get the server ID
    const logEntry = logEntries.find(entry => entry.id === logId);
    const undoId = logEntry?.serverId || logId; // Use serverId if available, otherwise fallback to local ID
    console.log(`Undo action for log ${logId}, using server ID: ${undoId}`);
    
    const success = await undoLog(undoId);
    
    if (success) {
      // Refresh places data to reflect the undo changes
      await loadPlaces();
      await refreshPlacesData();
      console.log('✅ Places refreshed after undo');
    }
  };
  
  const handleAddButtonClick = () => {
    setIsAddMode(true);
  };

  const handleSave = async (name: string, selectedColor: string) => {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      alert('Please sign in to create a place.');
      return;
    }
    
    const currentUser = JSON.parse(currentUserStr);
    const storeNumber = currentUser.storeNumber;
    const userPin = currentUser.userPin;
    
    console.log('Saving:', { name, selectedColor, storeNumber, userPin });
    
    if (selectedTab === 'Place') {
      try {
        setLoading(true);
        
        // Create place on server
        const newPlaceData = await placeService.createPlace({
          store_number: storeNumber,
          name,
          color: getHexColor(selectedColor), // Convert CSS variable to hex
          table_count: 0,
          user_pin: userPin
        });

        // Convert to local Place interface
        const newPlace: Place = {
          id: newPlaceData.id!.toString(),
          storeNumber: newPlaceData.store_number,
          name: newPlaceData.name,
          color: newPlaceData.color,
          tableCount: newPlaceData.table_count,
          userPin: newPlaceData.user_pin,
          createdAt: new Date(newPlaceData.created_at!)
        };

        // Start fade animation
        setCardsTransitioning(true);
        setAnimatingCardId(newPlace.id);
        
        // Fade out current cards
        setTimeout(() => {
          // Add the new place
          setSavedPlaces(prev => [...prev, newPlace]);
          setIsAddMode(false);
          
          // Fade in with new card
          setTimeout(() => {
            setCardsTransitioning(false);
            // Keep the animation ID for a bit longer to show the highlight
            setTimeout(() => {
              setAnimatingCardId(null);
            }, 500);
          }, 25);
        }, 150);
        
        // Log the creation
        await logPlaceCreated(name, getHexColor(selectedColor));
        
        // Refresh places data in logging service for ItemComp processing
        await refreshPlacesData();
        
        console.log('✅ Place created successfully:', newPlace);
      } catch (error) {
        console.error('❌ Failed to create place:', error);
        alert('Failed to create place. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (selectedTab === 'Table') {
      setIsAddMode(false);
      // For table creation, we need to know which place it belongs to
      // For now, we'll just log it generically
      await logTableCreated(name, 'Selected Place'); // This would be dynamic in a real app
    }
  };

  const handleCancel = () => {
    setIsAddMode(false);
  };

  const handlePlaceDelete = async (place: Place) => {
    console.log('🗑️ handlePlaceDelete called for place:', place);
    try {
      setLoading(true);
      
      // Delete from server
      console.log('🗑️ Calling API to delete place ID:', place.id);
      await placeService.deletePlace(parseInt(place.id));
      
      // Start fade animation
      setCardsTransitioning(true);
      setAnimatingCardId(place.id);
      
      // Fade out current cards
      setTimeout(() => {
        // Remove from saved places
        setSavedPlaces(prev => prev.filter(p => p.id !== place.id));
        
        // Fade in remaining cards
        setTimeout(() => {
          setCardsTransitioning(false);
          setAnimatingCardId(null);
        }, 25);
      }, 150);
      
      // Log the deletion
      await logPlaceDeleted(place.name, place.color);
      
      // Refresh places data in logging service for ItemComp processing
      await refreshPlacesData();
      
      console.log('✅ Place deleted successfully:', place.name);
    } catch (error) {
      console.error('❌ Failed to delete place:', error);
      alert('Failed to delete place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Long-press handler to enter edit mode
  const handleCardLongPress = (place: Place) => {
    if (place.id === 'add') return;
    
    console.log('Long-press detected on:', place.name);
    setIsCardEditMode(true);
    setEditingPlace(place);
    setIsAddMode(true); // Show the settings panel
  };

  // Handle card reordering
  const handleCardReorder = (reorderedPlaces: Place[]) => {
    setSavedPlaces(reorderedPlaces);
    console.log('Cards reordered:', reorderedPlaces.map(p => p.name));
  };

  // Handle editing completion
  const handleEditSave = async (name: string, selectedColor: string, storeNumber: string, userPin: string) => {
    if (editingPlace) {
      try {
        setLoading(true);
        
        // Update place on server
        await placeService.updatePlace(parseInt(editingPlace.id), {
          name,
          color: getHexColor(selectedColor), // Convert CSS variable to hex
          store_number: storeNumber,
          user_pin: userPin
        });
        
        // Log the place update  
        await logPlaceUpdated(editingPlace.name, editingPlace.color, name, getHexColor(selectedColor));
        
        // Refresh places data for ItemComp processing
        await refreshPlacesData();
        
        // Start fade animation
        setCardsTransitioning(true);
        
        // Fade out current cards
        setTimeout(() => {
          // Update the existing place
          setSavedPlaces(prev => prev.map(p => 
            p.id === editingPlace.id 
              ? { ...p, name, color: selectedColor, storeNumber, userPin }
              : p
          ));
          
          // Exit edit mode
          setIsCardEditMode(false);
          setEditingPlace(null);
          setIsAddMode(false);
          
          // Fade in updated cards
          setTimeout(() => {
            setCardsTransitioning(false);
          }, 25);
        }, 150);
        
        // Log the update
        console.log('✅ Updated place:', name);
      } catch (error) {
        console.error('❌ Failed to update place:', error);
        alert('Failed to update place. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Regular add mode
      await handleSave(name, selectedColor, storeNumber, userPin);
    }
  };

  const handleEditCancel = () => {
    setIsCardEditMode(false);
    setEditingPlace(null);
    setIsAddMode(false);
  };

  const handleEditDelete = async () => {
    console.log('🗑️ handleEditDelete called', { editingPlace, isCardEditMode });
    if (editingPlace) {
      console.log('🗑️ Deleting place:', editingPlace.name);
      await handlePlaceDelete(editingPlace);
      setIsCardEditMode(false);
      setEditingPlace(null);
      setIsAddMode(false);
    } else {
      console.warn('🗑️ No editing place found - cannot delete');
    }
  };
  
  
  // Get current date/time formatted like in design
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleDateString('en-US', options);
  };

  const tabs = ['Category', 'Menu', 'Place', 'Table'];

  // Prevent touch scrolling/swiping on tablets
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Allow touch events on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, [role="button"], input, textarea, select, a, [tabindex]');
    
    if (!isInteractive) {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="bg-black box-border flex flex-col items-center justify-between overflow-hidden relative rounded-[2.25rem] w-full h-full max-h-screen" 
      style={{ 
        padding: 'clamp(0.5rem, 1.25vw, 1.25rem)',
        touchAction: 'none',
        userSelect: 'none'
      }} 
      data-name="ManagementPlace" 
      data-node-id="184:4003"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      {/* Header */}
      <div className="box-border content-stretch flex items-center justify-between overflow-hidden px-[2vw] py-0 relative shrink-0 w-full" style={{ height: 'clamp(3rem, 6vh, 4rem)' }} data-name="Header" data-node-id="184:4004">
        <div 
          className="content-stretch flex flex-col gap-2.5 items-center justify-center overflow-hidden relative shrink-0 cursor-pointer" 
          style={{ width: '2rem', height: '2rem' }} 
          data-name="Home" 
          data-node-id="184:4005"
          onClick={onHome}
        >
          <div className="aspect-[80/80] overflow-hidden relative shrink-0 w-full" data-name="Home Icon" data-node-id="184:4006">
            <img alt="" className="block max-w-none size-full" src={homeIconSvg} />
          </div>
        </div>
        <div className="box-border content-stretch flex h-full items-center justify-center px-[1.5vw] py-0 relative shrink-0" data-name="PageName" data-node-id="184:4007">
          <div className="flex flex-col font-['Pretendard'] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }} data-node-id="184:4008">
            <p className="leading-[normal] whitespace-pre">Management</p>
          </div>
        </div>
        <div className="box-border content-stretch flex h-full items-center justify-end px-[1vw] py-0 relative shrink-0 flex-1 gap-2" data-name="DateTime" data-node-id="184:4009">
          {/* Sync status indicator */}
          <SyncStatus syncStatus={syncStatus} />
          
          <div className="flex flex-col font-['Pretendard'] font-semibold h-full justify-center leading-[0] not-italic relative shrink-0 text-[#e0e0e0] text-right whitespace-nowrap" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)' }} data-node-id="184:4010">
            <p className="leading-[normal]">{getCurrentDateTime()}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 box-border flex items-stretch min-h-0 min-w-0 overflow-hidden relative w-full" style={{ paddingTop: 'clamp(0.25rem, 0.5vh, 0.75rem)', paddingBottom: 'clamp(0.25rem, 0.5vh, 0.75rem)', gap: 'clamp(0.5rem, 1vw, 1rem)' }} data-name="Body" data-node-id="184:4011">
        {/* Content - 70% width */}
        <div className="h-full min-h-0 max-h-full relative rounded-[1.5rem] border border-[#363636]" style={{ flex: '7', minWidth: '0' }} data-name="Content" data-node-id="184:4012">
          <div className="flex flex-col items-center justify-start min-w-0 overflow-hidden relative w-full h-full">
            {/* Content Header */}
            <div className="box-border content-stretch flex items-center justify-between overflow-hidden px-[0.5rem] py-[0.5rem] relative shrink-0 w-full" style={{ height: 'clamp(3rem, 8vh, 4.5rem)' }} data-name="ContentHeader" data-node-id="184:4013">
              {/* Items area - 80% width */}
              <div className="content-stretch flex h-full items-center justify-evenly min-h-0 min-w-0 relative shrink-0" style={{ flex: '8' }} data-name="Items" data-node-id="184:4014">
                {tabs.map((tab, index) => (
                  <ButtonComp
                    key={tab}
                    label={tab}
                    isSelected={selectedTab === tab}
                    onClick={() => {
                      if (selectedTab !== tab) {
                        setTabTransitioning(true);
                        
                        // Fade out current content
                        setTimeout(() => {
                          setSelectedTab(tab);
                          setIsAddMode(false); // Reset add mode when switching tabs
                          
                          // Fade in new content
                          setTimeout(() => {
                            setTabTransitioning(false);
                          }, 25);
                        }, 150);
                      }
                    }}
                  />
                ))}
              </div>
              
              {/* Function area - 20% width */}
              <div className="content-stretch flex h-full items-center justify-center min-h-0 min-w-0 relative shrink-0" style={{ flex: '2', paddingLeft: 'clamp(0.5rem, 1vw, 0.75rem)' }} data-name="Function" data-node-id="184:4026">
                <div className="relative shrink-0" style={{ width: 'clamp(2rem, 4vw, 2.5rem)', height: 'clamp(2rem, 4vw, 2.5rem)' }} data-name="Vector" data-node-id="184:4027">
                  <ButtonAddComp onClick={handleAddButtonClick} />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex items-start justify-start min-h-0 min-w-0 relative w-full p-[1vw] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} data-name="ContentBody" data-node-id="184:4043">
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div 
                className={`w-full h-full transition-opacity duration-150 ease-in-out ${
                  tabTransitioning || cardsTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {selectedTab === 'Place' && savedPlaces.length > 0 ? (
                  <ResponsiveCardGrid 
                    places={[...savedPlaces, { id: 'add', name: '', color: '', tableCount: 0 }]}
                    onCardClick={(place) => {
                      if (place.id === 'add') {
                        handleAddButtonClick();
                      } else {
                        console.log('Clicked place:', place.name);
                      }
                    }}
                    onCardLongPress={handleCardLongPress}
                    onCardReorder={handleCardReorder}
                    onEditCancel={handleEditCancel}
                    editingPlace={editingPlace}
                    isTransitioning={cardsTransitioning}
                    animatingCardId={animatingCardId}
                    isEditMode={isCardEditMode}
                  />
                ) : (
                  <div 
                    className="content-stretch flex flex-col items-center justify-center overflow-hidden relative shrink-0 w-full h-full" 
                    data-name="Notification" 
                    data-node-id="184:4044"
                  >
                    {isAddMode ? (
                      <Noti 
                        title="Use settings on the right."
                        description=""
                      />
                    ) : (
                      <Noti 
                        title={getNotiMessage(selectedTab).title}
                        description={getNotiMessage(selectedTab).description}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel (POS Log / Settings) - 30% width */}
        <div className="h-full min-h-0 max-h-full relative rounded-[1.5rem] border border-[#363636]" style={{ flex: '3', minWidth: '0' }} data-name="Panel" data-node-id="184:4066">
          <div className="box-border flex flex-col h-full items-center justify-start min-w-0 overflow-hidden px-[0.5rem] py-0 relative w-full">
            <PanelHeaderComp 
              title={isAddMode ? 'Place Settings' : 'POS Log'} 
            />
            <div className="flex-1 box-border flex flex-col items-center justify-start min-h-0 min-w-0 px-[0.25rem] relative w-full overflow-hidden" style={{ paddingTop: '3vh', paddingBottom: '3vh' }} data-name="PanelBody" data-node-id="184:4071">
              <PanelContent
                isAddMode={isAddMode}
                selectedTab={selectedTab}
                logEntries={logEntries}
                onLogUndo={handleLogUndo}
                onSave={isCardEditMode ? handleEditSave : handleSave}
                onCancel={isCardEditMode ? handleEditCancel : handleCancel}
                onDelete={isCardEditMode ? handleEditDelete : undefined}
                isEditMode={isCardEditMode}
                editingPlace={editingPlace}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}