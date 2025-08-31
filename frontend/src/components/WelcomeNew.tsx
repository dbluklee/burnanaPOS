import { DESIGN_TOKENS } from '../types/design-tokens';

// Asset constants from Figma
const imgWelcomeBgImg1 = "http://localhost:3845/assets/f5913f38e3f7b4fa43805baee121625fd2686b59.png";
const imgBurnanaLogo = "http://localhost:3845/assets/41f5f313bb885b4c4cee1d750baf6a6d743abf68.png";

interface WelcomeProps {
  onSignUp?: () => void;
  onSignIn?: () => void;
}

export default function Welcome({ onSignUp, onSignIn }: WelcomeProps) {
  const {
    colors,
    typography,
    spacing,
    dimensions,
    fonts,
  } = DESIGN_TOKENS;

  return (
    <div 
      className="box-border content-stretch flex gap-[5px] items-start justify-start overflow-clip relative rounded-[18px] size-full min-h-screen" 
      style={{
        backgroundColor: colors.bgBlack,
        paddingLeft: spacing.containerPadding,
        paddingRight: spacing.containerPadding,
        paddingTop: spacing.containerPaddingY,
        paddingBottom: spacing.containerPaddingY,
      }}
      data-name="Welcome" 
      data-node-id="221:1359"
    >
      {/* Background Image - Fill entire screen */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat" 
        style={{ backgroundImage: `url('${imgWelcomeBgImg1}')` }}
        data-name="welcome_bg_img 1" 
        data-node-id="221:1360" 
      />
      
      {/* Main Content Container */}
      <div 
        className="content-stretch flex flex-col items-start justify-center relative shrink-0 z-10"
        style={{
          gap: spacing.contentGap,
          height: dimensions.containerHeight,
          width: dimensions.containerWidth,
        }}
        data-name="WelcomeBody" 
        data-node-id="221:1361"
      >
        {/* Logo Section */}
        <div 
          className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0"
          style={{
            width: dimensions.logoSize,
            height: dimensions.logoSize,
          }}
          data-name="WelcomeBodyLogo" 
          data-node-id="221:1362"
        >
          <div 
            className="relative shrink-0"
            style={{
              width: dimensions.logoSize,
              height: dimensions.logoSize,
            }}
            data-name="BurnanaLogo" 
            data-node-id="221:1363"
          >
            <div 
              className="absolute bg-center bg-cover bg-no-repeat inset-0"
              style={{ backgroundImage: `url('${imgBurnanaLogo}')` }}
              data-name="burnana 1"
            />
          </div>
        </div>
        
        {/* Welcome Text Section */}
        <div 
          className="content-stretch flex flex-col gap-[5px] items-start justify-start leading-[0] not-italic overflow-clip relative shrink-0 text-nowrap"
          style={{ color: colors.basicWhite }}
          data-name="WelcomeBodyText" 
          data-node-id="221:1364"
        >
          <div 
            className="flex flex-col justify-center relative shrink-0"
            style={{
              fontFamily: fonts.pretendard,
              fontSize: typography.welcomeText.fontSize,
              fontWeight: typography.welcomeText.fontWeight,
              lineHeight: typography.welcomeText.lineHeight,
            }}
            data-node-id="221:1365"
          >
            <p className="text-nowrap whitespace-pre">Welcome on</p>
          </div>
          <div 
            className="flex flex-col justify-center relative shrink-0"
            style={{
              fontFamily: fonts.pretendard,
              fontSize: typography.brandText.fontSize,
              fontWeight: typography.brandText.fontWeight,
              lineHeight: typography.brandText.lineHeight,
            }}
            data-node-id="221:1366"
          >
            <p className="text-nowrap whitespace-pre">Burnana POS</p>
          </div>
        </div>
        
        {/* Description Section */}
        <div 
          className="content-stretch flex gap-[5px] items-center justify-center overflow-clip relative shrink-0 w-full" 
          data-name="WelcomeBodyDesc" 
          data-node-id="221:1367"
        >
          <div 
            className="basis-0 flex flex-col grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0"
            style={{
              fontFamily: fonts.pretendard,
              fontSize: typography.bodyText.fontSize,
              fontWeight: typography.bodyText.fontWeight,
              lineHeight: typography.bodyText.lineHeight,
              color: colors.basicWhite,
            }}
            data-node-id="221:1368"
          >
            <p className="leading-[normal]">
              {`Tired of hearing "Excuse me!"? Let your customers chat with an AI instead! They can order, pay, and even split the bill right from their phones, while you just watch the magic happen on your POS dashboard. Made a mistake? No sweat, there's an Undo button for that! It's the delightful innovation your busy restaurant has been waiting for.`}
            </p>
          </div>
        </div>
        
        {/* Buttons Section */}
        <div 
          className="content-stretch flex items-start justify-start relative shrink-0"
          style={{ gap: spacing.buttonGap }}
          data-name="WelcomeBodyButtons" 
          data-node-id="221:1369"
        >
          {/* Sign Up Button */}
          <button
            onClick={onSignUp}
            className="box-border flex items-center justify-center px-[30px] py-[15px] relative shrink-0 transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[#999999]"
            style={{
              backgroundColor: colors.buttonBackground,
              height: dimensions.buttonHeight,
              borderRadius: dimensions.buttonRadius,
              border: `1.5px solid ${colors.buttonBorder}`,
              fontFamily: fonts.pretendard,
              fontSize: typography.buttonText.fontSize,
              fontWeight: typography.buttonText.fontWeight,
              lineHeight: typography.buttonText.lineHeight,
              color: colors.basicWhite,
            }}
            data-name="SignupButton" 
            data-node-id="221:1370"
          >
            Sign Up
          </button>
          
          {/* Sign In Button */}
          <button
            onClick={onSignIn}
            className="box-border flex items-center justify-center px-[30px] py-[15px] relative shrink-0 transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[#999999]"
            style={{
              backgroundColor: colors.buttonBackground,
              height: dimensions.buttonHeight,
              borderRadius: dimensions.buttonRadius,
              border: `1.5px solid ${colors.buttonBorder}`,
              fontFamily: fonts.pretendard,
              fontSize: typography.buttonText.fontSize,
              fontWeight: typography.buttonText.fontWeight,
              lineHeight: typography.buttonText.lineHeight,
              color: colors.basicWhite,
            }}
            data-name="SigninButton" 
            data-node-id="221:1371"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}