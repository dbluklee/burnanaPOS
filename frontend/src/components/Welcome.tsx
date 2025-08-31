export default function Welcome() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[5px] items-start justify-start overflow-clip px-[100px] py-[140.5px] relative rounded-[18px] size-full min-h-screen" data-name="Welcome" data-node-id="2001:311">
      {/* Background gradient matching Figma design */}
      <div className="absolute bg-gradient-to-br from-indigo-900 via-purple-800 to-orange-500 h-[744px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[1133px] opacity-80" data-name="welcome_bg_img 1" data-node-id="2001:312" />
      
      <div className="content-stretch flex flex-col gap-[50px] h-[462.5px] items-start justify-center relative shrink-0 w-[700px] z-10" data-name="WelcomeBody" data-node-id="2001:313">
        {/* Logo */}
        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[60px]" data-name="WelcomeBodyLogo" data-node-id="2001:314">
          <div className="relative shrink-0 size-[60px]" data-name="BurnanaLogo" data-node-id="2001:315">
            {/* Burnana Logo - circular yellow background with banana */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl transform rotate-12">🍌</span>
            </div>
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="content-stretch flex flex-col gap-[5px] items-start justify-start leading-[0] not-italic overflow-clip relative shrink-0 text-nowrap text-white" data-name="WelcomeBodyText" data-node-id="2001:316">
          <div className="flex flex-col justify-center relative shrink-0 text-[48px]" style={{ fontFamily: 'Pretendard', fontWeight: 500 }} data-node-id="2001:317">
            <p className="leading-[52.5px] text-nowrap whitespace-pre">Welcome on</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[60px]" style={{ fontFamily: 'Pretendard', fontWeight: 800 }} data-node-id="2001:318">
            <p className="leading-[52.5px] text-nowrap whitespace-pre">Burnana POS</p>
          </div>
        </div>
        
        {/* Description */}
        <div className="content-stretch flex gap-[5px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="WelcomeBodyDesc" data-node-id="2001:319">
          <div className="basis-0 flex flex-col grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white" style={{ fontFamily: 'Pretendard', fontWeight: 600 }} data-node-id="2001:320">
            <p className="leading-[normal]">
              {`Tired of hearing "Excuse me!"? Let your customers chat with an AI instead! They can order, pay, and even split the bill right from their phones, while you just watch the magic happen on your POS dashboard. Made a mistake? No sweat, there's an Undo button for that! It's the delightful innovation your busy restaurant has been waiting for.`}
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="content-stretch flex gap-[18px] items-start justify-start relative shrink-0" data-name="WelcomeBodyButtons" data-node-id="2001:321">
          <button 
            className="bg-[rgba(255,255,255,0.05)] h-10 relative rounded-[36px] shrink-0 border-[#777777] border-[1.5px] border-solid transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[#999999]" 
            data-name="SignupButton" 
            data-node-id="2001:322"
          >
            <div className="box-border content-stretch flex gap-[18.75px] h-10 items-center justify-center overflow-clip px-[30px] py-[15px] relative">
              <div className="leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap text-white" style={{ fontFamily: 'Pretendard', fontWeight: 800 }}>
                <p className="leading-[normal] whitespace-pre">Sign Up</p>
              </div>
            </div>
          </button>
          
          <button 
            className="bg-[rgba(255,255,255,0.05)] h-10 relative rounded-[36px] shrink-0 border-[#777777] border-[1.5px] border-solid transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[#999999]" 
            data-name="SigninButton" 
            data-node-id="2001:323"
          >
            <div className="box-border content-stretch flex gap-[18.75px] h-10 items-center justify-center overflow-clip px-[30px] py-[15px] relative">
              <div className="leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap text-white" style={{ fontFamily: 'Pretendard', fontWeight: 800 }}>
                <p className="leading-[normal] whitespace-pre">Sign In</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}