


const page = async ({ params }: { params: { storyId: string } }) => {
    return (
        <div>
            {params.storyId}
        </div>
    )
}

export default page;