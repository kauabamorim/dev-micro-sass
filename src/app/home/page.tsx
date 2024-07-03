import { auth } from "@/services/auth";
import { HomeForm } from "./_components/home";

export default async function Page() {
  const session = await auth();
  // return <h1>{session?.user?.email}</h1>;
  return <HomeForm />;
}
