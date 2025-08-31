import { useState } from 'react';
import { DESIGN_TOKENS } from '../types/design-tokens';

interface SignInPageProps {
  onBack?: () => void;
  onSignInComplete?: () => void;
}

type SignInMethod = 'phone' | 'storeNumber';

export default function SignInPage({ onBack, onSignInComplete }: SignInPageProps) {
  const { colors, fonts } = DESIGN_TOKENS;

  const [signInMethod, setSignInMethod] = useState<SignInMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [isAuthRequested, setIsAuthRequested] = useState(false);

  const handlePhoneAuth = () => {
    console.log('Phone authentication requested for:', phoneNumber);
    setIsAuthRequested(true);
    // Dummy implementation - simulate moving to main homepage after delay
    setTimeout(() => {
      alert('Phone authentication successful! (dummy implementation)');
      onSignInComplete?.();
    }, 1500);
  };

  const handleStoreNumberAuth = () => {
    console.log('Store number authentication for:', storeNumber);
    // Dummy implementation - directly navigate to homepage
    alert('Store number authentication successful! (dummy implementation)');
    onSignInComplete?.();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.buttonBorder}`,
    backgroundColor: colors.buttonBackground,
    color: colors.basicWhite,
    fontFamily: fonts.pretendard,
    fontSize: '16px',
    outline: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontFamily: fonts.pretendard,
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: colors.basicWhite,
    color: colors.bgBlack,
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: colors.basicWhite,
    border: `1px solid ${colors.buttonBorder}`,
  };

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: '12px 24px',
    borderRadius: '8px',
    border: `1px solid ${colors.buttonBorder}`,
    backgroundColor: active ? colors.buttonBackground : 'transparent',
    color: colors.basicWhite,
    fontFamily: fonts.pretendard,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: active ? 1 : 0.7,
  });

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: colors.bgBlack }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            style={{
              color: colors.basicWhite,
              fontFamily: fonts.pretendard,
              fontSize: '32px',
              fontWeight: 800,
              marginBottom: '8px',
            }}
          >
            Sign In
          </h1>
          <p 
            style={{
              color: colors.basicWhite,
              fontFamily: fonts.pretendard,
              fontSize: '16px',
              fontWeight: 400,
              opacity: 0.7,
            }}
          >
            Welcome back to BurnanaPOS
          </p>
        </div>

        {/* Sign In Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSignInMethod('phone')}
            style={tabStyle(signInMethod === 'phone')}
          >
            Phone Authentication
          </button>
          <button
            onClick={() => setSignInMethod('storeNumber')}
            style={tabStyle(signInMethod === 'storeNumber')}
          >
            Store Number
          </button>
        </div>

        {/* Sign In Forms */}
        <div className="space-y-6">
          {signInMethod === 'phone' ? (
            <div className="space-y-4">
              <div>
                <label 
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.basicWhite,
                    fontFamily: fonts.pretendard,
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your phone number"
                  disabled={isAuthRequested}
                />
              </div>
              
              <button
                onClick={handlePhoneAuth}
                disabled={!phoneNumber || isAuthRequested}
                style={{
                  ...primaryButtonStyle,
                  opacity: (!phoneNumber || isAuthRequested) ? 0.5 : 1,
                  cursor: (!phoneNumber || isAuthRequested) ? 'not-allowed' : 'pointer',
                }}
              >
                {isAuthRequested ? 'Authentication in Progress...' : 'Request Phone Authentication'}
              </button>

              {isAuthRequested && (
                <div 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: colors.buttonBackground,
                    border: `1px solid ${colors.buttonBorder}`,
                    color: colors.basicWhite,
                    fontFamily: fonts.pretendard,
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  Please check your phone for the authentication code...
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label 
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.basicWhite,
                    fontFamily: fonts.pretendard,
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Store Number
                </label>
                <input
                  type="text"
                  value={storeNumber}
                  onChange={(e) => setStoreNumber(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your store number"
                />
              </div>
              
              <button
                onClick={handleStoreNumberAuth}
                disabled={!storeNumber}
                style={{
                  ...primaryButtonStyle,
                  opacity: !storeNumber ? 0.5 : 1,
                  cursor: !storeNumber ? 'not-allowed' : 'pointer',
                }}
              >
                Sign In with Store Number
              </button>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={onBack}
            style={secondaryButtonStyle}
          >
            Back to Welcome
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p 
            style={{
              color: colors.basicWhite,
              fontFamily: fonts.pretendard,
              fontSize: '12px',
              opacity: 0.6,
            }}
          >
            Note: This is a dummy authentication system for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}