import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PictureProfileHeader({ userId }) {
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
    <div className="picture-header">
      <Link to={`/${userInfo.username}`}>
        <img
          src={userInfo.profilePicture}
          className="account-picture"
          alt={userInfo.username}
        />
        <span>{userInfo.username}</span>
      </Link>
    </div>
  ) : null;
}
