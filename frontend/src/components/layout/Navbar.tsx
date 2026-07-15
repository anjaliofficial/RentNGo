"use client";

import Link from "next/link";
import Container from "./Container";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            RentNGo
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/equipment">Equipment</Link>
            <Link href="/(auth)/login">Login</Link>
            <Link
              href="/(auth)/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}