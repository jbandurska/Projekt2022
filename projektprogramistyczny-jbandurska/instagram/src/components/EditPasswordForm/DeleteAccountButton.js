import axios from "axios";
import { useCookies } from "react-cookie";

export default function DeleteAccountButton({ setMsg, pswd }) {
  const [, setCookie] = useCookies(["currentUser", "currentUserId"]);

  const deleteAccount = async () => {
    if (pswd === "")
      setMsg(
        "In order to delete your account you have to type in your password."
      );
    else {
      const data = await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/${localStorage.getItem(
          "currentUser"
        )}`,
        {
          data: {
            password: pswd,
          },
        }
      );

      if (data.data.message === "User deleted") {
        setCookie("currentUser", "", { path: "/" });
        setCookie("currentUserId", "", { path: "/" });
        localStorage.setItem("currentUser", "");
        localStorage.setItem("currentUserId", "");
        window.location.reload(false);
      } else setMsg(data.data.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="button delete-button"
        onClick={deleteAccount}
      >
        Delete account
      </button>
      <p className="small-p">
        Remember that once you delete your account this action cannot be undone!
      </p>
    </>
  );
}
