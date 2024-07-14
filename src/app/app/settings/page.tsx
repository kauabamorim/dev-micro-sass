import { auth } from "@/services/auth";
import { Settings } from "./_components/settings";
// import { HomeForm } from "./_components/home";

export default async function Page() {
  const session = await auth();
  return <Settings user={session?.user} />;
}
