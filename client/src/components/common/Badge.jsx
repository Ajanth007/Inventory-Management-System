const TONES = {
  red: 'bg-red-50 text-critical ring-red-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  green: 'bg-green-50 text-ok ring-green-200',
  blue: 'bg-blue-50 text-primary ring-blue-200',
  gray: 'bg-slate-100 text-muted ring-slate-200',
};
export default function Badge({ tone = 'gray', children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}>
      {children}
    </span>
  );
}
// Shared status → tone maps for sales/purchases tables.
export const PAYMENT_TONE = { paid: 'green', partial: 'amber', pending: 'red' };
export const SALE_TONE = { completed: 'green', confirmed: 'blue', cancelled: 'gray' };
export const PURCHASE_TONE = { received: 'green', ordered: 'blue', draft: 'gray' };

const STATUS_TONE = {
  green: ['paid', 'completed', 'received', 'active', 'in', 'in_stock', 'accepted'],
  blue: ['confirmed', 'ordered', 'issued', 'adjustment'],
  amber: ['pending', 'partial', 'low', 'draft', 'invited'],
  red: ['overdue', 'critical', 'out', 'out_of_stock', 'failed'],
  gray: ['cancelled', 'inactive', 'archived'],
};
// One badge for every status string used in the module pages.
export function StatusBadge({ value }) {
  const tone = Object.keys(STATUS_TONE).find((t) => STATUS_TONE[t].includes(value)) || 'gray';
  const label = String(value).replace(/_/g, ' ');
  return <Badge tone={tone}>{label[0].toUpperCase() + label.slice(1)}</Badge>;
}
