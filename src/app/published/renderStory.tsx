import { Story } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import ClapComponent from "./clapComponent";
import CommentComponent from "./commentComponent";
import SaveComponent from "./saveComponent";
import ShareComponent from "./shareComponent";
import { ClapCount, ClapCountByUser } from "@/actions/clap";
import { getCurrentUser } from "@/actions/user";
import { NumberOfComments } from "@/actions/comments";

type Props = {
  AuthorFirstName: string | null;
  AuthorLastName: string | null;
  AutherImage: string;
  PublishedStory: Story;
};

const RenderStory = async ({
  AutherImage,
  AuthorFirstName,
  AuthorLastName,
  PublishedStory,
}: Props) => {
  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };
  const h1Match = PublishedStory?.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1Element = h1Match ? h1Match[1] : "";
  const h1elementwithouttag = stripHtmlTags(h1Element);
  const clapCount = await ClapCount(PublishedStory.id);
  const userClaps = await ClapCountByUser(PublishedStory.id);
  const currentUser = await getCurrentUser();
  const NumberOfComment  = await NumberOfComments(PublishedStory.id);
  return (
    <div className="flex items-center justify-center mt-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold my-8 ">{h1elementwithouttag}</h1>
        <div className="flex items-center space-x-5">
          <Image
            src={AutherImage}
            width={44}
            height={44}
            className="rounded-full"
            alt="User"
          />
          <div className="text-sm">
            <p>
              {AuthorFirstName}{" "}
              <span className="font-medium text-red-400 cursor-pointer">
                . Follow
              </span>{" "}
            </p>
            {/* <p>{AuthorFirstName} {AuthorLastName} <FollowComponent AuthorId={PublishedStory.authorId}/></p> */}
            <p className="opacity-60">
              Published on{" "}
              {new Date(PublishedStory.updatedAt)
                .toDateString()
                .split(" ")
                .slice(1, 4)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="border-y-[1px] border-neutral-200 w-full py-3 mt-6 flex items-center justify-between px-3">
          <div className="flex items-center space-x-4">
            <ClapComponent
              storyId={PublishedStory.id}
              clapCount={clapCount}
              userClaps={userClaps}
            />
            <CommentComponent
              authorFirstName={currentUser.name ?? ""}
              authorLastName={currentUser.name ?? ""}
              authorImage={currentUser.image ?? ""}
              numberOfComments={NumberOfComment.response??0}
            />
          </div>
          <div className="flex items-center space-x-4">
            <SaveComponent />
            <ShareComponent />
            <button>
              <MoreHorizontal size={24} className="opacity-80 text-green-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderStory;
