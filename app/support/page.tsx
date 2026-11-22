import Image from "next/image";
import Link from "next/link";
import { MobileNavMenu } from "@/components/shared/MobileNavMenu";
import LoginButton from "@/components/landing/LoginButton";

const sections = [
  {
    id: "how-to-get-help",
    title: "1. How to Get Help",
    body: (
      <>
        <p>
          If you need help with the BSBH Mess Records application, contact Baba
          Banda Singh Bahadhur Hostel administration using the details below.
        </p>
        <p>
          Please include your full name, registered mobile number, and a short
          description of the issue so we can assist you more quickly.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "2. Contact",
    body: (
      <>
        <p>
          Email:{" "}
          <a
            href="mailto:bsbhmess@gmail.com"
            className="font-medium text-custom-primary hover:underline"
          >
            bsbhmess@gmail.com
          </a>
        </p>
        <p>
          Website:{" "}
          <span className="font-medium text-custom-gray3">bsbhmess.com</span>
        </p>
        <p>
          Support is available for authorized students, administrators, and
          clerks of Baba Banda Singh Bahadhur Hostel.
        </p>
      </>
    ),
  },
  {
    id: "common-issues",
    title: "3. Common Issues",
    body: (
      <>
        <h3 className="mt-1 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Cannot log in
        </h3>
        <ul>
          <li>Confirm you are using your registered mobile number</li>
          <li>Check that your password was entered correctly</li>
          <li>
            If you still cannot access your account, contact hostel
            administration for credential reset or account verification
          </li>
        </ul>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Incorrect personal information
        </h3>
        <ul>
          <li>
            Students cannot directly edit personal details in the application
          </li>
          <li>
            Request updates through hostel administration with your correct
            details
          </li>
        </ul>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Mess records or billing questions
        </h3>
        <ul>
          <li>
            Review the relevant bill or mess record in the app when available
          </li>
          <li>
            Contact hostel administration with your roll number and the date or
            bill period in question
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "account-access",
    title: "4. Account Access",
    body: (
      <>
        <p>
          Students cannot independently create an account through BSBH Mess
          Records.
        </p>
        <p>
          Accounts and login credentials are created, provided, and managed by
          Baba Banda Singh Bahadhur Hostel administration for registered hostel
          residents.
        </p>
        <p>
          If you are a resident and do not yet have access, contact the hostel
          administration to request an account.
        </p>
      </>
    ),
  },
  {
    id: "data-deletion",
    title: "5. Account and Data Deletion",
    body: (
      <>
        <p>
          Student accounts and records are associated with official hostel and
          mess administration.
        </p>
        <p>
          To request account deletion or deletion of applicable personal
          information, email{" "}
          <a
            href="mailto:bsbhmess@gmail.com?subject=Account%20or%20Data%20Deletion%20Request"
            className="font-medium text-custom-primary hover:underline"
          >
            bsbhmess@gmail.com
          </a>{" "}
          with the subject line &ldquo;Account or Data Deletion Request&rdquo;
          and include your full name and registered mobile number.
        </p>
        <p>
          The hostel administration will review such requests in accordance with
          hostel policies, administrative requirements, record-retention
          obligations, and applicable law.
        </p>
        <p>
          For more detail, see our{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-custom-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "response-time",
    title: "6. Response Time",
    body: (
      <>
        <p>
          We aim to respond to support requests as soon as reasonably possible
          during hostel administrative hours.
        </p>
        <p>
          Response times may vary depending on the nature of the request and
          hostel operating schedules.
        </p>
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-custom-background">
      {/* Fixed left sidebar (desktop) */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col md:border-r md:border-custom-gray0 md:bg-white lg:w-72">
        <div className="flex items-center px-6 pt-8 pb-6">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={88}
              height={88}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-custom-gray1 uppercase">
            On this page
          </p>
          <div className="flex flex-col gap-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg px-2.5 py-1.5 text-xs leading-snug text-custom-gray2 transition hover:bg-custom-primary/10 hover:text-custom-primary"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-3 border-t border-custom-gray0 px-6 py-5">
          <Link
            href="/support"
            className="text-xs font-medium text-custom-primary"
          >
            Support
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs font-medium text-custom-gray2 transition hover:text-custom-primary"
          >
            Privacy Policy
          </Link>
          <LoginButton />
        </div>
      </aside>

      {/* Mobile top nav */}
      <nav className="sticky top-0 z-50 w-full bg-custom-background/95 px-4 py-3 backdrop-blur sm:px-6 md:hidden">
        <div className="flex w-full items-center justify-between gap-3">
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
        </div>
      </nav>

      {/* Main content */}
      <div className="flex min-h-screen flex-col md:pl-64 lg:pl-72">
        <div className="flex-1 px-4 pb-16 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mt-8 mb-10 md:mt-12 md:mb-14">
            <span className="inline-flex items-center rounded-full bg-custom-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-custom-primary uppercase">
              Support
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-bold text-custom-primary sm:text-4xl md:text-5xl">
              BSBH Mess Records Support
            </h1>
            <p className="mt-5 text-sm text-custom-gray2 sm:text-base">
              Get help with account access, mess records, billing questions, and
              data requests for the BSBH Mess Records application.
            </p>
            <p className="mt-3 text-sm text-custom-gray2 sm:text-base">
              For the fastest response, email{" "}
              <a
                href="mailto:bsbhmess@gmail.com"
                className="font-medium text-custom-primary hover:underline"
              >
                bsbhmess@gmail.com
              </a>{" "}
              with your name, registered mobile number, and a short description
              of your issue.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-xl border border-custom-gray0 bg-white p-5 shadow-xs sm:p-7 lg:p-8"
              >
                <h2 className="mb-3 text-lg font-semibold text-custom-gray3 sm:text-xl">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-custom-gray2 sm:text-base [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}

            <div className="mt-2 rounded-xl bg-custom-primary/10 p-5 text-center sm:p-7">
              <p className="text-sm font-medium text-custom-gray3 sm:text-base">
                Still need help? Reach us at{" "}
                <a
                  href="mailto:bsbhmess@gmail.com"
                  className="text-custom-primary hover:underline"
                >
                  bsbhmess@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <footer className="w-full bg-custom-primary px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12 xl:px-16">
          <div className="flex w-full flex-col items-center justify-between gap-2 text-center text-xs text-custom-background/90 sm:flex-row sm:text-left sm:text-sm">
            <span>
              &copy; {new Date().getFullYear()} Baba Banda Singh Bahadhur Hostel
            </span>
            <a href="mailto:bsbhmess@gmail.com" className="hover:underline">
              bsbhmess@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
