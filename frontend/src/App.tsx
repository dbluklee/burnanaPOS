import { useState, useEffect } from 'react';
import WelcomeNew from './components/WelcomeNew';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import HomePage from './components/HomePage';
import ManagementPage from './components/ManagementPage';
import ComponentShowcase from './components/ComponentShowcase';
import type { PageType } from './types/navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('homepage');
  const [pageHistory, setPageHistory] = useState<PageType[]>(['homepage']);

  // Apply Mode-1 class to body for color variables
  useEffect(() => {
    document.body.classList.add('Mode-1');
    return () => {
      document.body.classList.remove('Mode-1');
    };
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setPageHistory(prev => [...prev, page]);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
    }
  };

  const resetToWelcome = () => {
    setCurrentPage('welcome');
    setPageHistory(['welcome']);
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
    switch (currentPage) {
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
      {renderCurrentPage()}
    </div>
  );
}

export default App