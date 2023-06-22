import { User } from "@clerk/nextjs/api";

export function getPublicUserId(clerkUserId: string) {
  const reversed = clerkUserId.split("").reverse().join("");
  const urlsafeB64 = btoa(reversed)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return urlsafeB64;
}

export function getClerkUserId(publicUserId: string) {
  const b64 = publicUserId
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(publicUserId.length + ((4 - (publicUserId.length % 4)) % 4), "=");
  const reversed = atob(b64);
  return reversed.split("").reverse().join("");
}

export function getUserDisplayName(user: User) {
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "User " + getPublicUserId(user.id)
  );
}
