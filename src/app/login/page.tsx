import { signIn } from "@/auth";
import { getSession } from "@/lib/get-session";
import Link from "next/link";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getSession();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="grid place-content-center h-screen bg-slate-100">
      <div className="flex flex-col justify-center gap-5 items-center h-[50vh] w-[400px] bg-white shadow-md">
        <img src="/medium-icon.svg" alt="" className="h-10 w-auto" />
        <p className="tet-md font-bold">Login into continue</p>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="py-1 px-26 rounded cursor-pointer flex flex-row justify-center items-center gap-2 bg-white border-[1px] border-gray-200 font-medium ">
            <img
              src="https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo.png"
              className="h-10"
              alt=""
            />
            <span className="text-nowrap">Sign in with Google</span>
          </button>
        </form>

        <Link
          href="/"
          className="text-center text-xs text-blue-800 cursor-pointer underline"
        >
          Go to Home page
        </Link>
      </div>
    </div>
  );
};

export default Login;
