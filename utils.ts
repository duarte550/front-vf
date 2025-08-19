export const formatToMillionsBRL = (value: number): string => {
  if (value === undefined || value === null) return 'N/A';
  if (value < 1000000) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }
  const millions = value / 1000000;
  const formatted = millions.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `R$ ${formatted}M`;
};
