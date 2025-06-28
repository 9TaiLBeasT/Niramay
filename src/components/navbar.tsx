"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Recycle } from "lucide-react";
import UserProfile from "./user-profile";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          <Recycle className="w-6 h-6" />
          <span>Niramay</span>
          <span className="text-lg">🇮🇳</span>
        </Link>
        <div className="flex gap-3 items-center">
          {loading ? (
            <div className="w-20 h-9 bg-gray-200 animate-pulse rounded" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-green-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Join Niramay
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
