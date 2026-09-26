import type { Product } from './products';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const customer: Customer = {
  firstName: 'Marie',
  lastName: 'Tremblay',
  postalCode: 'H2X 1Y4',
};

const taxRate = 0.08;

export interface OrderSummary {
  itemTotal: number;
  tax: number;
  total: number;
}

// Summed in cents so floating-point drift cannot leak into the expected values.
export function orderSummary(items: Product[]): OrderSummary {
  const itemTotal = items.reduce((sum, item) => sum + Math.round(item.price * 100), 0);
  const tax = Math.round(itemTotal * taxRate);
  return { itemTotal: itemTotal / 100, tax: tax / 100, total: (itemTotal + tax) / 100 };
}
