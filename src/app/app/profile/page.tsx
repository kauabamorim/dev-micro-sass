import { auth } from "@/services/auth";
import { Profile } from "./_components/profile";
// import { HomeForm } from "./_components/home";

export default async function Page() {
  const session = await auth();
  return <Profile user={session?.user} />;
}
