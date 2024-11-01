"use client";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ProfileModal from "@/components/profile-model";
import { useRouter } from "next/navigation";

type Props = {};

const NavbarStory = (props: Props) => {
  const { data: session } = useSession();
  // console.log(session?.user)
  const router = useRouter();
  const MakeNewStory = async () => {
    try {
      const response = await fetch("/api/new-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      router.push(`/story/${data.id}`);
    } catch (error) {
      console.log("error creating new Story");
    }
  };
  return (
    <div className="px-8 py-2 border-b-[1px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={"/"}>
            <Image
              src={"/medium-icon.svg"}
              height={40}
              width={40}
              alt="Medium Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-7">
          <button className="flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 rounded-full  px-3 py-1 text-[13px] text-white">Publish</button>
          {session?.user && (
            <Popover>
              <PopoverTrigger>
                <Image
                  src={session?.user?.image || "/default-avatar.png"}
                  height={40}
                  width={40}
                  alt="User Avatar"
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <ProfileModal user={session?.user} />
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarStory;
