import Image from "next/image";
import Link from "next/link";
import { MobileNavMenu } from "@/components/shared/MobileNavMenu";
import LoginButton from "@/components/landing/LoginButton";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    body: (
      <>
        <p>The application may collect and store the following information:</p>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Student Information
        </h3>
        <ul>
          <li>Student name</li>
          <li>Roll number</li>
          <li>Mobile phone number</li>
          <li>Email address</li>
          <li>Hostel room number</li>
          <li>Floor information</li>
        </ul>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Mess Information
        </h3>
        <ul>
          <li>Mess diet selections and records</li>
          <li>Food and mess order information</li>
          <li>Other records related to the student&apos;s use of hostel mess services</li>
        </ul>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Billing Information
        </h3>
        <ul>
          <li>Mess bill information</li>
          <li>Bill history</li>
          <li>Records related to hostel mess charges and payments</li>
        </ul>

        <h3 className="mt-5 mb-2 text-sm font-semibold text-custom-gray3 sm:text-base">
          Administrator and Clerk Information
        </h3>
        <ul>
          <li>Administrator name</li>
          <li>Administrator mobile number</li>
          <li>Administrator email address</li>
          <li>Information necessary to manage authorized access to the application</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-your-information",
    title: "2. How We Use Your Information",
    body: (
      <>
        <p>The information collected through BSBH Mess Records is used to:</p>
        <ul>
          <li>Identify authorized students, administrators, and clerks</li>
          <li>Provide access to the application</li>
          <li>Manage hostel mess diet records</li>
          <li>Manage food and mess orders</li>
          <li>Maintain student mess records</li>
          <li>Generate and manage bills</li>
          <li>Maintain bill history</li>
          <li>Associate students with their assigned rooms and floors</li>
          <li>Allow authorized hostel administrators and clerks to manage hostel mess operations</li>
          <li>Maintain the security and proper functioning of the application</li>
        </ul>
        <p>
          We do not use student information for advertising or unrelated marketing
          purposes.
        </p>
      </>
    ),
  },
  {
    id: "hostel-provided-accounts",
    title: "3. Hostel-Provided Accounts",
    body: (
      <>
        <p>
          Students cannot independently create an account through the BSBH Mess
          Records application.
        </p>
        <p>
          Accounts and login credentials are created, provided, and managed by the
          Baba Banda Singh Bahadhur Hostel administration for students who are
          already registered as hostel residents.
        </p>
        <p>Users access the application using their registered mobile number and password.</p>
        <p>
          If a student is unable to access their account or requires changes to
          their account information, they should contact the hostel
          administration.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-personal-information",
    title: "4. Changes to Personal Information",
    body: (
      <>
        <p>
          Students cannot directly edit their personal information through the
          application.
        </p>
        <p>
          If any personal information is incorrect or needs to be updated, the
          student must contact the Baba Banda Singh Bahadhur Hostel administration.
          Authorized hostel personnel may update the relevant information according
          to hostel procedures.
        </p>
      </>
    ),
  },
  {
    id: "account-and-data-deletion",
    title: "5. Account and Data Deletion Requests",
    body: (
      <>
        <p>
          Student accounts and records are associated with official hostel and
          mess administration.
        </p>
        <p>
          Students who wish to request account deletion or the deletion of
          applicable personal information must contact the Baba Banda Singh
          Bahadhur Hostel administration.
        </p>
        <p>
          The hostel administration will review such requests in accordance with
          applicable hostel policies, administrative requirements,
          record-retention obligations, and applicable law.
        </p>
      </>
    ),
  },
  {
    id: "who-can-access-your-information",
    title: "6. Who Can Access Your Information",
    body: (
      <>
        <p>
          Access to student and administrative information is restricted to
          authorized personnel involved in managing the hostel mess system.
        </p>
        <p>This may include:</p>
        <ul>
          <li>Authorized hostel administrators</li>
          <li>Authorized hostel clerks</li>
        </ul>
        <p>We do not sell or rent personal information to third parties.</p>
      </>
    ),
  },
  {
    id: "data-storage-and-security",
    title: "7. Data Storage and Security",
    body: (
      <>
        <p>
          Information used by the application is stored using our backend
          infrastructure and database services, including MongoDB Atlas.
        </p>
        <p>
          We take reasonable measures to protect information from unauthorized
          access, alteration, disclosure, or destruction. Access to administrative
          and student information is intended to be limited to authorized users.
        </p>
        <p>
          However, no method of electronic storage or transmission over the
          internet can be guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "8. Third-Party Services",
    body: (
      <>
        <p>
          The application uses services and technologies that support its
          operation, including:
        </p>
        <ul>
          <li>MongoDB Atlas for database infrastructure</li>
          <li>Expo and related technologies used in the development and operation of the mobile application</li>
        </ul>
        <p>
          These services may process information as necessary to provide their
          respective technical services.
        </p>
      </>
    ),
  },
  {
    id: "advertising",
    title: "9. Advertising",
    body: (
      <>
        <p>BSBH Mess Records does not display third-party advertisements.</p>
        <p>We do not use student information for advertising purposes.</p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "10. Children's Privacy",
    body: (
      <>
        <p>
          The application is intended only for authorized users of Baba Banda
          Singh Bahadhur Hostel and is not intended for public use.
        </p>
        <p>
          We do not knowingly collect personal information for unrelated purposes
          from individuals who are not authorized users of the hostel mess system.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "11. Data Retention",
    body: (
      <>
        <p>
          We retain student, mess, billing, and administrative information for as
          long as reasonably necessary to operate the hostel mess system,
          maintain relevant administrative records, comply with applicable
          obligations, resolve disputes, and enforce hostel policies.
        </p>
        <p>
          The retention period may depend on the type of information and
          applicable administrative or legal requirements.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "12. Changes to This Privacy Policy",
    body: (
      <>
        <p>We may update this Privacy Policy from time to time.</p>
        <p>
          When changes are made, the updated Privacy Policy will be made
          available through our website or another appropriate method. The
          &ldquo;Effective Date&rdquo; at the top of this policy may also be
          updated.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "13. Contact Us",
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy, your information,
          account access, or data-related requests, please contact Baba Banda
          Singh Bahadhur Hostel at:
        </p>
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
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
            href="/privacy-policy"
            className="text-xs font-medium text-custom-primary"
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
              Privacy Policy
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-bold text-custom-primary sm:text-4xl md:text-5xl">
              BSBH Mess Records
            </h1>
            <p className="mt-3 text-sm font-medium text-custom-gray1 sm:text-base">
              Effective Date: August 21, 2026
            </p>
            <p className="mt-5 text-sm text-custom-gray2 sm:text-base">
              Baba Banda Singh Bahadhur Hostel (&ldquo;BSBH Hostel&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              operates the BSBH Mess Records mobile application. This policy
              explains how we collect, use, store, and protect information
              when students, hostel administrators, and authorized clerks use
              the application.
            </p>
            <p className="mt-3 text-sm text-custom-gray2 sm:text-base">
              BSBH Mess Records is intended for authorized residents,
              administrators, and clerks of Baba Banda Singh Bahadhur Hostel.
              Access to the application is provided and managed by the hostel
              administration.
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
                By using the BSBH Mess Records application, you acknowledge
                that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <footer className="w-full bg-custom-primary px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12 xl:px-16">
          <div className="flex w-full flex-col items-center justify-between gap-2 text-center text-xs text-custom-background/90 sm:flex-row sm:text-left sm:text-sm">
            <span>&copy; {new Date().getFullYear()} Baba Banda Singh Bahadhur Hostel</span>
            <a href="mailto:bsbhmess@gmail.com" className="hover:underline">
              bsbhmess@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
