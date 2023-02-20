import { Link } from "react-router-dom";
import "./SuggestedPerson.css";

export default function SuggestedPerson({ person }) {
  return (
    <li>
      <Link to={`/${person.username}`} className="suggested-person">
        <img src={person.profilePicture} alt={person.username} />
        <div>
          <div className="suggested-person-username">{person.username}</div>
          <div>{person.fullname}</div>
        </div>
      </Link>
    </li>
  );
}
