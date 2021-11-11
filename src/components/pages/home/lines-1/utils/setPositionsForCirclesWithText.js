import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForCirclesWithText() {
  const circleWithText1 = document.querySelector('#lines-1-circle-with-text-1');
  const circleWithText2 = document.querySelector('#lines-1-circle-with-text-2');
  const circleWithText3 = document.querySelector('#lines-1-circle-with-text-3');
  const circleWithText4 = document.querySelector('#lines-1-circle-with-text-4');

  const advantages = document.querySelector('#advantages');
  const verticalLine3 = document.querySelector('#lines-1-vertical-line-3');
  const verticalLine6 = document.querySelector('#lines-1-vertical-line-6');
  const verticalLine7 = document.querySelector('#lines-1-vertical-line-7');
  const horizontalLine1 = document.querySelector('#lines-1-horizontal-line-1');
  const horizontalLine6 = document.querySelector('#lines-1-horizontal-line-6');
  const horizontalLine7 = document.querySelector('#lines-1-horizontal-line-7');
  const horizontalLine11 = document.querySelector('#lines-1-horizontal-line-11');
  const horizontalLine12 = document.querySelector('#lines-1-horizontal-line-12');
  const horizontalLine20 = document.querySelector('#lines-1-horizontal-line-20');

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
