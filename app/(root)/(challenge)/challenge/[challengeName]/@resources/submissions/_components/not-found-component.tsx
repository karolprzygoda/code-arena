import { Icons } from "@/components/icons";

const NotFoundComponent = () => {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center gap-5 p-4 text-center text-2xl font-bold"
      }
    >
      <Icons.taken className={"h-60 w-60"} />
      <h2>No data.</h2>
    </div>
  );
};

export default NotFoundComponent;
