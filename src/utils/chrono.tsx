export function formatDate(createdAt: Date) {
  const now = new Date();

  const diff = now.getTime() - createdAt.getTime();

  const MINUTE = 1000 * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  if (diff < MINUTE) {
    return "just now";
  } else if (diff < MINUTE * 2) {
    return "a minute ago";
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)} minutes ago`;
  } else if (diff < HOUR * 2) {
    return "an hour ago";
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)} hours ago`;
  } else if (diff < DAY * 2) {
    return "yesterday";
  } else if (diff < DAY * 7) {
    return `${Math.floor(diff / DAY)} days ago`;
  } else if (diff < DAY * 30) {
    return `${Math.floor(diff / (DAY * 7))} weeks ago`;
  } else if (diff < DAY * 365) {
    return `${Math.floor(diff / (DAY * 30))} months ago`;
  } else {
    return `on ${Intl.DateTimeFormat("en").format(createdAt)}`;
  }
}
