import format from "date-fns/format";

export function formatDateTime(timestamp: number): string {
  const fileDate = new Date(timestamp);
  return format(fileDate, "dd MMM yyyy, HH:mm");
}
