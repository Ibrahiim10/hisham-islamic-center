/** Whole years between date of birth (YYYY-MM-DD) and today. */
export function ageFromDateOfBirth(isoDate: string): number {
  const dob = new Date(`${isoDate}T12:00:00.000Z`);
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}
