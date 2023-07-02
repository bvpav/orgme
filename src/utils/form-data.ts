export function getOptString(data: FormData, key: string) {
  const value = data.get(key);
  return value?.toString();
}
