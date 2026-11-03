export const formatCurrency = (amount: number): string => {
  return '₹' + (amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};
