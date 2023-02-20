import axios from "axios";
import { useEffect, useState } from "react";
import "./FollowersList.css";
import SuggestedPerson from "../SuggestedPerson/SuggestedPerson";

export default function FollowersList({ followers, toggleModal, showModal }) {
  const [followersAccounts, setFollowersAccounts] = useState([]);

  useEffect(() => {
    const handleModalClick = (e) => {
      if (e.target.id === "modal") {
        toggleModal();
      }
    };

    const modalRoot = document.getElementById("modal");
    modalRoot.addEventListener("click", handleModalClick);

    return () => {
      modalRoot.removeEventListener("click", handleModalClick);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  useEffect(() => {
    const getFollowersAccounts = async () => {
      const data = await axios.get(`${process.env.REACT_APP_API_URL}/follow`, {
        params: { ids: followers },
      });
      setFollowersAccounts(data.data.users);
    };
    getFollowersAccounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="followers-list">
      {followersAccounts.map((follower, i) => (
        <SuggestedPerson person={follower} key={i} />
      ))}
    </ul>
  );
}
