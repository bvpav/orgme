export function getPostTitle(postTitle: string) {
  return postTitle || "Untitled image";
}

export function ellipsisText(text: string, length: number) {
  if (text.length <= length + 3) return text;
  return text.length > length ? `${text.slice(0, length)}...` : text;
}
