import NewStory from "../new-story";
import NavbarStory from "../navbar-story";
import { getStoryById } from "@/actions/get-Stories";

type Props = {};

const page = async ({ params }: { params: { storyId: string } }) => {
  const Story = await getStoryById(params.storyId);
  return (
    <div className="max-w-[1000px] mx-auto">
      <NavbarStory />
      <NewStory storyId={params.storyId} storyContent={Story?.response?.content} />
      {/* <NewStory storyId={params.storyId} /> */}
    </div>
  );
};

export default page;
