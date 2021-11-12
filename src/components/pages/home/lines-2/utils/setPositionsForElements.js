import setPositionsForCircles from './setPositionsForCircles';
import setPositionsForCirclesWithText from './setPositionsForCirclesWithText';
import setPositionsForDottedVerticalLines from './setPositionsForDottedVerticalLines';
import setPositionsForHorizontalLines from './setPositionsForHorizontalLines';
import setPositionsForShapes from './setPositionsForShapes';
import setPositionsForVerticalLines from './setPositionsForVerticalLines';

export default function setPositionsForElements() {
  if (window.innerWidth >= 1024) {
    setPositionsForVerticalLines();
    setPositionsForHorizontalLines();
    setPositionsForShapes();
    setPositionsForCircles();
    setPositionsForCirclesWithText();
    setPositionsForDottedVerticalLines();
  }
}
