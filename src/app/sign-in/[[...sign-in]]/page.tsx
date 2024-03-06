import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center bg-red-100 h-full">
      <SignIn />
    </div>
  );
}
