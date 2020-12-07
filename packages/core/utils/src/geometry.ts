const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

type Axis = 'x' | 'y';

type Side = typeof SIDE_OPTIONS[number];

type Align = typeof ALIGN_OPTIONS[number];

type Point = { x: number; y: number };

type Size = { width: number; height: number };

/**
 * Creates a rect (`ClientRect`) based on a Size and and a position (x, y).
 * This is useful to compute the rect of an element without having to actually move it.
 */
function makeRect({ width, height }: Size, { x, y }: Point): ClientRect {
  return DOMRect.fromRect({ width, height, x, y });
}

/**
 * Gets the opposite side of a given side (ie. top => bottom, left => right, …)
 */
function getOppositeSide(side: Side): Side {
  const oppositeSides: Record<Side, Side> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  };
  return oppositeSides[side];
}

/**
 * Returns whether 2 rects are equal in values
 */
function rectEquals(rect1: ClientRect, rect2: ClientRect) {
  return (
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom &&
    rect1.left === rect2.left
  );
}

function isInsideRect(rect: ClientRect, point: Point, { inclusive = true } = {}) {
  if (inclusive) {
    return (
      point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
    );
  } else {
    return (
      point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom
    );
  }
}

/**
 * Gets collisions for each side of a rect (top, right, bottom, left)
 */
function getCollisions(
  /** The rect to test collisions against */
  rect: ClientRect,
  /** An optional tolerance if you want the collisions to trigger a bit before/after */
  tolerance = 0
) {
  return {
    top: rect.top < tolerance,
    right: rect.right > window.innerWidth - tolerance,
    bottom: rect.bottom > window.innerHeight - tolerance,
    left: rect.left < tolerance,
  };
}

export {
  SIDE_OPTIONS,
  ALIGN_OPTIONS,
  makeRect,
  getOppositeSide,
  rectEquals,
  isInsideRect,
  getCollisions,
};
export type { Axis, Side, Align, Point, Size };
