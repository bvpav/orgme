import "./globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import classnames from "classnames";
import { TbUpload } from "react-icons/tb";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={classnames(
            inter.className,
            "min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-emerald-950 bg-no-repeat"
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
              <Link
                href="/upload"
                className="flex items-center space-x-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                <TbUpload />
                <span>Upload</span>
              </Link>
            </div>

            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </header>
          {children}
          <footer className="mb-3 mt-7 grid place-items-center">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
