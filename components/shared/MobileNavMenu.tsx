"use client";

import { useState } from "react";

export function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg border border-custom-gray0 p-2 text-custom-gray2 transition hover:bg-custom-gray0"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div className="absolute top-full right-4 left-4 mt-3 rounded-xl border border-custom-gray0 bg-white/95 p-3 shadow-sm backdrop-blur sm:right-6 sm:left-6">
          <div className="flex flex-col gap-2">
            <a
              href="#"
              className="rounded-lg px-3 py-2 text-sm text-custom-gray2 transition hover:bg-custom-gray0"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="rounded-lg bg-custom-primary px-3 py-2 text-center text-sm font-medium text-custom-background transition hover:opacity-90"
            >
              Clerk Login
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
