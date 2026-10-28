import { DEMO_TARGET_FACTOR } from '../config';
// Rules: out_of_stock (qty = 0) wins; critical <= 25% of min; low <= min; otherwise in_stock.
export function getStockStatus(qty, min) {
  if (qty <= 0) return 'out_of_stock';
  if (qty <= min * 0.25) return 'critical';
  if (qty <= min) return 'low';
  return 'in_stock';
}
export const STATUS_META = {
  out_of_stock: { label: 'Out of Stock', tone: 'red', rank: 0 },
  critical: { label: 'Critical', tone: 'red', rank: 1 },
  low: { label: 'Low Stock', tone: 'amber', rank: 2 },
  in_stock: { label: 'In Stock', tone: 'green', rank: 3 },
};
// Target stock level is separate from the minimum threshold.
export const suggestedReorder = (p) =>
  Math.max(0, (p.targetStock ?? p.minStock * DEMO_TARGET_FACTOR) - p.available);
