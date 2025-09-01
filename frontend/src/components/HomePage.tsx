import React from 'react';
import Block from './Block';
import HighlightBlock from './HighlightBlock';
import BlockSmall from './BlockSmall';
import BlockPromotion from './BlockPromotion';

// Image assets
import promotionTopImage from '../assets/images/HomePage/promotion-top.jpg';
import promotionMid1Image from '../assets/images/HomePage/promotion-mid1.jpg';
import promotionMid2Image from '../assets/images/HomePage/promotion-mid2.jpg';
import promotionBottomImage from '../assets/images/HomePage/promotion-bottom.jpg';

// Icon assets for small blocks
import userRoundIcon from '../assets/HomePage/users-round.svg';
import burnanaLogoImage from '../assets/Common/burnana-logo.svg';
import settingsIcon from '../assets/HomePage/settings.svg';
import helpIcon from '../assets/HomePage/help.svg';
import languagesIcon from '../assets/HomePage/languages.svg';
import mailIcon from '../assets/HomePage/mail.svg';
import signOutIcon from '../assets/HomePage/sign-out.svg';

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
            <BlockPromotion 
              imageUrl={promotionTopImage} 
              alt="QR Code Payment" 
              dataName="promotion-top"
            />
          </div>

          {/* Function Icons Grid - 30% */}
          <div style={{ flex: '30', height: '100%' }} className="flex flex-col gap-[1vh]">
            {/* Top Row Icons */}
            <div className="flex gap-[1vw]" style={{ height: 'calc((100% - 1vh) / 2)' }}>
              {/* Sign Out Block */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={signOutIcon} alt="Sign Out" onClick={onSignOut} />
              </div>
              
              {/* User Change Button */}
              <div style={{ flex: '1', aspectRatio: '1/1' }}>
                <BlockSmall icon={userRoundIcon} alt="User Change" />
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
            <BlockPromotion 
              imageUrl={promotionMid1Image} 
              alt="Smiling chef holding tablet" 
              dataName="promotion-mid1"
            />
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
            <BlockPromotion 
              imageUrl={promotionMid2Image} 
              alt="Female analyst using computer dashboard for business data analysis" 
              dataName="promotion-mid2"
            />
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
            <BlockPromotion 
              imageUrl={promotionBottomImage} 
              alt="Anthropomorphic robot that performs regular human job" 
              dataName="promotion-bottom"
            />
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