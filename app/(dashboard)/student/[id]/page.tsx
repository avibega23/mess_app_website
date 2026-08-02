import StudentDetail from "@/components/students/StudentDetail";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <StudentDetail id={id} />;
}

export default Page;
