import SideMenu from "../SideMenu/SideMenu";
import "./EditAccount.css";
import UnloggedBar from "../UnloggedBar/UnloggedBar";
import { Link } from "react-router-dom";
import EditAccountForm from "../EditAccountForm/EditAccountForm";

export default function EditAccount() {
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
              <Link to="/accounts/edit/" className="category active-category">
                Edit profile
              </Link>
              <Link to="/accounts/password/change/" className="category">
                Change password
              </Link>
            </div>
            <EditAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
