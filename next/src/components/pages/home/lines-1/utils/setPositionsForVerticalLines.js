import LINE_WIDTH from 'constants/line-width';
import $ from 'utils/$';

export default function setPositionsForVerticalLines() {
  const verticalLine1 = $('#lines-1-vertical-line-1');
  const verticalLine2 = $('#lines-1-vertical-line-2');
  const verticalLine3 = $('#lines-1-vertical-line-3');
  const verticalLine4 = $('#lines-1-vertical-line-4');
  const verticalLine5 = $('#lines-1-vertical-line-5');
  const verticalLine6 = $('#lines-1-vertical-line-6');
  const verticalLine7 = $('#lines-1-vertical-line-7');
  const verticalLine8 = $('#lines-1-vertical-line-8');
  const verticalLine9 = $('#lines-1-vertical-line-9');

  const container = $('#container');
  const heroButton = $('#hero-button');
  const ctaInputBackground = $('#cta-input-background');
  const advantagesItem1Icon = $('#advantages-item-1-icon');
  const advantagesItem2Icon = $('#advantages-item-2-icon');
  const advantagesItem3Icon = $('#advantages-item-3-icon');
  const horizontalLine1 = $('#lines-1-horizontal-line-1');
  const horizontalLine7 = $('#lines-1-horizontal-line-7');
  const horizontalLine8 = $('#lines-1-horizontal-line-8');

  verticalLine1.style.cssText = `
    left: ${container.getBoundingClientRect().left}px;
  `;

  verticalLine2.style.cssText = `
    left: ${advantagesItem1Icon.getBoundingClientRect().right - LINE_WIDTH}px;
  `;

  verticalLine3.style.cssText = `
    left: ${heroButton.getBoundingClientRect().right - LINE_WIDTH}px;
    height: ${horizontalLine8.getBoundingClientRect().top + document.documentElement.scrollTop}px;
  `;

  verticalLine4.style.cssText = `
    left: ${ctaInputBackground.getBoundingClientRect().left}px;
  `;

  verticalLine5.style.cssText = `
    left: ${advantagesItem2Icon.getBoundingClientRect().left}px;
  `;

  verticalLine6.style.cssText = `
    left: ${advantagesItem2Icon.getBoundingClientRect().right - LINE_WIDTH}px;
  `;

  verticalLine7.style.cssText = `
    top: ${horizontalLine1.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${advantagesItem3Icon.getBoundingClientRect().left}px;
  `;

  verticalLine8.style.cssText = `
    left: ${advantagesItem3Icon.getBoundingClientRect().right - LINE_WIDTH}px;
  `;

  verticalLine9.style.cssText = `
    top: ${horizontalLine7.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${container.getBoundingClientRect().right - 81 - LINE_WIDTH}px;
  `;
}
