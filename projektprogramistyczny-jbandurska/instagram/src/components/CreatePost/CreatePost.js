import "./CreatePost.css";
import { FaFileImage } from "@react-icons/all-files/fa/FaFileImage";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMQTT } from "../MQTTProvider";

export default function CreatePost({ toggleModal, showModal }) {
  const [msg, setMsg] = useState("");
  const [dataForm, setDataForm] = useState("");
  const [isPicture, setIsPicture] = useState(false);
  const fileInput = useRef();
  const textarea = useRef();
  const state = useSelector((state) => state.account);
  const { publishMsg } = useMQTT();

  const publishNewPost = () => {
    state.followers.forEach((follower) => {
      publishMsg(
        JSON.stringify({
          message: "new post",
        }),
        follower
      );
    });
  };

  useEffect(() => {
    const handleModalClick = (e) => {
      if (e.target.id === "modal") {
        toggleModal();
      }
    };

    const modalRoot = document.getElementById("modal");
    modalRoot.addEventListener("click", handleModalClick);

    return () => {
      modalRoot.removeEventListener("click", handleModalClick);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const verifyFileSize = async () => {
    setMsg("");
    let okSize = false;

    const data = new FormData();
    data.append("file", fileInput.current.files[0]);
    setDataForm(data);

    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    const objectUrl = _URL.createObjectURL(fileInput.current.files[0]);
    img.onload = function () {
      _URL.revokeObjectURL(objectUrl);
      if (this.width !== this.height) {
        setMsg(
          (newMsg) =>
            newMsg +
            " Image has to be 1:1. Please edit your image before uploading."
        );
        fileInput.current.value = "";
      } else if (okSize) {
        setIsPicture(true);
      }
    };
    img.src = objectUrl;

    if (fileInput.current.files[0].size > 1048576 * 2) {
      setMsg(
        (newMsg) => newMsg + " File is too big. It can't be bigger than 2MB!"
      );
      fileInput.current.value = "";
    } else {
      okSize = true;
    }
  };

  const handlePictureChange = () => {
    verifyFileSize();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = dataForm;
    dataToSend.append("userId", localStorage.getItem("currentUserId"));
    dataToSend.append("description", textarea.current.value);

    await axios.post(`${process.env.REACT_APP_API_URL}/posts`, dataForm);
    publishNewPost();

    window.location.reload(false);
  };

  return (
    <div className="create-post">
      <h3>Create new post</h3>
      <div className="load-file">
        {isPicture ? (
          <>
            <form onSubmit={handleSubmit}>
              <h4>Add description to your photo!</h4>
              <textarea maxLength={250} ref={textarea} />
              <button type="submit" className="button">
                Add photo
              </button>
            </form>
          </>
        ) : (
          <>
            <FaFileImage />
            <label className="button">
              <input
                type="file"
                accept="image/png, image/jpeg"
                id="file-input"
                onChange={handlePictureChange}
                ref={fileInput}
              />
              Select from computer
            </label>
            {msg ? <div>{msg}</div> : null}
          </>
        )}
      </div>
    </div>
  );
}
