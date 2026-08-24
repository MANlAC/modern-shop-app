export function formatNPR(n: number) {
  return `Rs.${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
