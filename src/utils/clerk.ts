import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// HACK: clerk is fucking dogshit and its library functions dont work
//       so here's me rewriting them:
export function actuallyWorkingAuth() {
  const request = new NextRequest("https://hacktues.bg", {
    headers: headers(),
  });
  return getAuth(request);
}
