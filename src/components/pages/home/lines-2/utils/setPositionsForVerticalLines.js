import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForVerticalLines() {
  const verticalLine1 = document.querySelector('#lines-2-vertical-line-1');
  const verticalLine2 = document.querySelector('#lines-2-vertical-line-2');
  const verticalLine3 = document.querySelector('#lines-2-vertical-line-3');
  const verticalLine4 = document.querySelector('#lines-2-vertical-line-4');
  const verticalLine5 = document.querySelector('#lines-2-vertical-line-5');
  const verticalLine6 = document.querySelector('#lines-2-vertical-line-6');
  const verticalLine7 = document.querySelector('#lines-2-vertical-line-7');
  const verticalLine8 = document.querySelector('#lines-2-vertical-line-8');
  const verticalLine9 = document.querySelector('#lines-2-vertical-line-9');
  const verticalLine10 = document.querySelector('#lines-2-vertical-line-10');
  const verticalLine11 = document.querySelector('#lines-2-vertical-line-11');

  const container = document.querySelector('#container');
  const features = document.querySelector('#features');
  const featuresItem1Icon = document.querySelector('#advantages-item-1-icon');
  const featuresItem2Icon = document.querySelector('#advantages-item-2-icon');
  const featuresItem3Icon = document.querySelector('#advantages-item-3-icon');
  const sassButton = document.querySelector('#saas-button');
  const sassIllustration = document.querySelector('#saas-illustration');

  verticalLine1.style.cssText = `
    left: ${featuresItem1Icon.getBoundingClientRect().left}px
  `;

  verticalLine2.style.cssText = `
    left: ${featuresItem1Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine3.style.cssText = `
    top: ${sassButton.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${sassButton.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine4.style.cssText = `
    left: ${featuresItem2Icon.getBoundingClientRect().left}px
  `;

  verticalLine5.style.cssText = `
    left: ${featuresItem2Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine6.style.cssText = `
    left: ${sassIllustration.getBoundingClientRect().left - LINE_WIDTH}px
  `;

  verticalLine7.style.cssText = `
    left: ${featuresItem3Icon.getBoundingClientRect().left}px
  `;

  verticalLine8.style.cssText = `
    left: ${featuresItem3Icon.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine9.style.cssText = `
    left: ${container.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine10.style.cssText = `
    left: ${container.getBoundingClientRect().right - LINE_WIDTH}px
  `;

  verticalLine11.style.cssText = `
    left: ${container.getBoundingClientRect().right - LINE_WIDTH}px
  `;
}
