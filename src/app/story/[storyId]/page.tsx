import NewStory from "../new-story";
import NavbarStory from "../navbar-story";
import { getStoryById } from "@/actions/get-Stories";
import { getCurrentUser, getCurrentUserId } from "@/actions/user";

type Props = {};

const page = async ({ params }: { params: { storyId: string } }) => {
  const Story = await getStoryById(params.storyId);
  const user = await getCurrentUser()
  const getCurrUserId = await getCurrentUserId()
  return (
    <div className="max-w-[1000px] mx-auto">
      <NavbarStory storyId={params.storyId} currentUserId={getCurrUserId} currentUserFirstName={user.name ?? ''} currentUserLastName={user.name ?? ''} />
      <NewStory storyId={params.storyId} storyContent={Story?.response?.content} />
      {/* <NewStory storyId={params.storyId} /> */}
    </div>
  );
};

export default page;
