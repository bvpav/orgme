import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import clsx from "clsx";
import { Inter } from "next/font/google";
import Link from "next/link";
import { TbDots, TbUpload } from "react-icons/tb";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OrgMe",
  description: "OrgMe - The world's comfiest image sharing platform.",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={clsx(
            inter.className,
            "min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-emerald-950 bg-no-repeat text-white"
          )}
        >
          <header className="mb-4 flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-5">
              <Link
                className="relative text-xl font-extrabold transition-transform hover:scale-105"
                href="/"
              >
                OrgMe
                <span className="absolute bottom-0 right-0 -z-10 translate-x-3 translate-y-1 select-none text-xs">
                  🥺
                </span>
              </Link>
              <Button
                asChild
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link href="/upload">
                  <TbUpload /> Upload
                </Link>
              </Button>
            </div>

            <SignedIn>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="border-white/10 md:border-r md:px-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="sm:hidden">
                        <TbDots />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-0">
                      <DropdownMenuItem asChild>
                        <Link href="/user">My images</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/user">My images</Link>
                  </Button>
                </div>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <SignUpButton />
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <SignInButton />
                </Button>
              </div>
            </SignedOut>
          </header>
          {children}
          <footer className="mt-7 grid place-items-center pb-3">
            <p className="text-md font-light">
              This is an{" "}
              <Link
                className="underline decoration-dashed transition-transform hover:scale-105 hover:font-medium hover:underline-offset-2"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/bvpav/orgme"
              >
                Imgur clone
              </Link>
              .
            </p>
          </footer>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
