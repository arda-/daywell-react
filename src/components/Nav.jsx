import { UserButton } from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Tags", href: "tags", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

export default function Example() {
  return (
    <div className="flex justify-between items-center bg-amber-600 p-2 sticky top-0 z-50">
      <div>Nav bar will eventually go here.</div>
      <UserButton />
    </div>
  );
}
