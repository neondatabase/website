import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForCircles() {
  const circle1 = document.querySelector('#lines-1-circle-1');
  const circle2 = document.querySelector('#lines-1-circle-2');
  const circle3 = document.querySelector('#lines-1-circle-3');
  const circle4 = document.querySelector('#lines-1-circle-4');
  const circle5 = document.querySelector('#lines-1-circle-5');
  const circle6 = document.querySelector('#lines-1-circle-6');
  const circle7 = document.querySelector('#lines-1-circle-7');

  const verticalLine2 = document.querySelector('#lines-1-vertical-line-2');
  const verticalLine4 = document.querySelector('#lines-1-vertical-line-4');
  const verticalLine7 = document.querySelector('#lines-1-vertical-line-7');
  const verticalLine9 = document.querySelector('#lines-1-vertical-line-9');
  const horizontalLine6 = document.querySelector('#lines-1-horizontal-line-6');
  const horizontalLine7 = document.querySelector('#lines-1-horizontal-line-7');
  const horizontalLine11 = document.querySelector('#lines-1-horizontal-line-11');
  const horizontalLine16 = document.querySelector('#lines-1-horizontal-line-16');
  const horizontalLine17 = document.querySelector('#lines-1-horizontal-line-17');

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
