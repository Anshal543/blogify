"use client";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ProfileModal from "@/components/profile-model";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Story } from "@prisma/client";
import { getStoryById } from "@/actions/get-Stories";
import Select from "react-select";

type Props = {
  storyId: string;
  currentUserId: string;
  currentUserFirstName: string | null;
  currentUserLastName: string | null;
};

const NavbarStory = ({
  storyId,
  currentUserId,
  currentUserFirstName,
  currentUserLastName,
}: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const PublishStory = async (topics: string[]) => {
    try {
      const response = await fetch("/api/publish-new-story", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId: storyId,
          topics: topics,
        }),
      });
      const data = await response.json();
      router.push(`/published/${data.id}`);
    } catch (error) {
      console.error("Error publishing new Story", error);
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
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 rounded-full  px-3 py-1 text-[13px] text-white"
          >
            Publish
          </button>
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
      {showPopup && (
        <SaveStoryPopup
          storyId={storyId}
          PublishStory={PublishStory}
          setShowPopup={setShowPopup}
          currentUserFirstName={currentUserFirstName}
          currentUserLastName={currentUserLastName}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default NavbarStory;

type SaveStoryPopupTypes = {
  storyId: string;
  PublishStory: (topics: string[]) => void;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
  currentUserFirstName: string | null;
  currentUserLastName: string | null;
};

const SaveStoryPopup = ({
  storyId,
  PublishStory,
  setShowPopup,
  currentUserId,
  currentUserFirstName,
  currentUserLastName,
}: SaveStoryPopupTypes) => {
  const [story, setStory] = useState<Story>();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const result = await getStoryById(storyId);
        if (result.response) {
          setStory(result.response);
        }
      } catch (error) {
        console.error("Error fetching story", error);
      }
    };
    fetchStory();
  }, []);
  const topics = [
    { value: "Technology", label: "Technology" },
    { value: "Science", label: "Science" },
    { value: "Health", label: "Health" },
    { value: "Politics", label: "Politics" },
    { value: "Business", label: "Business" },
    { value: "Design", label: "Design" },
    { value: "Programming", label: "Programming" },
    { value: "Software Engineering", label: "Software Engineering" },
    { value: "Web Development", label: "Web Development" },
    { value: "Art", label: "Art" },
    { value: "Music", label: "Music" },
    { value: "Movies", label: "Movies" },
    { value: "Books", label: "Books" },
    { value: "Sports", label: "Sports" },
    { value: "Fashion", label: "Fashion" },
    { value: "Food", label: "Food" },
  ];

  if (!story) return null;
  // NOTE: this is done to remove the h1 tag from the content and get the first 10 words
  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  const contentWithoutH1 = story.content!.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>/g,
    ""
  );

  const textWithoutHtml = stripHtmlTags(contentWithoutH1);

  const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(" ");

  // NOTE: this is done to get the first image from the content

  const ImageMatch = story?.content!.match(
    /<img[^>]*src=["']([^"']*)["'][^>]*>/
  );
  const imgSrc = ImageMatch ? ImageMatch[1] : "";

  const h1Match = story?.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1Element = h1Match ? h1Match[1] : "";
  const h1elementwithouttag = stripHtmlTags(h1Element);

  return (
    <div className="fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0">
      <span
        className="absolute top-4  right-6 text-3xl cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setShowPopup(false);
        }}
      >
        &times;
      </span>
      <div className="max-w-[900px] mx-auto md:mt-28 mt-10 grid md:grid-cols-2 grid-cols-1 gap-14">
        <div className="max-md:hidden">
          <p className="font-semibold">Story Preview</p>
          <div className="w-full h-[250px] bg-gray-100 rounded my-3 border-b-[1px]">
            {imgSrc && (
              <Image
                className="w-full h-full object-cover"
                src={imgSrc}
                height={250}
                width={250}
                alt="Preview Image"
              />
            )}
          </div>
          <h1 className="border-b-[1px] text-[18px] font-semibold py-2">
            {h1elementwithouttag}
          </h1>
          <p className="border-b-[1px] py-2 text-sm text-neutral-500 pt-3">
            {first10Words}
          </p>
          <p className="font-medium text-sm pt-2">
            Note:{" "}
            <span className="font-normal text-neutral-500">
              Changes here will affect how your story appears in public places
              like Medium’s homepage and in subscribers’ inboxes — not the
              contents of the story itself.
            </span>
          </p>
        </div>
        <div>
          <p className="py-2">
            Publishing to: <span>{currentUserFirstName}</span>{" "}
          </p>
          <p className='text-sm pb-3 pt-1 '>Add or change topics (up to 5) so readers know what your story is about</p>
          <Select options={topics} isMulti onChange={(e) => {
            setSelectedTopics(e.map((topic) => topic.value));
          } } placeholder="tags" name="topics" className="basic-multi-select" classNamePrefix={"Add a topic..."} isDisabled={selectedTopics?.length>=5}/>
          <button onClick={()=>PublishStory(selectedTopics)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8 ">
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};
