import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ShortCommentsList.css";

export default function ShortCommentsList({
  comments,
  getComments,
  toggleModal,
}) {
  const [lastComment, setLastComment] = useState("");

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (comments.length) setLastComment(comments[comments.length - 1]);
  }, [comments]);

  return (
    <ul className="comments-list short-comments-list">
      {comments.length > 1 ? (
        <p onClick={toggleModal}>See all {comments.length} comments</p>
      ) : null}
      {lastComment ? (
        <li key={lastComment.id}>
          <div>
            <Link to={`/${lastComment.username}`}>{lastComment.username}</Link>
            {lastComment.content}
          </div>
        </li>
      ) : null}
    </ul>
  );
}
