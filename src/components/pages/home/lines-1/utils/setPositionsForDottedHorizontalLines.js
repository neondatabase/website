import $ from 'utils/$';

export default function setPositionsForDottedHorizontalLines() {
  const dottedHorizontalLine1 = $('#lines-1-dotted-horizontal-line-1');

  const horizontalLine11 = $('#lines-1-horizontal-line-11');
  const circle5 = $('#lines-1-circle-5');

  dottedHorizontalLine1.style.cssText = `
    top: ${horizontalLine11.getBoundingClientRect().top + document.documentElement.scrollTop}px;
    left: ${circle5.getBoundingClientRect().right}px;
    width: 100vw;
  `;
}
