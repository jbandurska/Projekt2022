import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import axios from "axios";
import { useMQTT } from "../MQTTProvider";
import { useLayoutEffect, useState } from "react";
import { useProfile } from "../ProfileProvider/ProfileProvider";
import { useSelector } from "react-redux";

export default function LikeButton({
  pictureId,
  getPost,
  userId,
  setLikesCount,
}) {
  const { getAccountData } = useProfile();
  const state = useSelector((state) => state.account);
  const [color, setColor] = useState("#333");
  const [type, setType] = useState("like");
  const { publishMsg } = useMQTT();

  const publishLike = () => {
    publishMsg(
      JSON.stringify({
        message: " liked your photo!",
        user: localStorage.getItem("currentUserId"),
        picture: pictureId,
      }),
      userId
    );
  };

  useLayoutEffect(() => {
    if (state.likedPosts.includes(pictureId)) {
      setColor("rgb(198, 0, 0)");
      setType("unlike");
    } else {
      setColor("#333");
      setType("like");
    }
  }, [state, pictureId]);

  const handleLike = async () => {
    if (!state.likedPosts.includes(pictureId)) {
      publishLike();
      if (setLikesCount) setLikesCount((prev) => prev + 1);
    } else {
      if (setLikesCount) setLikesCount((prev) => prev - 1);
    }

    await axios.patch(
      `${process.env.REACT_APP_API_URL}/posts/like/${pictureId}`,
      {
        userId: localStorage.getItem("currentUserId"),
        type,
      }
    );

    getAccountData();
    if (getPost) getPost();
  };

  return (
    <span>
      <FaHeart className="icon" onClick={handleLike} fill={color} />
    </span>
  );
}
