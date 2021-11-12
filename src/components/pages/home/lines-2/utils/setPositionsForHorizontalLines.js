import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForHorizontalLines() {
  const horizontalLine1 = document.querySelector('#lines-2-horizontal-line-1');
  const horizontalLine2 = document.querySelector('#lines-2-horizontal-line-2');
  const horizontalLine3 = document.querySelector('#lines-2-horizontal-line-3');
  const horizontalLine4 = document.querySelector('#lines-2-horizontal-line-4');
  const horizontalLine5 = document.querySelector('#lines-2-horizontal-line-5');
  const horizontalLine6 = document.querySelector('#lines-2-horizontal-line-6');
  const horizontalLine7 = document.querySelector('#lines-2-horizontal-line-7');
  const horizontalLine8 = document.querySelector('#lines-2-horizontal-line-8');
  const horizontalLine9 = document.querySelector('#lines-2-horizontal-line-9');
  const horizontalLine10 = document.querySelector('#lines-2-horizontal-line-10');
  const horizontalLine11 = document.querySelector('#lines-2-horizontal-line-11');
  const horizontalLine12 = document.querySelector('#lines-2-horizontal-line-12');
  const horizontalLine13 = document.querySelector('#lines-2-horizontal-line-13');
  const horizontalLine14 = document.querySelector('#lines-2-horizontal-line-14');
  const horizontalLine15 = document.querySelector('#lines-2-horizontal-line-15');
  const horizontalLine16 = document.querySelector('#lines-2-horizontal-line-16');

  const features = document.querySelector('#features');
  const featuresTitle = document.querySelector('#features-title');
  const featuresItem1Icon = document.querySelector('#features-item-1-icon');
  const featuresItem1Title = document.querySelector('#features-item-1-title');
  const featuresItem1Description = document.querySelector('#features-item-1-description');
  const featuresItem4Icon = document.querySelector('#features-item-4-icon');
  const featuresItem4Title = document.querySelector('#features-item-4-title');
  const featuresItem4Description = document.querySelector('#features-item-4-description');
  const saasTitle = document.querySelector('#saas-title');
  const saasDescription = document.querySelector('#saas-description');
  const saasButton = document.querySelector('#saas-button');
  const saasIllustration = document.querySelector('#saas-illustration');
  const verticalLine2 = document.querySelector('#lines-2-vertical-line-2');

  horizontalLine1.style.cssText = `
    top: ${featuresTitle.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
  `;

  horizontalLine2.style.cssText = `
    top: ${featuresItem1Icon.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
  `;

  horizontalLine3.style.cssText = `
    top: ${
      featuresItem1Icon.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine4.style.cssText = `
    top: ${
      featuresItem1Title.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine5.style.cssText = `
    top: ${
      featuresItem1Description.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine6.style.cssText = `
    top: ${featuresItem4Icon.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
  `;

  horizontalLine7.style.cssText = `
    top: ${
      featuresItem4Icon.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine8.style.cssText = `
    top: ${
      featuresItem4Title.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine9.style.cssText = `
    top: ${
      featuresItem4Description.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine10.style.cssText = `
    top: ${
      saasIllustration.getBoundingClientRect().top -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine11.style.cssText = `
    top: ${saasTitle.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
  `;

  horizontalLine12.style.cssText = `
    top: ${
      saasTitle.getBoundingClientRect().bottom - features.getBoundingClientRect().top - LINE_WIDTH
    }px;
  `;

  horizontalLine13.style.cssText = `
    top: ${
      saasDescription.getBoundingClientRect().bottom -
      features.getBoundingClientRect().top -
      LINE_WIDTH
    }px;
  `;

  horizontalLine14.style.cssText = `
    top: ${saasButton.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
  `;

  horizontalLine15.style.cssText = `
    top: ${
      saasButton.getBoundingClientRect().bottom - features.getBoundingClientRect().top - LINE_WIDTH
    }px;
  `;

  horizontalLine16.style.cssText = `
    top: ${
      saasIllustration.getBoundingClientRect().bottom - features.getBoundingClientRect().top
    }px;
  `;
}
