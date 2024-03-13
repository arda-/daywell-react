import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Nav() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="flex justify-between items-center bg-amber-600 p-2 sticky top-0 z-50">
      <div>nav bar content</div>
      {!isLoaded && <div>loading...</div>}
      {isSignedIn && <UserButton />}
      {!isSignedIn && <SignInButton />}
    </div>
  );
}

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Tags", href: "tags", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
