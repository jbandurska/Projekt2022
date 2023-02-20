import { useCallback, useEffect, useRef, useState } from "react";
import { FaComment } from "@react-icons/all-files/fa/FaComment";
import { FaTelegramPlane } from "@react-icons/all-files/fa/FaTelegramPlane";
import PictureProfileHeader from "../PictureProfileHeader/PictureProfileHeader";
import axios from "axios";
import "./PictureModal.css";
import LikeButton from "../LikeButton/LikeButton";
import CommentForm from "../CommentForm/CommentForm";
import CommentsList from "../CommentsList/CommentsList";
import { Link } from "react-router-dom";

export default function PictureModal({
  showModal,
  toggleModal,
  id,
  changeCurrentPostId,
}) {
  const [post, setPost] = useState({});
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState([]);
  const commentInput = useRef();

  const currentUserId = localStorage.getItem("currentUserId");

  const handleResize = () => {
    const img = document.querySelector(".picture-modal >img");
    const info = document.querySelector(".picture-info");

    if (info) info.style.height = img.offsetHeight + "px";
  };

  const handleArrowClick = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") changeCurrentPostId(id, "prev");
      else if (e.key === "ArrowRight") changeCurrentPostId(id, "next");
    },
    [id, changeCurrentPostId]
  );

  useEffect(() => {
    const handleModalClick = (e) => {
      if (e.target.id === "modal") {
        toggleModal();
      }
    };

    const modalRoot = document.getElementById("modal");
    modalRoot.addEventListener("click", handleModalClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleArrowClick);

    return () => {
      modalRoot.removeEventListener("click", handleModalClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleArrowClick);
    };
  }, [showModal, toggleModal, handleArrowClick]);

  const getPost = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/posts/${id}`
    );
    setPost(response.data);
    setDescription(response.data.description);
  };

  useEffect(() => {
    handleResize();
  }, [post.picture]);

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveChanges = async () => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/posts/${id}`,
      { description }
    );

    setDescription(response.data.description);
    setEditing(false);
  };

  const handleDelete = async () => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`);
    window.location.reload(false);
  };

  const getComments = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/posts/comments/${id}`
    );

    setComments(data.data.comments);
  };

  return post.userId ? (
    <div className="picture-modal">
      <img src={post.picture} alt={post.id} />
      <div className="picture-info">
        <PictureProfileHeader userId={post.userId} />
        <div className="description">
          {editing ? (
            <div className="buttons column">
              <textarea
                value={description}
                maxLength={250}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
          ) : (
            description
          )}
        </div>
        {post.userId === localStorage.getItem("currentUserId") ? (
          <div className="buttons">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        ) : null}
        <div className="icons">
          <LikeButton pictureId={id} getPost={getPost} userId={post.userId} />
          <FaComment
            className="icon"
            onClick={() => commentInput.current.focus()}
          />
          <Link
            to={
              post.userId > currentUserId
                ? `/direct/inbox/${currentUserId}:${post.userId}`
                : `/direct/inbox/${post.userId}:${currentUserId}`
            }
            style={{ display: "inline" }}
          >
            <FaTelegramPlane className="icon" />
          </Link>
        </div>
        <div className="likes">Liked by {post.likes} people</div>
        <CommentForm
          pictureId={id}
          commentInput={commentInput}
          getComments={getComments}
          userId={post.userId}
        />
        <CommentsList
          getComments={getComments}
          comments={comments}
          userId={post.userId}
          postId={id}
        />
      </div>
    </div>
  ) : null;
}
