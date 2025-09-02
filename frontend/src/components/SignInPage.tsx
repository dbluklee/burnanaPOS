import { useState } from 'react';
import { DESIGN_TOKENS } from '../types/design-tokens';
import { userService, type SignInData } from '../services/userService';

interface SignInPageProps {
  onBack?: () => void;
  onSignInComplete?: () => void;
}

export default function SignInPage({ onBack, onSignInComplete }: SignInPageProps) {
  const { colors, fonts } = DESIGN_TOKENS;

  const [storeNumber, setStoreNumber] = useState('');
  const [userPin, setUserPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const signInData: SignInData = {
        storeNumber,
        userPin
      };

      const user = await userService.signIn(signInData);
      
      // Store user info in localStorage for session
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      onSignInComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
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

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: colors.basicWhite,
    fontFamily: fonts.pretendard,
    fontSize: '14px',
    fontWeight: 600,
  };

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
            Enter your store credentials
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)' }}
          >
            <p style={{ color: '#ff6b6b', fontFamily: fonts.pretendard, fontSize: '14px' }}>
              {error}
            </p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label style={labelStyle}>Store Number</label>
            <input
              type="text"
              value={storeNumber}
              onChange={(e) => setStoreNumber(e.target.value)}
              style={inputStyle}
              placeholder="Enter your store number"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label style={labelStyle}>User PIN</label>
            <input
              type="password"
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              style={inputStyle}
              placeholder="Enter your 4-digit PIN"
              required
              disabled={isLoading}
              maxLength={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-6 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${colors.buttonBorder}`,
                color: colors.basicWhite,
                fontFamily: fonts.pretendard,
                fontSize: '16px',
                fontWeight: 600,
              }}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: isLoading ? 'rgba(255,255,255,0.5)' : colors.basicWhite,
                border: 'none',
                color: colors.bgBlack,
                fontFamily: fonts.pretendard,
                fontSize: '16px',
                fontWeight: 800,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}