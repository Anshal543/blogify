import { getPublishedStoryById } from "@/actions/get-Stories";
import { getUser } from "@/actions/user";
import Navbar from "@/components/navbar";
import RenderStory from "../renderStory";

const page = async ({ params }: { params: { storyId: string } }) => {
  const publishedStory = await getPublishedStoryById(params.storyId);
  if (!publishedStory.response) {
    return <div>No story found</div>;
  }
  const Author = await getUser(publishedStory?.response?.authorId);
  return (
    <div>
      <Navbar />
      <RenderStory
        AuthorFirstName={Author.name ?? ""}
        AutherImage={Author.image ?? ""}
        AuthorLastName={Author.name ?? ""}
        PublishedStory={publishedStory.response}
      />
    </div>
  );
};

export default page;
