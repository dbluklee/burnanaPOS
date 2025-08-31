import React from 'react';
import Block from './Block';
import HighlightBlock from './HighlightBlock';
import BlockSmall from './BlockSmall';
import PromotionTopImg from './PromotionTopImg';
import PromotionMidImg1 from './PromotionMidImg1';
import PromotionMidImg2 from './PromotionMidImg2';
import PromotionBottomImg from './PromotionBottomImg';

// Icon assets for small blocks
const burnanaLogoImage = "http://localhost:3845/assets/5b30d183d748f1b9ef488509025cc065028f2cfe.svg";
const settingsIcon = "http://localhost:3845/assets/a9e34bf85f7a7e47c75418249dc610fa0bd434b7.svg";
const helpIcon = "http://localhost:3845/assets/3b9267ca63577778a6707c3cd0639fe4b3eeeeea.svg";
const languagesIcon = "http://localhost:3845/assets/a882400e83ac872dc3d665f08b44260bea86da02.svg";
const mailIcon = "http://localhost:3845/assets/1c7c52abb0ff2acc1e3179c4895de33b35d49f0c.svg";
const signOutIcon = "http://localhost:3845/assets/ee7379812239b24a60e6d123094cffd0085a93f9.svg"; // Logout icon from Figma

interface HomePageProps {
  onSignOut?: () => void;
  onManagement?: () => void;
}

export default function HomePage({ onSignOut, onManagement }: HomePageProps) {
  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-black" 
      data-name="Home" 
      data-node-id="221:1372"
    >

      {/* HomeBody Container with full screen responsive layout */}
      <div 
        className="absolute flex flex-col w-full h-full"
        style={{ 
          padding: '1vh 1vw',
          gap: '1vh',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxSizing: 'border-box'
        }}
        data-name="HomeBody" 
        data-node-id="221:1373"
      >
        {/* Row 1: 45%, 23%, 30% */}
        <div 
          className="flex w-full gap-[1vw]"
          style={{ 
            height: 'calc((100vh - 2vh - 2vh) / 3)', // Account for top/bottom padding + gaps
            minHeight: 0
          }}
          data-name="HomeBodyRow1" 
          data-node-id="221:1374"
        >
          {/* Management Block - 45% */}
          <div style={{ flex: '45', height: '100%' }}>
            <Block 
              intro="Let's begin sales!"
              title="Management"
              description="All the information about our store can be modified here!"
              onClick={onManagement}
            />
          </div>

          {/* QR Code Image - 23% */}
          <div style={{ flex: '23', height: '100%' }}>
            <PromotionTopImg />
          </div>

          {/* Function Icons Grid - 30% */}
          <div style={{ flex: '30', height: '100%' }} className="flex flex-col gap-[1vh]">
            {/* Top Row Icons */}
            <div className="flex gap-[1vw]" style={{ height: 'calc((100% - 1vh) / 2)' }}>
              {/* Sign Out Block */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={signOutIcon} alt="Sign Out" onClick={onSignOut} />
              </div>
              
              {/* Burnana Logo */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={burnanaLogoImage} alt="Burnana Logo" />
              </div>
              
              {/* Settings Icon */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={settingsIcon} alt="Settings" />
              </div>
            </div>
            
            {/* Bottom Row Icons */}
            <div className="flex gap-[1vw]" style={{ height: 'calc((100% - 1vh) / 2)' }}>
              {/* Help Icon */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={helpIcon} alt="Help" />
              </div>
              
              {/* Languages Icon */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={languagesIcon} alt="Languages" />
              </div>
              
              {/* Mail Icon */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={mailIcon} alt="Mail" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: 18%, 50%, 30% */}
        <div 
          className="flex w-full gap-[1vw]"
          style={{ 
            height: 'calc((100vh - 2vh - 2vh) / 3)', // Account for top/bottom padding + gaps
            minHeight: 0
          }}
          data-name="HomeBodyRow2" 
          data-node-id="221:1394"
        >
          {/* Chef Image - 18% */}
          <div style={{ flex: '18', height: '100%' }}>
            <PromotionMidImg1 />
          </div>

          {/* Dashboard Block - 50% */}
          <div style={{ flex: '50', height: '100%' }}>
            <Block 
              intro=""
              title="Dashboard"
              description="A real-time control tower for our store, all at a glance."
            />
          </div>

          {/* Analytics Image - 30% */}
          <div style={{ flex: '30', height: '100%' }}>
            <PromotionMidImg2 />
          </div>
        </div>

        {/* Row 3: 40%, 18%, 40% */}
        <div 
          className="flex w-full gap-[1vw]"
          style={{ 
            height: 'calc((100vh - 2vh - 2vh) / 3)', // Account for top/bottom padding + gaps
            minHeight: 0
          }}
          data-name="HomeBodyRow3" 
          data-node-id="221:1401"
        >
          {/* AI Agent Block - 40% */}
          <div style={{ flex: '40', height: '100%' }}>
            <HighlightBlock 
              intro="Ask us anything, from data to operational tips."
              title="AI Agent"
            />
          </div>

          {/* Robot Image - 18% */}
          <div style={{ flex: '18', height: '100%' }}>
            <PromotionBottomImg />
          </div>

          {/* Analytics Block - 40% */}
          <div style={{ flex: '40', height: '100%' }}>
            <Block 
              intro="If you want to do business better"
              title="Analytics"
              description="Check it every day to make better strategies!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}