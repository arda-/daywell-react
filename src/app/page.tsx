"use client";

import { UserProvider } from "@/lib/context/user";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <UserProvider>
          appwrite user-provided client side data goes here
        </UserProvider>
      </div>
    </main>
  );
}
