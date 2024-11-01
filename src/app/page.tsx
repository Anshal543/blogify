import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const cookees = cookies().get("authjs.session-token");
  // console.log(
  //   await decode({
  //     token: cookees?.value!,
  //     salt: "authjs.session-token",
  //     secret: process.env.AUTH_SECRET!,
  //   })
  // );
  return (
    <main>
      <Navbar />
    </main>
  );
}
