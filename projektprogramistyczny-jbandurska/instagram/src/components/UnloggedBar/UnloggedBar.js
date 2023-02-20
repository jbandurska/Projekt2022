import "./UnloggedBar.css";
import instagramLogo from "../../img/instagram-text.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SuggestedPerson from "../SuggestedPerson/SuggestedPerson";

export default function UnloggedBar() {
  const [suggested, setSuggested] = useState([]);

  const handleSearchInput = async (e) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/key/${e.target.value}`
    );
    setSuggested(data.data.users);
  };

  useEffect(() => {
    window.addEventListener("click", function (e) {
      if (!document.querySelector(".unlogged-bar-inner").contains(e.target)) {
        setSuggested([]);
      }
    });
  }, []);

  return (
    <div className="unlogged-bar">
      <div className="unlogged-bar-inner">
        <Link to="/">
          <img src={instagramLogo} alt="Instagram" />
        </Link>
        <label className="relative-label">
          <input
            id="search-input"
            placeholder="Search"
            onChange={handleSearchInput}
            onBlur={handleSearchInput}
          />
          <div className="relative-button-div">
            <button
              type="button"
              className="relative-button"
              onClick={() => {
                document.getElementById("search-input").value = "";
                setSuggested([]);
              }}
            >
              X
            </button>
          </div>
        </label>
        <div className="search-bar-drop">
          <ul>
            {suggested.map((person, i) => (
              <SuggestedPerson person={person} key={i} />
            ))}
          </ul>
        </div>
        <div className="buttons-div">
          <Link to={"/"} className="button log-in-button">
            Log In
          </Link>
          <Link to={"/accounts/emailsignup/"} className="button">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
