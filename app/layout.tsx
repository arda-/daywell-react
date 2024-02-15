import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Nav from "../components/Nav";
import BottomMenu from "../components/BottomMenu";
import Button from "../components/Button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        {children}
        <BottomMenu>
          <Button onClick={() => {}} className="mr-1">
            Group by Tag
          </Button>
          <Button
            onClick={() => {}}
            className="mx-1"
            // style={"soft"}
          >
            Prioritize
          </Button>
          <Button className="ml-1" onClick={() => {}} style={"primary"}>
            Add Task
          </Button>
        </BottomMenu>
      </body>
    </html>
  );
}
