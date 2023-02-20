import { useEffect } from "react";
import "./CommentsList.css";
import { Link } from "react-router-dom";
import { RiDeleteBin5Fill } from "@react-icons/all-files/ri/RiDeleteBin5Fill";
import axios from "axios";

export default function CommentsList({
  comments,
  getComments,
  userId,
  postId,
}) {
  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteComment = async (commentId) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/posts/comments/${postId}`,
      { params: { commentId } }
    );
    getComments();
  };

  return (
    <ul className="comments-list">
      {comments.map((comment) => (
        <li key={comment.id}>
          <div>
            <Link to={`/${comment.username}`}>{comment.username}</Link>
            {comment.content}
          </div>

          {/* Jeśli komentarz lub post jest twój możesz go usunąć */}
          {comment.username === localStorage.getItem("currentUser") ||
          userId === localStorage.getItem("currentUserId") ? (
            <button onClick={() => handleDeleteComment(comment.id)}>
              <RiDeleteBin5Fill />
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
