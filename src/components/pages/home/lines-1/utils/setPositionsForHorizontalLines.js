import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForHorizontalLines() {
  const horizontalLine2 = document.querySelector('#lines-1-horizontal-line-2');
  const horizontalLine3 = document.querySelector('#lines-1-horizontal-line-3');
  const horizontalLine4 = document.querySelector('#lines-1-horizontal-line-4');
  const horizontalLine5 = document.querySelector('#lines-1-horizontal-line-5');
  const horizontalLine7 = document.querySelector('#lines-1-horizontal-line-7');
  const horizontalLine8 = document.querySelector('#lines-1-horizontal-line-8');
  const horizontalLine9 = document.querySelector('#lines-1-horizontal-line-9');
  const horizontalLine10 = document.querySelector('#lines-1-horizontal-line-10');
  const horizontalLine11 = document.querySelector('#lines-1-horizontal-line-11');
  const horizontalLine12 = document.querySelector('#lines-1-horizontal-line-12');
  const horizontalLine13 = document.querySelector('#lines-1-horizontal-line-13');
  const horizontalLine14 = document.querySelector('#lines-1-horizontal-line-14');
  const horizontalLine15 = document.querySelector('#lines-1-horizontal-line-15');
  const horizontalLine16 = document.querySelector('#lines-1-horizontal-line-16');
  const horizontalLine17 = document.querySelector('#lines-1-horizontal-line-17');
  const horizontalLine18 = document.querySelector('#lines-1-horizontal-line-18');
  const horizontalLine19 = document.querySelector('#lines-1-horizontal-line-19');
  const horizontalLine20 = document.querySelector('#lines-1-horizontal-line-20');

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
  const verticalLine9 = document.querySelector('#lines-1-vertical-line-9');

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
