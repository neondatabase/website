import LINE_WIDTH from 'constants/line-width';

export default function setPositionsForShapes() {
  const shape1 = document.querySelector('#lines-2-shape-1');
  const shape2 = document.querySelector('#lines-2-shape-2');
  const shape3 = document.querySelector('#lines-2-shape-3');
  const shape4 = document.querySelector('#lines-2-shape-4');

  const features = document.querySelector('#features');
  const saas = document.querySelector('#saas');
  const verticalLine2 = document.querySelector('#lines-2-vertical-line-2');
  const verticalLine3 = document.querySelector('#lines-2-vertical-line-3');
  const verticalLine4 = document.querySelector('#lines-2-vertical-line-4');
  const verticalLine5 = document.querySelector('#lines-2-vertical-line-5');
  const verticalLine9 = document.querySelector('#lines-2-vertical-line-9');
  const verticalLine11 = document.querySelector('#lines-2-vertical-line-10');
  const horizontalLine7 = document.querySelector('#lines-2-horizontal-line-7');
  const horizontalLine10 = document.querySelector('#lines-2-horizontal-line-10');
  const horizontalLine11 = document.querySelector('#lines-2-horizontal-line-11');
  const horizontalLine14 = document.querySelector('#lines-2-horizontal-line-14');
  const horizontalLine16 = document.querySelector('#lines-2-horizontal-line-16');

  shape1.style.cssText = `
    top: ${horizontalLine7.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${verticalLine9.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine11.getBoundingClientRect().right}px; 
    height: ${
      horizontalLine10.getBoundingClientRect().bottom -
      horizontalLine7.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape2.style.cssText = `
    top: ${horizontalLine10.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${verticalLine2.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px; 
    height: ${
      horizontalLine11.getBoundingClientRect().bottom -
      horizontalLine10.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape3.style.cssText = `
    top: ${horizontalLine14.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${verticalLine4.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine5.getBoundingClientRect().right}px; 
    height: ${
      horizontalLine16.getBoundingClientRect().bottom -
      horizontalLine14.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;

  shape4.style.cssText = `
    top: ${horizontalLine16.getBoundingClientRect().top - features.getBoundingClientRect().top}px;
    left: ${verticalLine3.getBoundingClientRect().left}px; 
    right: ${document.body.clientWidth - verticalLine4.getBoundingClientRect().right}px; 
    height: ${
      saas.getBoundingClientRect().bottom -
      horizontalLine16.getBoundingClientRect().bottom +
      LINE_WIDTH
    }px;
  `;
}
