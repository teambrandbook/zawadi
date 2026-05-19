export function formatPrice(
  amount: number | string,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  return `${currencyCode} ${Number(amount).toFixed(decimalPlaces)}`;
}

export function formatInclusivePrice(
  sellingPrice: number | string,
  taxRate: number | string,
  currencyCode: string,
  decimalPlaces: number = 2
): string {
  const inclusive = Number(sellingPrice) * (1 + Number(taxRate));
  return formatPrice(inclusive, currencyCode, decimalPlaces);
}
