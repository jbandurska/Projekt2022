import axios from "axios";
import { useEffect, useState } from "react";
import SideMenu from "../SideMenu/SideMenu";
import Post from "../Post/Post";
import AccountShort from "../AccountShort/AccountShort";
import "./Home.css";
import NewPosts from "../NewPosts/NewPosts";
import { useMQTT } from "../MQTTProvider";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { isNewPost } = useMQTT();

  const getPosts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/posts/homepage/${localStorage.getItem(
        "currentUser"
      )}`
    );
    setPosts(response.data.posts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="home">
      <SideMenu active="Home" />
      <div className="home-main">
        <div className="middle-pannel">
          {isNewPost ? <NewPosts getPosts={getPosts} /> : null}
          {posts.length ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <h3 style={{ textAlign: "center" }}>
              It seems that none of the people you follow have posted in the
              last three days... Try following some more accounts to see more
              new content!
            </h3>
          )}
        </div>
        <div className="right-pannel">
          <AccountShort />
        </div>
      </div>
    </div>
  );
}
