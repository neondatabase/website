import setPositionsForCircles from './setPositionsForCircles';
import setPositionsForCirclesWithText from './setPositionsForCirclesWithText';
import setPositionsForDottedHorizontalLines from './setPositionsForDottedHorizontalLines';
import setPositionsForDottedVerticalLines from './setPositionsForDottedVerticalLines';
import setPositionsForHorizontalLines from './setPositionsForHorizontalLines';
import setPositionsForShapes from './setPositionsForShapes';
import setPositionsForVerticalLines from './setPositionsForVerticalLines';

export default function setPositionsForElements() {
  if (window.innerWidth >= 1024) {
    setPositionsForVerticalLines();
    setPositionsForHorizontalLines();
    // We have to call setPositionsForVerticalLines again because there is a dependency on horizontal line
    // which is being positioned after first call of setPositionsForVerticalLines
    // We can't swap calls of these functions because horizontal lines depend on vertical lines too
    // We will have to make additional call any way
    setPositionsForVerticalLines();
    setPositionsForShapes();
    setPositionsForCircles();
    setPositionsForCirclesWithText();
    setPositionsForDottedVerticalLines();
    setPositionsForDottedHorizontalLines();
  }
}
