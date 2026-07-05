import RoomDetail from "@/components/rooms/RoomDetail";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <RoomDetail id={id} />;
}

export default Page;
