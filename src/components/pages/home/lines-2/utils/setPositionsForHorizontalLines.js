import LINE_WIDTH from 'constants/line-width';
import $ from 'utils/$';

export default function setPositionsForHorizontalLines() {
  const horizontalLine1 = $('#lines-2-horizontal-line-1');
  const horizontalLine2 = $('#lines-2-horizontal-line-2');
  const horizontalLine3 = $('#lines-2-horizontal-line-3');
  const horizontalLine4 = $('#lines-2-horizontal-line-4');
  const horizontalLine5 = $('#lines-2-horizontal-line-5');
  // const horizontalLine6 = $('#lines-2-horizontal-line-6');
  // const horizontalLine7 = $('#lines-2-horizontal-line-7');
  // const horizontalLine8 = $('#lines-2-horizontal-line-8');
  // const horizontalLine9 = $('#lines-2-horizontal-line-9');
  const horizontalLine10 = $('#lines-2-horizontal-line-10');
  const horizontalLine11 = $('#lines-2-horizontal-line-11');
  const horizontalLine12 = $('#lines-2-horizontal-line-12');
  const horizontalLine13 = $('#lines-2-horizontal-line-13');
  const horizontalLine14 = $('#lines-2-horizontal-line-14');
  const horizontalLine15 = $('#lines-2-horizontal-line-15');
  const horizontalLine16 = $('#lines-2-horizontal-line-16');

  const features = $('#features');
  const featuresTitle = $('#features-title');
  const featuresItem1Icon = $('#features-item-1-icon');
  const featuresItem1Title = $('#features-item-1-title');
  const featuresItem1Description = $('#features-item-1-description');
  // const featuresItem4Icon = $('#features-item-4-icon');
  // const featuresItem4Title = $('#features-item-4-title');
  // const featuresItem4Description = $('#features-item-4-description');
  const saasTitle = $('#saas-title');
  const saasDescription = $('#saas-description');
  const saasButton = $('#saas-button');
  const saasIllustration = $('#saas-illustration');
  const verticalLine2 = $('#lines-2-vertical-line-2');

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

  // horizontalLine6.style.cssText = `
  //   top: ${featuresItem4Icon.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
  // `;

  // horizontalLine7.style.cssText = `
  //   top: ${
  //     featuresItem4Icon.getBoundingClientRect().bottom -
  //     features.getBoundingClientRect().top -
  //     LINE_WIDTH
  //   }px;
  // `;

  // horizontalLine8.style.cssText = `
  //   top: ${
  //     featuresItem4Title.getBoundingClientRect().bottom -
  //     features.getBoundingClientRect().top -
  //     LINE_WIDTH
  //   }px;
  // `;

  // horizontalLine9.style.cssText = `
  //   top: ${
  //     featuresItem4Description.getBoundingClientRect().bottom -
  //     features.getBoundingClientRect().top -
  //     LINE_WIDTH
  //   }px;
  // `;

  horizontalLine10.style.cssText = `
    top: ${
      saasIllustration?.getBoundingClientRect().top -
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
      saasIllustration?.getBoundingClientRect().bottom - features.getBoundingClientRect().top
    }px;
  `;
}
