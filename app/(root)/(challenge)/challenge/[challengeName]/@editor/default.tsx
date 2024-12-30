import EditorPageComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/editor-page-component";

type EditorDefaultParams = {
  params: Promise<{ challengeName: string }>;
};

const EditorPage = async ({ params }: EditorDefaultParams) => {
  return <EditorPageComponent challengeName={(await params).challengeName} />;
};

export default EditorPage;
