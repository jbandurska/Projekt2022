import SideMenu from "../SideMenu/SideMenu";
import UnloggedBar from "../UnloggedBar/UnloggedBar";
import { Link } from "react-router-dom";
import EditPasswordForm from "../EditPasswordForm/EditPasswordForm";

export default function EditPassword() {
  return (
    <div>
      {localStorage.getItem("currentUser") ? null : <UnloggedBar />}
      <div className="home">
        {localStorage.getItem("currentUser") ? (
          <SideMenu active="Profile" />
        ) : null}

        <div className="edit-wrapper">
          <div className="edit-account-main">
            <div className="edit-account-header">
              <Link to="/accounts/edit/" className="category">
                Edit profile
              </Link>
              <Link
                to="/accounts/password/change/"
                className="category active-category"
              >
                Change password
              </Link>
            </div>
            <EditPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
