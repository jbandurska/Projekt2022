import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostInGrid from "../PostInGrid/PostInGrid";
import "./PostsGrid.css";

export default function PostsGrid({ isPrivate, userId }) {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(0);
  const { username } = useParams();
  const currentUser = localStorage.getItem("currentUser");
  const state = useSelector((state) => state.account);

  const shouldDisplayPosts = useMemo(() => {
    return () => {
      // Jeśli użytkownik nie jest zalogowany
      if (!localStorage.getItem("currentUser")) {
        setDisplayPosts(false);
        return;
      }

      // Jeśli konto nie jest prywatne
      if (!isPrivate) {
        setDisplayPosts(true);
        return;
      }

      // Jeśli konto jest twoje
      if (username === currentUser) {
        setDisplayPosts(true);
        return;
      }

      // Jeśli jest prywatne i obserwujesz użytkownika
      if (isPrivate && state.following && state.following.includes(userId)) {
        setDisplayPosts(true);
        return;
      }

      // Jeśli jest prywatne i nie obserwujesz użytkownika
      if (isPrivate && state.following && !state.following.includes(userId)) {
        setDisplayPosts(false);
        return;
      }
    };
  }, [isPrivate, userId, state, currentUser, username]);

  const changeCurrentPostId = useCallback(
    (id, type) => {
      const index = posts.findIndex((el) => el.id === id);
      let newIndex;
      if (type === "next") {
        if (index === posts.length - 1) newIndex = index;
        else newIndex = index + 1;

        setCurrentPostId(posts[newIndex].id);
        return;
      }

      if (index === 0) newIndex = 0;
      else newIndex = index - 1;

      setCurrentPostId(posts[newIndex].id);
    },
    [posts]
  );

  useEffect(shouldDisplayPosts, [isPrivate, userId, state, shouldDisplayPosts]);

  useEffect(() => {
    const getPosts = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/all/${username}`
      );
      setPosts(response.data.posts);
    };
    if (displayPosts) getPosts();
  }, [username, displayPosts]);

  if (!localStorage.getItem("currentUser"))
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        Log in to see {username}'s posts!
      </div>
    );

  if (!displayPosts)
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        <p>{username}'s account is private</p>
        <p>Follow the user to see their posts!</p>
      </div>
    );

  return posts ? (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostInGrid
          key={post.id}
          picture={post.picture}
          likes={post.likes}
          comments={post.comments}
          id={post.id}
          currentPostId={currentPostId}
          setCurrentPostId={setCurrentPostId}
          changeCurrentPostId={changeCurrentPostId}
        />
      ))}
    </div>
  ) : null;
}
