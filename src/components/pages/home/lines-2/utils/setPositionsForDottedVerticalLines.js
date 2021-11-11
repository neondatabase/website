export default function setPositionsForDottedVerticalLines() {
  const dottedVerticalLine1 = document.querySelector('#lines-2-dotted-vertical-line-1');

  const features = document.querySelector('#features');
  const verticalLine11 = document.querySelector('#lines-2-vertical-line-11');
  const circle1 = document.querySelector('#lines-2-circle-1');
  const circle2 = document.querySelector('#lines-2-circle-2');

  dottedVerticalLine1.style.cssText = `
    top: ${circle1.getBoundingClientRect().bottom - features.getBoundingClientRect().top}px;
    left: ${verticalLine11.getBoundingClientRect().left}px;
    height: ${circle2.getBoundingClientRect().top - circle1.getBoundingClientRect().bottom}px;
  `;
}
