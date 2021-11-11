import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForCircles() {
  const circle1 = document.querySelector('#lines-2-circle-1');
  const circle2 = document.querySelector('#lines-2-circle-2');

  const features = document.querySelector('#features');
  const verticalLine11 = document.querySelector('#lines-2-vertical-line-11');
  const horizontalLine1 = document.querySelector('#lines-2-horizontal-line-1');
  const horizontalLine7 = document.querySelector('#lines-2-horizontal-line-7');

  circle1.style.cssText = `
    top: ${
      horizontalLine1.getBoundingClientRect().top -
      features.getBoundingClientRect().top +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine11.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circle2.style.cssText = `
    top: ${
      horizontalLine7.getBoundingClientRect().top -
      features.getBoundingClientRect().top +
      LINE_WIDTH / 2
    }px;
    left: ${verticalLine11.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;
}
