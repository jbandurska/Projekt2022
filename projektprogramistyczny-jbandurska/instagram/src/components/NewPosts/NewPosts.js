import { useMQTT } from "../MQTTProvider";
import "./NewPosts.css";

export default function NewPosts({ getPosts }) {
  const { setIsNewPost } = useMQTT();
  return (
    <div
      className="new-posts"
      onClick={() => {
        setIsNewPost(false);
        getPosts();
      }}
    >
      New Posts
    </div>
  );
}
