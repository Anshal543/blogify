"use client";
import React, { useEffect, useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { getSession } from "@/lib/get-session";
// import { getSession } from "next-auth/react"; // Use the NextAuth getSession function

import { Popover, PopoverTrigger } from "@/components/ui/popover";

interface UserProps {
  user: {
    name?: string | undefined | null;
    email?: string | undefined | null;
    image?: string | undefined | null;
  };
}

const ProfileModal = ({ user }: UserProps) => {
  return (
    <PopoverContent>
      <div className="p-4">
        <Image
          src={user.image || "/default-avatar.png"}
          height={80}
          width={80}
          alt="User Avatar"
          className="rounded-full mx-auto"
        />
        <p className="text-center mt-2 font-bold">{user.name}</p>
        <p className="text-center text-sm text-gray-600">{user.email}</p>

        <button
          onClick={() => signOut()}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
      </div>
    </PopoverContent>
  );
};

export default ProfileModal;
