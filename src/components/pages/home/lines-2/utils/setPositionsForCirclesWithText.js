import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForCirclesWithText() {
  const circleWithText1 = document.querySelector('#lines-2-circle-with-text-1');
  const circleWithText2 = document.querySelector('#lines-2-circle-with-text-2');
  const circleWithText3 = document.querySelector('#lines-2-circle-with-text-3');

  const features = document.querySelector('#features');
  const saas = document.querySelector('#saas');
  const verticalLine2 = document.querySelector('#lines-2-vertical-line-2');
  const verticalLine6 = document.querySelector('#lines-2-vertical-line-6');
  const verticalLine7 = document.querySelector('#lines-2-vertical-line-7');
  const horizontalLine1 = document.querySelector('#lines-2-horizontal-line-1');
  const horizontalLine9 = document.querySelector('#lines-2-horizontal-line-9');
  const horizontalLine10 = document.querySelector('#lines-2-horizontal-line-10');
  const horizontalLine16 = document.querySelector('#lines-2-horizontal-line-16');

  circleWithText1.style.cssText = `
    top: ${
      (horizontalLine1.getBoundingClientRect().top - features.getBoundingClientRect().top) / 2
    }px;
    left: ${verticalLine7.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circleWithText2.style.cssText = `
    top: ${
      horizontalLine9.getBoundingClientRect().top -
      features.getBoundingClientRect().top +
      (horizontalLine10.getBoundingClientRect().top - horizontalLine9.getBoundingClientRect().top) /
        1.8
    }px;
    left: ${verticalLine2.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;

  circleWithText3.style.cssText = `
    top: ${
      horizontalLine16.getBoundingClientRect().top -
      features.getBoundingClientRect().top +
      (saas.getBoundingClientRect().bottom - horizontalLine16.getBoundingClientRect().top) / 2.1
    }px;
    left: ${verticalLine6.getBoundingClientRect().left + LINE_WIDTH / 2}px;
  `;
}
