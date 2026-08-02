import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="bg-custom-background">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
