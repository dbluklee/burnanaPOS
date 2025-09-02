import { useState } from 'react';
import { DESIGN_TOKENS } from '../types/design-tokens';
import { userService, type SignUpData, type UserProfile } from '../services/userService';
import ButtonItemComp from './ButtonItemComp';

interface SignUpCompProps {
  onBack?: () => void;
  onSignUpComplete?: () => void;
}

interface SignUpForm {
  businessRegistrationNumber: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  storeAddress: string;
  naverStoreLink: string;
}

export default function SignUpComp({ onBack, onSignUpComplete }: SignUpCompProps) {
  const { colors, fonts } = DESIGN_TOKENS;

  const [formData, setFormData] = useState<SignUpForm>({
    businessRegistrationNumber: '',
    storeName: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    storeAddress: '',
    naverStoreLink: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatBusinessRegistrationNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits
    const limited = numbers.slice(0, 10);
    
    // Format as XXX-XX-XXXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 5) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
    }
  };

  const handleBusinessRegNumberChange = (value: string) => {
    const formatted = formatBusinessRegistrationNumber(value);
    setFormData(prev => ({ ...prev, businessRegistrationNumber: formatted }));
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^0-9]/g, '');
    
    // Limit to 11 digits
    const limited = numbers.slice(0, 11);
    
    // Format based on length
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else if (limited.length <= 10) {
      // 10 digits: XXX-XXX-XXXX
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else {
      // 11 digits: XXX-XXXX-XXXX
      return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const handlePhoneAuth = () => {
    console.log('Phone authentication requested');
    alert('Phone authentication requested (dummy implementation)');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const signUpData: SignUpData = {
        businessRegistrationNumber: formData.businessRegistrationNumber,
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        storeAddress: formData.storeAddress,
        naverStoreLink: formData.naverStoreLink || undefined,
      };

      const user = await userService.register(signUpData);
      setRegisteredUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 'clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px)',
    borderRadius: 'clamp(6px, 0.8vw, 8px)',
    border: `1px solid ${colors.buttonBorder}`,
    backgroundColor: colors.buttonBackground,
    color: 'var(--white)',
    fontFamily: fonts.pretendard,
    fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 'clamp(4px, 0.8vh, 8px)',
    color: 'var(--white)',
    fontFamily: fonts.pretendard,
    fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
    fontWeight: 500,
  };

  return (
    <div className="h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full overflow-y-auto overflow-x-hidden max-h-full" style={{ padding: '0 clamp(1rem, 2vw, 2rem)' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
          <h1 
            className="FontStyleBlockTitle"
            style={{
              color: 'var(--white)',
              marginBottom: 'clamp(4px, 0.8vh, 8px)',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
            }}
          >
            {registeredUser ? 'Registration Complete!' : 'Sign Up'}
          </h1>
          <p 
            className="FontStyleBlockText"
            style={{
              color: 'var(--light)',
              fontSize: 'clamp(0.9rem, 2vw, 1.3rem)'
            }}
          >
            {registeredUser 
              ? 'Your account has been created successfully'
              : 'Create your BurnanaPOS account'
            }
          </p>
        </div>

        {/* Registration Success */}
        {registeredUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)' }}>
            <div className="text-center rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 'clamp(1rem, 2vh, 1.5rem)', borderRadius: 'clamp(6px, 0.8vw, 8px)' }}>
              <h3 
                style={{
                  color: colors.basicWhite,
                  fontFamily: fonts.pretendard,
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  fontWeight: 700,
                  marginBottom: 'clamp(12px, 2vh, 16px)',
                }}
              >
                Your Login Credentials
              </h3>
              <div className="space-y-3">
                <div>
                  <p style={{ ...labelStyle, marginBottom: 'clamp(2px, 0.5vh, 4px)' }}>Store Number</p>
                  <p 
                    style={{
                      color: colors.basicWhite,
                      fontFamily: 'monospace',
                      fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      padding: 'clamp(6px, 1vh, 8px) clamp(12px, 2vw, 16px)',
                      borderRadius: 'clamp(6px, 0.8vw, 8px)',
                    }}
                  >
                    {registeredUser.storeNumber}
                  </p>
                </div>
                <div>
                  <p style={{ ...labelStyle, marginBottom: 'clamp(2px, 0.5vh, 4px)' }}>User PIN</p>
                  <p 
                    style={{
                      color: colors.basicWhite,
                      fontFamily: 'monospace',
                      fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      padding: 'clamp(6px, 1vh, 8px) clamp(12px, 2vw, 16px)',
                      borderRadius: 'clamp(6px, 0.8vw, 8px)',
                    }}
                  >
                    {registeredUser.userPin}
                  </p>
                </div>
              </div>
              <p 
                style={{
                  color: colors.basicWhite,
                  fontFamily: fonts.pretendard,
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                  opacity: 0.7,
                  marginTop: 'clamp(12px, 2vh, 16px)',
                  lineHeight: '1.5',
                }}
              >
                Please save these credentials safely. You will need them to sign in to your account.
              </p>
            </div>
            
            <ButtonItemComp 
              label="Continue to Dashboard"
              onClick={onSignUpComplete}
              isSelected={true}
              className="w-full"
              style={{ height: 'clamp(40px, 6vh, 56px)' }}
            />
          </div>
        )}

        {/* Form */}
        {!registeredUser && (
          <>
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
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)', width: '100%' }}>
              <div>
                <label style={labelStyle}>Business Registration Number</label>
                <input
                  type="text"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) => handleBusinessRegNumberChange(e.target.value)}
                  style={inputStyle}
                  placeholder="123-45-67890"
                  maxLength={12}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Store Name</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  style={inputStyle}
                  placeholder="Enter store name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  style={inputStyle}
                  placeholder="Enter owner's name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <div className="flex gap-2" style={{ width: '100%' }}>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    style={{ ...inputStyle, flex: '1 1 auto', minWidth: 0 }}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    required
                  />
                  <ButtonItemComp 
                    label="Verify"
                    onClick={handlePhoneAuth}
                    className="FontStyleTitle"
                    style={{ height: 'clamp(36px, 5vh, 48px)', minWidth: 'clamp(60px, 8vw, 80px)', flexShrink: 0 }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={inputStyle}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Store Address</label>
                <textarea
                  value={formData.storeAddress}
                  onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                  style={{ ...inputStyle, minHeight: 'clamp(60px, 10vh, 80px)', resize: 'vertical', maxWidth: '100%' }}
                  placeholder="Enter store address"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Naver Store Link (Optional)</label>
                <input
                  type="url"
                  value={formData.naverStoreLink}
                  onChange={(e) => handleInputChange('naverStoreLink', e.target.value)}
                  style={inputStyle}
                  placeholder="Enter Naver store link"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4" style={{ paddingTop: 'clamp(0.5rem, 1vh, 1rem)' }}>
                <ButtonItemComp 
                  label="Back"
                  onClick={onBack}
                  className="flex-1"
                  style={{ height: 'clamp(40px, 6vh, 56px)' }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  style={{ display: 'none' }}
                  disabled={isLoading}
                />
                <ButtonItemComp 
                  label={isLoading ? 'Creating Account...' : 'Create Account'}
                  onClick={handleSubmit}
                  isSelected={true}
                  className="flex-1"
                  style={{ height: 'clamp(40px, 6vh, 56px)' }}
                  disabled={isLoading}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}