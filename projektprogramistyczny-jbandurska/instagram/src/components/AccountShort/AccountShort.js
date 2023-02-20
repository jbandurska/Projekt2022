import "./AccountShort.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountShort() {
  const state = useSelector((state) => state.account);

  return (
    <Link to={`/${state.username}/`} className="account-short">
      <img src={state.profilePicture} alt={state.username} />
      <div>
        <span className="nick">{state.username}</span>
        <span className="name">{state.fullname}</span>
      </div>
    </Link>
  );
}
