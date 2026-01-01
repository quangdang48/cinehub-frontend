import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function timeAgo(date: Date | number | string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
}
