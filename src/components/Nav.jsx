import {
  ClerkLoaded,
  ClerkLoading,
  UserButton,
  SignInButton,
  currentUser,
} from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Tags", href: "tags", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

async function AccountCorner() {
  const user = await currentUser();
  let userZone = null;

  if (!user) {
    userZone = (
      <div>
        <ClerkLoading>
          <div>Sign-in button loading...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <SignInButton />
        </ClerkLoaded>
      </div>
    );
  } else {
    userZone = (
      <div>
        <ClerkLoading>
          <div>UserButton loading...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      </div>
    );
  }

  return userZone;
}

export default function Nav() {
  return (
    <div className="flex justify-between items-center bg-amber-600 p-2 sticky top-0 z-50">
      <div>Nav bar will eventually go here.</div>

      <AccountCorner />
    </div>
  );
}
