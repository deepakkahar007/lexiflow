import LogoutButton from "../forms/LogoutButton";
import UploadForm from "../forms/UploadForm";

const LeftSideView = () => {
  return (
    <div className="w-64 border-r">
      <p>LeftSideView</p>

      <UploadForm />

      <hr />

      <LogoutButton />
    </div>
  );
};

export default LeftSideView;
