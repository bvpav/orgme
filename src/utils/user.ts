import { User } from "@clerk/nextjs/api";

export function getPublicUserId(clerkUserId: string) {
  const urlsafeB64 = btoa(clerkUserId)
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
  return atob(b64);
}

export function getUserDisplayName(user: User) {
  return (
    [user.firstName, user.lastName].join(" ") ||
    user.username ||
    "User " + getPublicUserId(user.id)
  );
}
