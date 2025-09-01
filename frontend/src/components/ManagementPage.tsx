import React from 'react';
import ButtonItem from './ButtonItem';
import AddButton from './AddButton';
import Noti from './Noti';
import PanelContent from './PanelContent';
import PlaceCard from './PlaceCard';
import ResponsiveCardGrid from './ResponsiveCardGrid';
import { tableColors } from './ColorSelector';
import { useLogging } from '../hooks/useLogging';
import SyncStatus from './SyncStatus';

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
  name: string;
  color: string;
  tableCount: number;
}

export default function ManagementPage({ onBack, onSignOut, onHome }: ManagementPageProps) {
  const [selectedTab, setSelectedTab] = React.useState('Place');
  const [isAddMode, setIsAddMode] = React.useState(false);
  const [cardsTransitioning, setCardsTransitioning] = React.useState(false);
  const [animatingCardId, setAnimatingCardId] = React.useState<string | null>(null);
  const [tabTransitioning, setTabTransitioning] = React.useState(false);
  
  // Use the logging system
  const { 
    logs, 
    isLoading: logsLoading, 
    undoLog, 
    logPlaceCreated, 
    logPlaceDeleted,
    logTableCreated,
    logTableDeleted,
    logCustomerArrival,
    forceSyncNow,
    syncStatus
  } = useLogging();
  
  // Test data - 11 places to fill the grid (leaving one empty slot for the add button)
  const testPlaces: Place[] = [
    { id: '1', name: '1st Floor', color: tableColors[0], tableCount: 12 },
    { id: '2', name: '2nd Floor', color: tableColors[1], tableCount: 8 },
    { id: '3', name: '3rd Floor', color: tableColors[2], tableCount: 15 },
    { id: '4', name: 'Rooftop', color: tableColors[3], tableCount: 6 },
    { id: '5', name: 'Garden', color: tableColors[4], tableCount: 10 },
    { id: '6', name: 'Basement', color: tableColors[5], tableCount: 5 },
    { id: '7', name: 'VIP Room', color: tableColors[6], tableCount: 3 },
    { id: '8', name: 'Terrace', color: tableColors[7], tableCount: 9 },
    { id: '9', name: 'Main Hall', color: tableColors[0], tableCount: 20 },
    { id: '10', name: 'Private 1', color: tableColors[1], tableCount: 2 },
    { id: '11', name: 'Private 2', color: tableColors[2], tableCount: 2 },
  ];
  
  const [savedPlaces, setSavedPlaces] = React.useState<Place[]>(testPlaces);
  
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
    time: log.timeFormatted,
    message: log.text
  }));

  const handleLogUndo = async (logId: number) => {
    console.log(`Undo action for log ${logId}`);
    await undoLog(logId);
  };
  
  const handleAddButtonClick = () => {
    setIsAddMode(true);
  };

  const handleSave = async (name: string, selectedColor: string) => {
    console.log('Saving:', { name, selectedColor });
    
    if (selectedTab === 'Place') {
      const newPlace: Place = {
        id: Date.now().toString(),
        name,
        color: selectedColor,
        tableCount: 0
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
      await logPlaceCreated(name);
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
    await logPlaceDeleted(place.name);
  };

  // Test functions for demonstrating logging
  const handleTestCustomerArrival = async () => {
    await logCustomerArrival('1st floor', 'Table1', Math.floor(Math.random() * 4) + 1);
  };

  const handleTestSync = async () => {
    await forceSyncNow();
  };

  const handleTestDeletePlace = async () => {
    if (savedPlaces.length > 0) {
      const lastPlace = savedPlaces[savedPlaces.length - 1];
      await handlePlaceDelete(lastPlace);
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
      className="bg-black box-border content-stretch flex flex-col items-center justify-between overflow-hidden relative rounded-[2.25rem] w-full h-full" 
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
          className="content-stretch flex flex-col gap-2.5 items-center justify-center overflow-hidden relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
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
          
          {/* Test buttons for logging system */}
          <button
            onClick={handleTestCustomerArrival}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Test customer arrival log"
          >
            Test Customer
          </button>
          <button
            onClick={handleTestSync}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            title="Force sync logs to server"
          >
            Sync Now
          </button>
          <button
            onClick={handleTestDeletePlace}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="Delete last place (test animation)"
          >
            Del Place
          </button>
          <div className="flex flex-col font-['Pretendard'] font-semibold h-full justify-center leading-[0] not-italic relative shrink-0 text-[#e0e0e0] text-right whitespace-nowrap" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)' }} data-node-id="184:4010">
            <p className="leading-[normal]">{getCurrentDateTime()}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="basis-0 box-border content-stretch flex grow items-stretch min-h-0 min-w-0 overflow-hidden relative shrink-0 w-full" style={{ paddingTop: 'clamp(0.25rem, 0.5vh, 0.75rem)', paddingBottom: 'clamp(0.25rem, 0.5vh, 0.75rem)', gap: 'clamp(0.5rem, 1vw, 1rem)' }} data-name="Body" data-node-id="184:4011">
        {/* Content - 70% width */}
        <div className="h-full min-h-0 relative rounded-[1.5rem] border border-[#363636]" style={{ flex: '7', minWidth: '0' }} data-name="Content" data-node-id="184:4012">
          <div className="content-stretch flex flex-col items-center justify-start min-w-0 overflow-hidden relative size-full">
            {/* Content Header */}
            <div className="box-border content-stretch flex items-center justify-between overflow-hidden px-[0.5rem] py-[0.5rem] relative shrink-0 w-full" style={{ height: 'clamp(3rem, 8vh, 4.5rem)' }} data-name="ContentHeader" data-node-id="184:4013">
              {/* Items area - 80% width */}
              <div className="content-stretch flex h-full items-center justify-evenly min-h-0 min-w-0 relative shrink-0" style={{ flex: '8' }} data-name="Items" data-node-id="184:4014">
                {tabs.map((tab, index) => (
                  <ButtonItem
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
                  <AddButton onClick={handleAddButtonClick} />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="basis-0 content-stretch flex grow items-start justify-start min-h-0 min-w-0 relative shrink-0 w-full h-full p-[1vw] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} data-name="ContentBody" data-node-id="184:4043">
              <style jsx>{`
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
                        // For demo purposes, let's make double-click delete the place
                        console.log('Clicked place:', place.name);
                        // You could add double-click detection here or use a different method
                      }
                    }}
                    isTransitioning={cardsTransitioning}
                    animatingCardId={animatingCardId}
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
        <div className="h-full relative rounded-[1.5rem] border border-[#363636]" style={{ flex: '3', minWidth: '0' }} data-name="Panel" data-node-id="184:4066">
          <div className="box-border content-stretch flex flex-col h-full items-center justify-start min-w-0 overflow-hidden px-[0.5rem] py-0 relative w-full">
            <div className="box-border content-stretch flex items-center justify-start overflow-hidden px-[0.25rem] py-[0.5rem] relative shrink-0 w-full" style={{ height: 'clamp(2.5rem, 6vh, 3.5rem)' }} data-name="PanelHeader" data-node-id="184:4067">
              <div className="box-border content-stretch flex items-center justify-start overflow-hidden px-[0.25rem] py-[0.125rem] relative rounded-[1rem] shrink-0 h-full" data-name="PanelLabel" data-node-id="184:4068">
                <div className="FontStyleTitle flex flex-col justify-center leading-[1.2] not-italic relative shrink-0 text-center text-nowrap text-white" data-node-id="184:4069">
                  <span>{isAddMode ? 'Place Settings' : 'POS Log'}</span>
                </div>
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-col grow items-center justify-start min-h-0 min-w-0 px-[0.25rem] relative shrink-0 w-full overflow-hidden" style={{ paddingTop: '3vh', paddingBottom: '0.5rem' }} data-name="PanelBody" data-node-id="184:4071">
              <PanelContent
                isAddMode={isAddMode}
                selectedTab={selectedTab}
                logEntries={logEntries}
                onLogUndo={handleLogUndo}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}