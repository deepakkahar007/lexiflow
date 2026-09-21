import { useQuery } from "@tanstack/react-query";
import { getAllNotebooksById } from "@/api/query";
import LogoutButton from "../forms/LogoutButton";
import UploadForm from "../forms/UploadForm";

const LeftSideView = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: () => getAllNotebooksById("54c16a38-5309-4ee4-8747-4a2beb125660"),
  });

  return (
    <div className="w-64 border-r">
      <p>LeftSideView</p>

      {isLoading && <p>Loading...</p>}

      {data && (
        <div>
          {data.map((notebook) => (
            <div key={notebook.id}>
              <h2>{notebook.name}</h2>
            </div>
          ))}
        </div>
      )}

      <UploadForm />

      <hr />

      <LogoutButton />
    </div>
  );
};

export default LeftSideView;
