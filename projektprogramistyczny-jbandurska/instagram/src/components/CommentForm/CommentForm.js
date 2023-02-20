import { useState } from "react";
import { FaArrowUp } from "@react-icons/all-files/fa/FaArrowUp";
import "./CommentForm.css";
import axios from "axios";
import { useMQTT } from "../MQTTProvider";

export default function CommentForm({
  pictureId,
  commentInput,
  getComments,
  userId,
}) {
  const [comment, setComment] = useState("");
  const { publishMsg } = useMQTT();

  const publishComment = (comment) => {
    publishMsg(
      JSON.stringify({
        message: ` wrote a comment "${comment}"`,
        user: localStorage.getItem("currentUserId"),
        picture: pictureId,
      }),
      userId
    );
  };

  const handleInput = (e) => setComment(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${process.env.REACT_APP_API_URL}/posts/comments/${pictureId}`,
      {
        userId: localStorage.getItem("currentUserId"),
        content: comment,
      }
    );
    setComment("");
    getComments();
    publishComment(comment);
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleInput}
          onBlur={handleInput}
          placeholder="Type comment..."
          ref={commentInput}
          maxLength={100}
        />
        <button type="submit">
          <FaArrowUp />
        </button>
      </form>
    </div>
  );
}
