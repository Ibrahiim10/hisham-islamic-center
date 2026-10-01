export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
