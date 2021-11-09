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

const Lines = () => {
  useEffect(() => {
    // Lines
    const verticalLine1 = document.querySelector('#vertical-line-1');
    const verticalLine2 = document.querySelector('#vertical-line-2');
    const verticalLine3 = document.querySelector('#vertical-line-3');
    const verticalLine4 = document.querySelector('#vertical-line-4');
    const verticalLine5 = document.querySelector('#vertical-line-5');
    const verticalLine6 = document.querySelector('#vertical-line-6');
    const verticalLine7 = document.querySelector('#vertical-line-7');
    const verticalLine8 = document.querySelector('#vertical-line-8');
    const verticalLine9 = document.querySelector('#vertical-line-9');

    // Elements
    const container = document.querySelector('#container');
    const heroButton = document.querySelector('#hero-button');
    const ctaInputBackground = document.querySelector('#cta-input-background');
    const advantagesItem1Icon = document.querySelector('#advantages-item-1-icon');
    const advantagesItem2Icon = document.querySelector('#advantages-item-2-icon');
    const advantagesItem3Icon = document.querySelector('#advantages-item-3-icon');

    verticalLine1.style.cssText = `left: ${container.getBoundingClientRect().left}px`;
    verticalLine2.style.cssText = `left: ${
      advantagesItem1Icon.getBoundingClientRect().right - LINE_WIDTH
    }px`;
    verticalLine3.style.cssText = `left: ${
      heroButton.getBoundingClientRect().right - LINE_WIDTH
    }px`;
    verticalLine4.style.cssText = `left: ${ctaInputBackground.getBoundingClientRect().left}px`;
    verticalLine5.style.cssText = `left: ${advantagesItem2Icon.getBoundingClientRect().left}px`;
    verticalLine6.style.cssText = `left: ${
      advantagesItem2Icon.getBoundingClientRect().right - LINE_WIDTH
    }px`;
    verticalLine7.style.cssText = `left: ${advantagesItem3Icon.getBoundingClientRect().left}px`;
    verticalLine8.style.cssText = `left: ${
      advantagesItem3Icon.getBoundingClientRect().right - LINE_WIDTH
    }px`;
    verticalLine9.style.cssText = `left: ${container.getBoundingClientRect().right - LINE_WIDTH}px`;
  }, []);

  useEffect(() => {
    // Lines
    // const horizontalLine1 = document.querySelector('#horizontal-line-1');
    const horizontalLine2 = document.querySelector('#horizontal-line-2');
    const horizontalLine3 = document.querySelector('#horizontal-line-3');
    const horizontalLine4 = document.querySelector('#horizontal-line-4');
    const horizontalLine5 = document.querySelector('#horizontal-line-5');
    // const horizontalLine6 = document.querySelector('#horizontal-line-6');
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

    // Elements
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

    horizontalLine2.style.cssText = `top: ${
      heroTitle.getBoundingClientRect().top + document.documentElement.scrollTop
    }px`;
    horizontalLine3.style.cssText = `top: ${
      heroTitle.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px`;
    horizontalLine4.style.cssText = `top: ${
      heroButton.getBoundingClientRect().top + document.documentElement.scrollTop
    }px`;
    horizontalLine5.style.cssText = `top: ${
      heroButton.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px`;
    horizontalLine7.style.cssText = `top: ${
      ctaTitle.getBoundingClientRect().top + document.documentElement.scrollTop
    }px; left: ${container.getBoundingClientRect().left}px`;
    horizontalLine8.style.cssText = `top: ${
      ctaTitle.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px`;
    horizontalLine9.style.cssText = `top: ${
      ctaInput.getBoundingClientRect().top + document.documentElement.scrollTop
    }px; right: ${document.body.clientWidth - container.getBoundingClientRect().right}px`;
    horizontalLine10.style.cssText = `top: ${
      ctaInputBackground.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px; left: ${container.getBoundingClientRect().left}px`;
    horizontalLine11.style.cssText = `top: ${
      ctaBottomText.getBoundingClientRect().bottom + document.documentElement.scrollTop - LINE_WIDTH
    }px`;
    horizontalLine12.style.cssText = `top: ${
      advantagesVideoWrapper.getBoundingClientRect().top + document.documentElement.scrollTop
    }px`;
    horizontalLine13.style.cssText = `top: ${
      advantagesTitle.getBoundingClientRect().top + document.documentElement.scrollTop
    }px; right: ${document.body.clientWidth - container.getBoundingClientRect().right}px`;
    horizontalLine14.style.cssText = `top: ${
      advantagesTitle.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
    horizontalLine15.style.cssText = `top: ${
      advantagesDescription.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
    horizontalLine16.style.cssText = `top: ${
      advantagesVideoWrapper.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
    horizontalLine17.style.cssText = `top: ${
      advantagesItem1Icon.getBoundingClientRect().top + document.documentElement.scrollTop
    }px; right: ${document.body.clientWidth - container.getBoundingClientRect().right}px`;
    horizontalLine18.style.cssText = `top: ${
      advantagesItem1Icon.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
    horizontalLine19.style.cssText = `top: ${
      advantagesItem1Title.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
    horizontalLine20.style.cssText = `top: ${
      advantagesItem1Description.getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      LINE_WIDTH
    }px`;
  }, []);

  return (
    <>
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
    </>
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
