import Image from "next/image";
import { MobileNavMenu } from "@/components/shared/MobileNavMenu";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden">
      <nav className="sticky top-0 z-50 w-full bg-custom-background px-4 py-3 sm:px-6 sm:py-4 md:px-10 lg:px-20 xl:px-32 2xl:px-44">
        <div className="mx-auto flex w-full max-w-screen flex-wrap items-center justify-between gap-3">
          <a href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={88}
              height={88}
              className="h-10 w-auto sm:h-11"
            />
          </a>

          <MobileNavMenu />

          <div className="hidden flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex">
            <div className="cursor-pointer text-xs text-custom-gray2 hover:text-custom-gray1 hover:underline sm:text-sm md:text-base">
              Privacy Policy
            </div>
            <div className="cursor-pointer rounded-xl bg-custom-primary px-3 py-2 text-xs text-custom-background sm:px-4 sm:text-sm md:text-base">
              Clerk Login
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 min-h-[90vh] px-4 pb-10 sm:px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-44">
        <div className="mt-8 flex w-full min-h-[60vh] flex-col-reverse items-center gap-10 md:mt-12 md:flex-row md:items-stretch md:gap-8 lg:gap-16">
          <div className="flex min-h-full flex-1 flex-col justify-center text-center md:text-left">
            <h1 className="mb-4 text-3xl leading-tight font-bold text-custom-primary sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              <span>MESS SERVICES PANEL</span>
              <br />
              <span>FOR BSBH</span>
            </h1>
            <p className="mx-auto max-w-xl text-sm font-medium text-custom-gray2 sm:text-base md:mx-0">
              A smart digital platform to manage hostel mess operations with ease. From real-time meal tracking to student management and admin controls, streamline everything in one place.
            </p>
            <a
              href="https://drive.google.com/uc?export=download&id=10NghL3GZNJn-wALCz6ZVXC7HpABCNBwB"
              className="mt-8 w-fit self-center rounded-xl bg-custom-primary px-6 py-3 text-sm font-semibold text-background shadow-[0_10px_25px_rgba(244,126,32,0.35)] ring-2 ring-orange-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(244,126,32,0.45)] sm:mt-10 sm:text-base md:self-start"
            >
              Download App Now
            </a>
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
