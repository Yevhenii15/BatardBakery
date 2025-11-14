export function generateBookingNumber() {
  // simple unique-ish human-friendly code, e.g. B-20251114-ABCD
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `B-${date}-${rand}`;
}
