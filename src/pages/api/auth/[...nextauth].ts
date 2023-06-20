import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

export const authOptions = {
  providers: [
    {
      id: "imgur",
      name: "Imgur",
      type: "oauth",
      version: "2.0",
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      authorization: {
        url: "https://api.imgur.com/oauth2/authorize?response_type=token",
      },
      async profile(profile, _tokens) {
        console.log("profile??", profile);
        return {
          id: "0",
          name: "imgur",
          email: "",
          image: "",
        };
      },
    },
  ],
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
