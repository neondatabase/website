import React, { useEffect } from 'react';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import DataBranching from 'components/pages/home/data-branching';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SaaS from 'components/pages/home/saas';
import Scalability from 'components/pages/home/scalability';
import Storage from 'components/pages/home/storage';
import Layout from 'components/shared/layout';
import Subscribe from 'components/shared/subscribe';

const LINE_WIDTH = 2;

function setPositionsForVerticalLines() {
  const verticalLine1 = document.querySelector('#vertical-line-1');
  const verticalLine2 = document.querySelector('#vertical-line-2');
  const verticalLine3 = document.querySelector('#vertical-line-3');
  const verticalLine4 = document.querySelector('#vertical-line-4');
  const verticalLine5 = document.querySelector('#vertical-line-5');
  const verticalLine6 = document.querySelector('#vertical-line-6');
  const verticalLine7 = document.querySelector('#vertical-line-7');
  const verticalLine8 = document.querySelector('#vertical-line-8');
  const verticalLine9 = document.querySelector('#vertical-line-9');

  const horizontalLine7 = document.querySelector('#horizontal-line-7');
  const horizontalLine8 = document.querySelector('#horizontal-line-8');
  const container = document.querySelector('#container');
  const heroButton = document.querySelector('#hero-button');
  const ctaInputBackground = document.querySelector('#cta-input-background');
  const advantagesItem1Icon = document.querySelector('#advantages-item-1-icon');
  const advantagesItem2Icon = document.querySelector('#advantages-item-2-icon');
  const advantagesItem3Icon = document.querySelector('#advantages-item-3-icon');

  verticalLine1.style.cssText = `
    left: ${container.getBoundingClientRect().left}px
  `;

  verticalLine2.style.cssText = `
    left: ${advantagesItem1Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine3.style.cssText = `
    left: ${heroButton.getBoundingClientRect().right - LINE_WIDTH}px;
    height: ${horizontalLine8.getBoundingClientRect().top + document.documentElement.scrollTop}px;
  `;

  verticalLine4.style.cssText = `
    left: ${ctaInputBackground.getBoundingClientRect().left}px
  `;

  verticalLine5.style.cssText = `
    left: ${advantagesItem2Icon.getBoundingClientRect().left}px
  `;

  verticalLine6.style.cssText = `
    left: ${advantagesItem2Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine7.style.cssText = `
    left: ${advantagesItem3Icon.getBoundingClientRect().left}px
  `;

  verticalLine8.style.cssText = `
    left: ${advantagesItem3Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine9.style.cssText = `
    top: ${horizontalLine7.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${container.getBoundingClientRect().right - 81 - LINE_WIDTH}px
  `;
}

function setPositionsForHorizontalLines() {
  const horizontalLine1 = document.querySelector('#horizontal-line-1');
  const horizontalLine2 = document.querySelector('#horizontal-line-2');
  const horizontalLine3 = document.querySelector('#horizontal-line-3');
  const horizontalLine4 = document.querySelector('#horizontal-line-4');
  const horizontalLine5 = document.querySelector('#horizontal-line-5');
  const horizontalLine6 = document.querySelector('#horizontal-line-6');
  const horizontalLine7 = document.querySelector('#horizontal-line-7');
  const horizontalLine8 = document.querySelector('#horizontal-line-8');
  const horizontalLine9 = document.querySelector('#horizontal-line-9');
  const horizontalLine10 = document.querySelector('#horizontal-line-10');
  const horizontalLine11 = document.querySelector('#horizontal-line-11');
  const horizontalLine12 = document.querySelector('#horizontal-line-12');
  const horizontalLine13 = document.querySelector('#horizontal-line-13');
  const horizontalLine14 = document.querySelector('#horizontal-line-14');
  const horizontalLine15 = document.querySelector('#horizontal-line-15');
  const horizontalLine16 = document.querySelector('#horizontal-line-16');
  const horizontalLine17 = document.querySelector('#horizontal-line-17');
  const horizontalLine18 = document.querySelector('#horizontal-line-18');
  const horizontalLine19 = document.querySelector('#horizontal-line-19');
  const horizontalLine20 = document.querySelector('#horizontal-line-20');

  const verticalLine9 = document.querySelector('#vertical-line-9');
  const container = document.querySelector('#container');
  const heroTitle = document.querySelector('#hero-title');
  const heroButton = document.querySelector('#hero-button');
  const ctaTitle = document.querySelector('#cta-title');
  const ctaInput = document.querySelector('#cta-input');
  const ctaInputBackground = document.querySelector('#cta-input-background');
  const ctaBottomText = document.querySelector('#cta-bottom-text');
  const advantagesVideoWrapper = document.querySelector('#advantages-video-wrapper');
  const advantagesTitle = document.querySelector('#advantages-title');
  const advantagesDescription = document.querySelector('#advantages-description');
  const advantagesItem1Icon = document.querySelector('#advantages-item-1-icon');
  const advantagesItem1Title = document.querySelector('#advantages-item-1-title');
  const advantagesItem1Description = document.querySelector('#advantages-item-1-description');

  // TODO: Need dynamic "top" value. Right now we can't do it since this value should be set depend on an item from illustration
  horizontalLine1.style.cssText = `
    top: 229px;
  `;

  horizontalLine2.style.cssText = `
    top: ${heroTitle.getBoundingClientRect().top + document.documentElement.scrollTop}px
  `;

  horizontalLine3.style.cssText = `
    top: ${
      heroTitle.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px
  `;

  horizontalLine4.style.cssText = `
    top: ${heroButton.getBoundingClientRect().top + document.documentElement.scrollTop}px
  `;

  // TODO: Need dynamic "top" value. Right now we can't do it since this value should be set depend on an item from illustration
  horizontalLine6.style.cssText = `
    top: 956px;
  `;

  horizontalLine5.style.cssText = `
    top: ${
      heroButton.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px
  `;

  horizontalLine7.style.cssText = `
    top: ${ctaTitle.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${container.getBoundingClientRect().left}px
  `;

  horizontalLine8.style.cssText = `
    top: ${
      ctaTitle.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px
  `;

  horizontalLine9.style.cssText = `
    top: ${ctaInput.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    right: ${document.body.clientWidth - verticalLine9.getBoundingClientRect().right}px
  `;

  horizontalLine10.style.cssText = `
    top: ${
      ctaInputBackground.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px;
    left: ${container.getBoundingClientRect().left}px
  `;

  horizontalLine11.style.cssText = `
    top: ${
      ctaBottomText.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px
  `;

  horizontalLine12.style.cssText = `
    top: ${
      advantagesVideoWrapper.getBoundingClientRect().top + document.documentElement.scrollTop
    }px
  `;

  horizontalLine13.style.cssText = `
    top: ${advantagesTitle.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    right: ${document.body.clientWidth - verticalLine9.getBoundingClientRect().right}px
  `;

  horizontalLine14.style.cssText = `
    top: ${
      advantagesTitle.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;

  horizontalLine15.style.cssText = `
    top: ${
      advantagesDescription.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;

  horizontalLine16.style.cssText = `
    top: ${
      advantagesVideoWrapper.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;

  horizontalLine17.style.cssText = `
    top: ${advantagesItem1Icon.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    right: ${document.body.clientWidth - verticalLine9.getBoundingClientRect().right}px
  `;

  horizontalLine18.style.cssText = `
    top: ${
      advantagesItem1Icon.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;

  horizontalLine19.style.cssText = `
    top: ${
      advantagesItem1Title.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;

  horizontalLine20.style.cssText = `
    top: ${
      advantagesItem1Description.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px
  `;
}

function setPositionsForShapes() {
  const shape1 = document.querySelector('#shape-1');
  const shape2 = document.querySelector('#shape-2');
  const shape3 = document.querySelector('#shape-3');
  const shape4 = document.querySelector('#shape-4');
  const shape5 = document.querySelector('#shape-5');
  const shape6 = document.querySelector('#shape-6');
  const shape7 = document.querySelector('#shape-7');
  const shape8 = document.querySelector('#shape-8');

  const verticalLine2 = document.querySelector('#vertical-line-2');
  const verticalLine3 = document.querySelector('#vertical-line-3');
  const verticalLine4 = document.querySelector('#vertical-line-4');
  const verticalLine6 = document.querySelector('#vertical-line-6');
  const verticalLine7 = document.querySelector('#vertical-line-7');
  const verticalLine8 = document.querySelector('#vertical-line-8');
  const verticalLine9 = document.querySelector('#vertical-line-9');
  const horizontalLine1 = document.querySelector('#horizontal-line-1');
  const horizontalLine2 = document.querySelector('#horizontal-line-2');
  const horizontalLine6 = document.querySelector('#horizontal-line-6');
  const horizontalLine7 = document.querySelector('#horizontal-line-7');
  const horizontalLine8 = document.querySelector('#horizontal-line-8');
  const horizontalLine10 = document.querySelector('#horizontal-line-10');
  const horizontalLine11 = document.querySelector('#horizontal-line-11');
  const horizontalLine12 = document.querySelector('#horizontal-line-12');
  const horizontalLine16 = document.querySelector('#horizontal-line-16');
  const horizontalLine17 = document.querySelector('#horizontal-line-17');
  const horizontalLine19 = document.querySelector('#horizontal-line-19');
  const advantages = document.querySelector('#advantages');

  shape1.style.cssText = `
    top: -${LINE_WIDTH}px; 
    left: ${verticalLine2.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine3.getBoundingClientRect().right}px; 
    height: ${
      horizontalLine1.getBoundingClientRect().bottom +
      document.documentElement.scrollTop +
      LINE_WIDTH
    }px;
  `;

  shape2.style.cssText = `
    top: ${horizontalLine1.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine4.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine6.getBoundingClientRect().right}px;
    height: ${
      horizontalLine2.getBoundingClientRect().bottom -
      horizontalLine1.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape3.style.cssText = `
    top: ${horizontalLine6.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine3.getBoundingClientRect().right}px;
    height: ${
      horizontalLine7.getBoundingClientRect().bottom -
      horizontalLine6.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape4.style.cssText = `
    top: ${horizontalLine8.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine9.getBoundingClientRect().left}px;
    right: 0px;
    height: ${
      horizontalLine10.getBoundingClientRect().bottom -
      horizontalLine8.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape5.style.cssText = `
    top: ${horizontalLine11.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px;
    height: ${
      horizontalLine17.getBoundingClientRect().bottom -
      horizontalLine11.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape6.style.cssText = `
    top: ${horizontalLine11.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine8.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine9.getBoundingClientRect().right}px;
    height: ${
      horizontalLine12.getBoundingClientRect().bottom -
      horizontalLine11.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape7.style.cssText = `
    top: ${horizontalLine16.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine6.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine7.getBoundingClientRect().right}px;
    height: ${
      horizontalLine17.getBoundingClientRect().bottom -
      horizontalLine16.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape8.style.cssText = `
    top: ${horizontalLine19.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px;
    height: ${
      advantages.getBoundingClientRect().bottom -
      horizontalLine19.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;
}

function setPositionsForCircles() {
  const circle1 = document.querySelector('#circle-1');
  const circle2 = document.querySelector('#circle-2');
  const circle3 = document.querySelector('#circle-3');
  const circle4 = document.querySelector('#circle-4');
  const circle5 = document.querySelector('#circle-5');
  const circle6 = document.querySelector('#circle-6');
  const circle7 = document.querySelector('#circle-7');

  const verticalLine2 = document.querySelector('#vertical-line-2');
  const verticalLine4 = document.querySelector('#vertical-line-4');
  const verticalLine7 = document.querySelector('#vertical-line-7');
  const verticalLine9 = document.querySelector('#vertical-line-9');
  const horizontalLine6 = document.querySelector('#horizontal-line-6');
  const horizontalLine7 = document.querySelector('#horizontal-line-7');
  const horizontalLine11 = document.querySelector('#horizontal-line-11');
  const horizontalLine16 = document.querySelector('#horizontal-line-16');
  const horizontalLine17 = document.querySelector('#horizontal-line-17');

  circle1.style.cssText = `
    top: ${
      horizontalLine6.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine4.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle2.style.cssText = `
    top: ${
      horizontalLine7.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine2.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle3.style.cssText = `
    top: ${
      horizontalLine11.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine2.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle4.style.cssText = `
    top: ${
      horizontalLine11.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine4.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle5.style.cssText = `
    top: ${
      horizontalLine11.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine7.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle6.style.cssText = `
    top: ${
      horizontalLine16.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine9.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle7.style.cssText = `
    top: ${
      horizontalLine17.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine9.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;
}

function setPositionsForCirclesWithText() {
  const circleWithText1 = document.querySelector('#circle-with-text-1');
  const circleWithText2 = document.querySelector('#circle-with-text-2');
  const circleWithText3 = document.querySelector('#circle-with-text-3');
  const circleWithText4 = document.querySelector('#circle-with-text-4');

  const verticalLine3 = document.querySelector('#vertical-line-3');
  const verticalLine6 = document.querySelector('#vertical-line-6');
  const verticalLine7 = document.querySelector('#vertical-line-7');
  const horizontalLine1 = document.querySelector('#horizontal-line-1');
  const horizontalLine6 = document.querySelector('#horizontal-line-6');
  const horizontalLine7 = document.querySelector('#horizontal-line-7');
  const horizontalLine11 = document.querySelector('#horizontal-line-11');
  const horizontalLine12 = document.querySelector('#horizontal-line-12');
  const horizontalLine20 = document.querySelector('#horizontal-line-20');
  const advantages = document.querySelector('#advantages');

  circleWithText1.style.cssText = `
    top: ${
      (horizontalLine1.getBoundingClientRect().top + document.documentElement.scrollTop) / 1.5
    }px;
    left: ${verticalLine3.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circleWithText2.style.cssText = `
    top: ${
      horizontalLine6.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      (horizontalLine7.getBoundingClientRect().top - horizontalLine6.getBoundingClientRect().top) /
        1.7
    }px;
    left: ${verticalLine6.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circleWithText3.style.cssText = `
    top: ${
      horizontalLine11.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      (horizontalLine12.getBoundingClientRect().top -
        horizontalLine11.getBoundingClientRect().top) /
        1.8
    }px;
    left: ${verticalLine7.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circleWithText4.style.cssText = `
    top: ${
      horizontalLine20.getBoundingClientRect().top +
      document.documentElement.scrollTop +
      (advantages.getBoundingClientRect().bottom - horizontalLine20.getBoundingClientRect().top) /
        2.1
    }px;
    left: ${verticalLine6.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;
}

const Lines = () => {
  useEffect(() => {
    setPositionsForVerticalLines();
    setPositionsForHorizontalLines();
    // We have to call setPositionsForVerticalLines again because there is a dependency on horizontal line
    // which is being positioned after first call of setPositionsForVerticalLines
    // We can't swap calls of these functions because horizontal lines depend on vertical lines too
    // We will have to make additional call any way
    setPositionsForVerticalLines();
    setPositionsForShapes();
    setPositionsForCircles();
    setPositionsForCirclesWithText();
  }, []);

  return (
    <div className="lg:hidden" aria-hidden>
      <div id="vertical-line-1" className="top-0 vertical-line" />
      <div id="vertical-line-2" className="top-0 vertical-line" />
      <div id="vertical-line-3" className="top-0 vertical-line" />
      <div id="vertical-line-4" className="top-0 vertical-line" />
      <div id="vertical-line-5" className="top-0 vertical-line" />
      <div id="vertical-line-6" className="top-0 vertical-line" />
      <div id="vertical-line-7" className="top-0 vertical-line" />
      <div id="vertical-line-8" className="top-0 vertical-line" />
      <div id="vertical-line-9" className="top-0 vertical-line" />

      <div id="horizontal-line-1" className="left-0 horizontal-line" />
      <div id="horizontal-line-2" className="left-0 horizontal-line" />
      <div id="horizontal-line-3" className="left-0 horizontal-line" />
      <div id="horizontal-line-4" className="left-0 horizontal-line" />
      <div id="horizontal-line-5" className="left-0 horizontal-line" />
      <div id="horizontal-line-6" className="left-0 horizontal-line" />
      <div id="horizontal-line-7" className="left-0 horizontal-line" />
      <div id="horizontal-line-8" className="left-0 horizontal-line" />
      <div id="horizontal-line-9" className="left-0 horizontal-line" />
      <div id="horizontal-line-10" className="left-0 horizontal-line" />
      <div id="horizontal-line-11" className="left-0 horizontal-line" />
      <div id="horizontal-line-12" className="left-0 horizontal-line" />
      <div id="horizontal-line-13" className="left-0 horizontal-line" />
      <div id="horizontal-line-14" className="left-0 horizontal-line" />
      <div id="horizontal-line-15" className="left-0 horizontal-line" />
      <div id="horizontal-line-16" className="left-0 horizontal-line" />
      <div id="horizontal-line-17" className="left-0 horizontal-line" />
      <div id="horizontal-line-18" className="left-0 horizontal-line" />
      <div id="horizontal-line-19" className="left-0 horizontal-line" />
      <div id="horizontal-line-20" className="left-0 horizontal-line" />

      <div id="shape-1" className="shape shape-bottom-left" />
      <div id="shape-2" className="shape shape-bottom-right" />
      <div id="shape-3" className="shape shape-top-left" />
      <div id="shape-4" className="shape shape-top-left" />
      <div id="shape-5" className="shape shape-top-right" />
      <div id="shape-6" className="shape shape-bottom-right" />
      <div id="shape-7" className="shape shape-bottom-right" />
      <div id="shape-8" className="shape shape-bottom-right" />

      <div id="circle-1" className="circle" />
      <div id="circle-2" className="circle" />
      <div id="circle-3" className="circle" />
      <div id="circle-4" className="circle" />
      <div id="circle-5" className="circle" />
      <div id="circle-6" className="circle" />
      <div id="circle-7" className="circle" />

      <div
        id="circle-with-text-1"
        className="circle circle-with-text circle-with-text-right"
        data-text="51e3bade-4507-4f44-b960-675a2a272fa6"
      />
      <div
        id="circle-with-text-2"
        className="circle circle-with-text circle-with-text-right"
        data-text="fe495254-ff45-4a1e-9207-2f8aa6482547"
      />
      <div
        id="circle-with-text-3"
        className="circle circle-with-text circle-with-text-right"
        data-text="3022b5f9-5eab-444c-890a-f63b3caa5d28"
      />
      <div
        id="circle-with-text-4"
        className="circle circle-with-text circle-with-text-right"
        data-text="24a9b481-97a0-4316-b27e-d1da09e2992a"
      />
    </div>
  );
};

const HomePage = () => (
  <Layout>
    <div className="relative overflow-hidden">
      <Lines />
      <Hero />
      <CTA />
      <Advantages />
    </div>
    <Scalability />
    <Storage />
    <DataBranching />
    <Features />
    <SaaS />
    <Subscribe />
  </Layout>
);

export default HomePage;
