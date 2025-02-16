"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        {session ? (
          <>
            <span>Welcome, {user.username || user.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
