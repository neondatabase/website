import LINE_WIDTH from 'constants/line-width';
import $ from 'utils/$';

export default function setPositionsForShapes() {
  const shape1 = $('#lines-1-shape-1');
  const shape2 = $('#lines-1-shape-2');
  const shape3 = $('#lines-1-shape-3');
  const shape4 = $('#lines-1-shape-4');
  const shape5 = $('#lines-1-shape-5');
  // const shape6 = $('#lines-1-shape-6');
  // const shape7 = $('#lines-1-shape-7');
  const shape8 = $('#lines-1-shape-8');

  const advantages = $('#advantages');
  const verticalLine2 = $('#lines-1-vertical-line-2');
  const verticalLine3 = $('#lines-1-vertical-line-3');
  const verticalLine4 = $('#lines-1-vertical-line-4');
  const verticalLine6 = $('#lines-1-vertical-line-6');
  // const verticalLine7 = $('#lines-1-vertical-line-7');
  // const verticalLine8 = $('#lines-1-vertical-line-8');
  const verticalLine9 = $('#lines-1-vertical-line-9');
  const horizontalLine1 = $('#lines-1-horizontal-line-1');
  const horizontalLine2 = $('#lines-1-horizontal-line-2');
  const horizontalLine6 = $('#lines-1-horizontal-line-6');
  const horizontalLine7 = $('#lines-1-horizontal-line-7');
  const horizontalLine8 = $('#lines-1-horizontal-line-8');
  const horizontalLine10 = $('#lines-1-horizontal-line-10');
  const horizontalLine11 = $('#lines-1-horizontal-line-11');
  // const horizontalLine12 = $('#lines-1-horizontal-line-12');
  // const horizontalLine16 = $('#lines-1-horizontal-line-16');
  const horizontalLine17 = $('#lines-1-horizontal-line-17');
  const horizontalLine19 = $('#lines-1-horizontal-line-19');

  shape1.style.cssText = `
    top: -${LINE_WIDTH}px; 
    left: ${verticalLine2.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine3.getBoundingClientRect().right}px; 
    height: ${
      horizontalLine1.getBoundingClientRect().bottom +
      document.documentElement.scrollTop +
      LINE_WIDTH
    }px;
  `;

  shape2.style.cssText = `
    top: ${horizontalLine1.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine4.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine6.getBoundingClientRect().right}px;
    height: ${
      horizontalLine2.getBoundingClientRect().bottom -
      horizontalLine1.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape3.style.cssText = `
    top: ${horizontalLine6.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine3.getBoundingClientRect().right}px;
    height: ${
      horizontalLine7.getBoundingClientRect().bottom -
      horizontalLine6.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape4.style.cssText = `
    top: ${horizontalLine8.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine9.getBoundingClientRect().left}px;
    right: 0px;
    height: ${
      horizontalLine10.getBoundingClientRect().bottom -
      horizontalLine8.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape5.style.cssText = `
    top: ${horizontalLine11.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px;
    height: ${
      horizontalLine17.getBoundingClientRect().bottom -
      horizontalLine11.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  // shape6.style.cssText = `
  //   top: ${horizontalLine11.getBoundingClientRect().top + document.documentElement.scrollTop}px;
  //   left: ${verticalLine8.getBoundingClientRect().left}px;
  //   right: ${document.body.clientWidth - verticalLine9.getBoundingClientRect().right}px;
  //   height: ${
  //     horizontalLine12.getBoundingClientRect().bottom -
  //     horizontalLine11.getBoundingClientRect().bottom +
  //     LINE_WIDTH
  //   }px;
  // `;

  // shape7.style.cssText = `
  //   top: ${horizontalLine16.getBoundingClientRect().top + document.documentElement.scrollTop}px;
  //   left: ${verticalLine6.getBoundingClientRect().left}px;
  //   right: ${document.body.clientWidth - verticalLine7.getBoundingClientRect().right}px;
  //   height: ${
  //     horizontalLine17.getBoundingClientRect().bottom -
  //     horizontalLine16.getBoundingClientRect().bottom +
  //     LINE_WIDTH
  //   }px;
  // `;

  shape8.style.cssText = `
    top: ${horizontalLine19.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${verticalLine2.getBoundingClientRect().left}px;
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px;
    height: ${
      advantages.getBoundingClientRect().bottom -
      horizontalLine19.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;
}
