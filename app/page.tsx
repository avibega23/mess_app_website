import Image from "next/image";
import { Inconsolata } from "next/font/google";
import { MobileNavMenu } from "@/components/shared/MobileNavMenu";
import LoginButton from "@/components/landing/LoginButton";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-landing",
  display: "swap",
});

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bsbh.messrec&pcampaignid=web_share";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/sxwUXJsb";

function GooglePlayBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className="group inline-block transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary focus-visible:ring-offset-2 rounded-lg"
    >
      <Image
        src="/google-play-badge.png"
        alt="Get it on Google Play"
        width={872}
        height={259}
        className="h-[52px] w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
        priority
      />
    </a>
  );
}

function TestFlightBadge() {
  return (
    <a
      href={TESTFLIGHT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download for iOS on TestFlight"
      className="group inline-flex h-[52px] min-w-[168px] items-center gap-3 rounded-xl bg-[#0B0B0B] px-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#171717] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-7 w-7 shrink-0 fill-white"
      >
        <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.2-3.5zM14.3 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-medium tracking-[0.08em] text-white/75 uppercase">
          Download for iOS
        </span>
        <span className="mt-1 text-[15px] font-semibold tracking-tight">
          TestFlight
        </span>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <div
      className={cn(
        inconsolata.variable,
        "font-[family-name:var(--font-landing)] w-full flex flex-col min-h-screen overflow-x-hidden antialiased"
      )}
    >
      <nav className="sticky top-0 z-50 w-full bg-custom-background/90 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4 md:px-10 lg:px-20 xl:px-32 2xl:px-44">
        <div className="mx-auto flex w-full max-w-screen flex-wrap items-center justify-between gap-3">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={88}
              height={88}
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          <MobileNavMenu />

          <div className="hidden flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex">
            <Link
              href="/support"
              className="cursor-pointer text-xs tracking-wide text-custom-gray2 transition hover:text-custom-gray1 hover:underline sm:text-sm md:text-base"
            >
              Support
            </Link>
            <Link
              href="/privacy-policy"
              className="cursor-pointer text-xs tracking-wide text-custom-gray2 transition hover:text-custom-gray1 hover:underline sm:text-sm md:text-base"
            >
              Privacy Policy
            </Link>
            <LoginButton />
          </div>
        </div>
      </nav>

      <div className="flex-1 min-h-[90vh] px-4 pb-10 sm:px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-44">
        <div className="mt-8 flex w-full min-h-[60vh] flex-col-reverse items-center gap-10 md:mt-12 md:flex-row md:items-stretch md:gap-8 lg:gap-16">
          <div className="flex min-h-full flex-1 flex-col justify-center text-center md:text-left">
            <h1 className="mb-4 text-3xl leading-[1.1] font-bold tracking-tight text-custom-primary sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              <span>MESS SERVICES PANEL</span>
              <br />
              <span>FOR BSBH</span>
            </h1>
            <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed tracking-wide text-custom-gray2 sm:text-base md:mx-0">
              A smart digital platform to manage hostel mess operations with
              ease. From real-time meal tracking to student management and admin
              controls, streamline everything in one place.
            </p>
            <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4 md:justify-start">
              <GooglePlayBadge />
              <TestFlightBadge />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center md:justify-end">
            <Image
              src="/placeholder-image.png"
              alt="Placeholder"
              width={500}
              height={500}
              className="h-auto w-full max-w-[300px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[540px]"
              priority
            />
          </div>
        </div>
      </div>
      <footer className="left-0 right-0 w-full bg-custom-primary px-4 py-6 sm:px-6 md:px-10 md:py-8 lg:px-20 xl:px-32 2xl:px-44">
        <div></div>
      </footer>
    </div>
  );
}
