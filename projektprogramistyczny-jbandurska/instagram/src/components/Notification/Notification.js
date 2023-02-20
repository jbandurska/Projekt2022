import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Notification({ payload }) {
  const notification =
    typeof payload === "string" ? JSON.parse(payload) : payload;
  const [user, setUser] = useState({});
  const [post, setPost] = useState({});

  const getUserInfo = useMemo(() => {
    return async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/id/${notification.user}`
      );
      setUser(response.data.user);
    };
  }, [notification]);

  const getPost = useMemo(() => {
    return async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/${notification.picture}`
      );
      setPost(response.data);
    };
  }, [notification]);

  useEffect(() => {
    getUserInfo();
    if (notification.picture) getPost();
  }, [getUserInfo, getPost, notification]);

  return (
    <>
      {user ? (
        <>
          <Link to={`/${user.username}`}>
            <img alt={user.username} src={user.profilePicture} />
          </Link>
          <span>
            {user.username} {notification.message}
          </span>
          {notification.link ? (
            <Link to={notification.link} className="button">
              requests
            </Link>
          ) : null}
        </>
      ) : null}
      {post && post.picture ? <img alt={post.id} src={post.picture} /> : null}
    </>
  );
}
