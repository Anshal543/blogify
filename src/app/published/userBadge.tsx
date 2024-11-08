import { getUser } from "@/actions/user";
import { User } from "next-auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";

type Props = {
  userId: string;
  createdAt: Date;
};

const UserBadge = ({ userId, createdAt }: Props) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(userId);
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.log("Error while fetching user", error);
      }
    };
    fetchUser();
  }, [userId]);
  // const calculateDaysAgo = (createdAt:Date) =>{
  //     const diff:number = new Date().getTime() - new Date(createdAt).getTime();
  //     return Math.floor(diff / (1000 * 60 * 60 * 24));
  // }
  return (
    <div className="px-4 text-sm">
      <div className="flex items-center space-x-3">
        <Image
          src={user?.image ? user.image : "/no-image.jpg"}
          width={32}
          height={32}
          alt="User"
          className="rounded-full object-cover"
          priority
        />
        <div>
          <p>{user?.name}</p>
          <p className="text-xs opacity-60">{format(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserBadge;
