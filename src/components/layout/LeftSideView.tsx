import { useQuery } from "@tanstack/react-query";
import { getAllNotebooksById } from "@/api/query";
import LogoutButton from "../forms/LogoutButton";
import UploadForm from "../forms/UploadForm";

const LeftSideView = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: () => getAllNotebooksById("bf906298-12b3-4c67-ae95-f4fc4be1a953"),
  });

  console.log(data);

  return (
    <div className="w-64 border-r">
      <p>LeftSideView</p>

      {isLoading && <p>Loading...</p>}

      <UploadForm />

      <hr />

      <LogoutButton />
    </div>
  );
};

export default LeftSideView;
