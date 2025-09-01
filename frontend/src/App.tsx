import { useState, useEffect } from 'react';
import WelcomeNew from './components/WelcomeNew';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import HomePage from './components/HomePage';
import ManagementPage from './components/ManagementPage';
import ComponentShowcase from './components/ComponentShowcase';
import type { PageType } from './types/navigation';
import { useLogger } from './hooks/useLogging';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('homepage');
  const [pageHistory, setPageHistory] = useState<PageType[]>(['homepage']);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayPage, setDisplayPage] = useState<PageType>('homepage');
  
  const { logNavigation } = useLogger();

  // Apply Mode-1 class to body for color variables
  useEffect(() => {
    document.body.classList.add('Mode-1');
    return () => {
      document.body.classList.remove('Mode-1');
    };
  }, []);

  const navigateTo = (page: PageType) => {
    setIsTransitioning(true);
    
    // Log navigation
    logNavigation(currentPage, page);
    
    // Fade out
    setTimeout(() => {
      setCurrentPage(page);
      setDisplayPage(page);
      setPageHistory(prev => [...prev, page]);
      
      // Fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 25);
    }, 150);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      setIsTransitioning(true);
      
      // Fade out
      setTimeout(() => {
        const newHistory = pageHistory.slice(0, -1);
        const previousPage = newHistory[newHistory.length - 1];
        setPageHistory(newHistory);
        setCurrentPage(previousPage);
        setDisplayPage(previousPage);
        
        // Fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 25);
      }, 150);
    }
  };

  const resetToWelcome = () => {
    setIsTransitioning(true);
    
    // Fade out
    setTimeout(() => {
      setCurrentPage('welcome');
      setDisplayPage('welcome');
      setPageHistory(['welcome']);
      
      // Fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 25);
    }, 150);
  };

  // Navigation handlers
  const handleSignUp = () => navigateTo('signup');
  const handleSignIn = () => navigateTo('signin');
  const handleSignUpComplete = () => navigateTo('homepage');
  const handleSignInComplete = () => navigateTo('homepage');
  const handleSignOut = () => resetToWelcome();
  const handleManagement = () => navigateTo('management');
  const handleHome = () => navigateTo('homepage');

  // Render current page
  const renderCurrentPage = () => {
    switch (displayPage) {
      case 'welcome':
        return (
          <WelcomeNew 
            onSignUp={handleSignUp} 
            onSignIn={handleSignIn} 
          />
        );
      
      case 'signup':
        return (
          <SignUpPage 
            onBack={goBack}
            onSignUpComplete={handleSignUpComplete}
          />
        );
      
      case 'signin':
        return (
          <SignInPage 
            onBack={goBack}
            onSignInComplete={handleSignInComplete}
          />
        );
      
      case 'homepage':
        return (
          <HomePage 
            onSignOut={handleSignOut}
            onManagement={handleManagement}
          />
        );
      
      case 'management':
        return (
          <ManagementPage 
            onBack={goBack}
            onSignOut={handleSignOut}
            onHome={handleHome}
          />
        );
      
      default:
        return (
          <WelcomeNew 
            onSignUp={handleSignUp} 
            onSignIn={handleSignIn} 
          />
        );
    }
  };

  // Show normal app flow
  // return <ComponentShowcase />;
  
  return (
    <div className="w-full h-full">
      <div 
        className={`w-full h-full transition-opacity duration-150 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderCurrentPage()}
      </div>
    </div>
  );
}

export default App