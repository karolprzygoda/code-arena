import EditorPageComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/editor-page-component";

type EditorPageParams = {
  params: Promise<{ challengeName: string }>;
};

const EditorPage = async ({ params }: EditorPageParams) => {
  return <EditorPageComponent challengeName={(await params).challengeName} />;
};

export default EditorPage;
