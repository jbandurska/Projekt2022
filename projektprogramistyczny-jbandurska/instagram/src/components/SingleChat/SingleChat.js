import axios from "axios";
import { useState, useEffect } from "react";

export default function SingleChat({ userId }) {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/id/${userId}`
      );
      setUserInfo(response.data.user);
    };
    getUserInfo();
  }, [userId]);

  return userInfo.username ? (
    <div className="picture-header single-chat">
      <img
        src={userInfo.profilePicture}
        className="account-picture"
        alt={userInfo.username}
      />
      <span>{userInfo.username}</span>
    </div>
  ) : null;
}
