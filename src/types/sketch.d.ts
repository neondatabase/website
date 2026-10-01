import type p5 from 'p5';

/** A p5 instance-mode sketch. Assign setup, draw, and other callbacks on the instance. */
export type Sketch = (instance: p5) => void;
