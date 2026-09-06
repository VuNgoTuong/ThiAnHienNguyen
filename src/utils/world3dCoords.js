export const WORLD_WIDTH = 24
export const WORLD_DEPTH = 24

export function percentToWorld3D(x, y) {
  return {
    x: (x / 100) * WORLD_WIDTH - WORLD_WIDTH / 2,
    z: (y / 100) * WORLD_DEPTH - WORLD_DEPTH / 2,
  }
}
