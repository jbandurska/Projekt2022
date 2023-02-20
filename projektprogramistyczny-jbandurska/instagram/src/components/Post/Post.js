import { FaComment } from "@react-icons/all-files/fa/FaComment";
import { FaTelegramPlane } from "@react-icons/all-files/fa/FaTelegramPlane";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./Post.css";
import { Link } from "react-router-dom";
import LikeButton from "../LikeButton/LikeButton";
import CommentForm from "../CommentForm/CommentForm";
import ShortCommentsList from "../ShortCommentsList/ShortCommentsList";
import Modal from "../../Modal";
import PictureModal from "../PictureModal/PictureModal";

export default function Post({ post, getPost }) {
  const { picture, userId, likes, description, id } = post;
  const currentUserId = localStorage.getItem("currentUserId");
  const [userInfo, setUserInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(likes);
  const [showModal, setShowModal] = useState(false);
  const commentInput = useRef();
  const toggleModal = useCallback(() => setShowModal(!showModal), [showModal]);

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/id/${userId}`
      );
      setUserInfo(response.data.user);
    };
    getUserInfo();
  }, [userId]);

  const getComments = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/posts/comments/${id}`
    );

    setComments(data.data.comments);
  };

  return id ? (
    <div className="post">
      <div className="picture-header">
        <Link to={`${userInfo.username}`}>
          <img
            src={userInfo.profilePicture}
            className="account-picture"
            alt={userInfo.username}
          />
          <span>{userInfo.username}</span>
        </Link>
      </div>
      <img src={picture} alt={id} />
      <div className="picture-bottom">
        <LikeButton
          pictureId={id}
          getPost={getPost}
          userId={userInfo.id}
          setLikesCount={setLikesCount}
        />
        <FaComment
          className="icon"
          onClick={() => commentInput.current.focus()}
        />
        <Link
          to={
            userId > currentUserId
              ? `/direct/inbox/${currentUserId}:${userId}`
              : `/direct/inbox/${userId}:${currentUserId}`
          }
          style={{ display: "inline" }}
        >
          <FaTelegramPlane className="icon" />
        </Link>
      </div>
      <p className="likes">{likesCount} likes</p>
      <p className="description">
        <Link to={`${userInfo.username}`}>
          <span>{userInfo.username} </span>
        </Link>
        {description}
      </p>
      <CommentForm
        getComments={getComments}
        pictureId={id}
        commentInput={commentInput}
        userId={userInfo.id}
      />
      <ShortCommentsList
        toggleModal={toggleModal}
        getComments={getComments}
        comments={comments}
      />
      {showModal ? (
        <Modal div="modal">
          <PictureModal
            showModal={showModal}
            toggleModal={toggleModal}
            id={id}
          />
        </Modal>
      ) : null}
    </div>
  ) : null;
}
