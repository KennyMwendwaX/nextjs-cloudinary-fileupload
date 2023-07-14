import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export function formatDateTime(timestamp: number): string {
  const fileDate = new Date(timestamp);
  return format(fileDate, "dd MMM yyyy, HH:mm");
}
