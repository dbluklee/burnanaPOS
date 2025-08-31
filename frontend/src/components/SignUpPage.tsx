import { useState } from 'react';
import { DESIGN_TOKENS } from '../types/design-tokens';

interface SignUpPageProps {
  onBack?: () => void;
  onSignUpComplete?: () => void;
}

interface SignUpForm {
  businessRegistrationNumber: string;
  tradeName: string;
  representativeName: string;
  representativeContact: string;
  email: string;
  storeAddress: string;
  naverStoreLink: string;
}

export default function SignUpPage({ onBack, onSignUpComplete }: SignUpPageProps) {
  const { colors, fonts } = DESIGN_TOKENS;

  const [formData, setFormData] = useState<SignUpForm>({
    businessRegistrationNumber: '',
    tradeName: '',
    representativeName: '',
    representativeContact: '',
    email: '',
    storeAddress: '',
    naverStoreLink: '',
  });

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneAuth = () => {
    console.log('Phone authentication requested');
    // Dummy implementation - just show alert for now
    alert('Phone authentication requested (dummy implementation)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up form submitted:', formData);
    // TODO: Save to DB server
    alert('Account created successfully! (dummy implementation)');
    onSignUpComplete?.();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.buttonBorder}`,
    backgroundColor: colors.buttonBackground,
    color: colors.basicWhite,
    fontFamily: fonts.pretendard,
    fontSize: '14px',
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
            Sign Up
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
            Create your BurnanaPOS account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label style={labelStyle}>Business Registration Number</label>
            <input
              type="text"
              value={formData.businessRegistrationNumber}
              onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              style={inputStyle}
              placeholder="Enter business registration number"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Trade Name</label>
            <input
              type="text"
              value={formData.tradeName}
              onChange={(e) => handleInputChange('tradeName', e.target.value)}
              style={inputStyle}
              placeholder="Enter trade name"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Representative's Name</label>
            <input
              type="text"
              value={formData.representativeName}
              onChange={(e) => handleInputChange('representativeName', e.target.value)}
              style={inputStyle}
              placeholder="Enter representative's name"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Representative's Contact</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={formData.representativeContact}
                onChange={(e) => handleInputChange('representativeContact', e.target.value)}
                style={{ ...inputStyle, flexGrow: 1 }}
                placeholder="Enter phone number"
                required
              />
              <button
                type="button"
                onClick={handlePhoneAuth}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: colors.buttonBackground,
                  border: `1px solid ${colors.buttonBorder}`,
                  color: colors.basicWhite,
                  fontFamily: fonts.pretendard,
                  fontSize: '14px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Verify
              </button>
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
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
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
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: colors.basicWhite,
                border: 'none',
                color: colors.bgBlack,
                fontFamily: fonts.pretendard,
                fontSize: '16px',
                fontWeight: 800,
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}