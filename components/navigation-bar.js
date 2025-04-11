"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapIcon, UserPlus, LogIn, Clock, Waves } from "lucide-react";

export function NavigationBar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MapIcon className="h-6 w-6 text-sky-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Lakes Explorer
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-sky-700 hover:text-sky-800 hover:bg-sky-50">
                <Waves className="h-4 w-4" />
                <span>Lakes</span>
              </Button>
            </Link>
            <Link href="/realtime">
              <Button variant="ghost" className="flex items-center space-x-2 text-sky-700 hover:text-sky-800 hover:bg-sky-50">
                <Clock className="h-4 w-4" />
                <span>Realtime View</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" className="flex items-center space-x-2 text-sky-700 hover:text-sky-800 hover:bg-sky-50">
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}