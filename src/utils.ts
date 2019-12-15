/**
 * @description
 * Check that amount of JS files is even with the amount of HTML templates
 */
export function isBalanced(...targets: Object[]): boolean {
  if (!targets.length) {
    return false;
  }

  let [firstItem, ...restItems] = targets;
  let firstItemLength = Object.keys(firstItem).length;

  return restItems.every((t) => Object.keys(t).length === firstItemLength);
}
