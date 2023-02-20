import { useFormik } from "formik";
import axios from "axios";
import "./EditAccountForm.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { updateAccount } from "../accountReducer.ts";

export default function EditAccountForm() {
  const state = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const descriptionInput = useRef();
  const [msg, setMsg] = useState("");
  const [isDataDownloaded, setIsDataDownloaded] = useState(false);
  const [, setCookie] = useCookies(["currentUser"]);

  const getAccountData = async (username) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${username}`
    );

    dispatch(updateAccount(data.data));
    formik.setFieldValue("fullname", data.data.fullname);
    formik.setFieldValue("username", data.data.username);
    formik.setFieldValue("description", data.data.description);
    formik.setFieldValue("numberOrEmail", data.data.numberOrEmail);
    formik.setFieldValue("private", data.data.private);

    setIsDataDownloaded(true);
  };

  useLayoutEffect(() => {
    descriptionInput.current.style.height =
      descriptionInput.current.scrollHeight + "px";
  }, [isDataDownloaded]);

  useEffect(() => {
    if (!state.fullname) getAccountData(localStorage.getItem("currentUser"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFile = async () => {
    const input = document.querySelector("#file-input");

    setMsg("");

    const data = new FormData();
    data.append("file", input.files[0]);

    if (input.files[0].size > 1048576) {
      setMsg(
        (newMsg) => newMsg + " File is too big. It can't be bigger than 1MB!"
      );
      input.value = "";
    } else {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/picture/${localStorage.getItem(
          "currentUser"
        )}`,
        data
      );
    }
  };

  const validate = (values) => {
    setMsg("");
    const errors = {};

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.numberOrEmail) &&
      !/^[0-9]{9,11}$/i.test(values.numberOrEmail)
    ) {
      errors.numberOrEmail = "Nieprawidłowy email lub numer telefonu";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullname: state.fullname || "",
      username: state.username || "",
      description: state.description || "",
      numberOrEmail: state.numberOrEmail || "",
      profilePicture: "",
      private: state.private || false,
    },
    validate,
    onSubmit: async (values) => {
      const picture = document.querySelector("#file-input").value;
      if (picture) await uploadFile();

      const data = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${localStorage.getItem(
          "currentUser"
        )}`,
        values
      );

      setMsg(data.data.message);
      setCookie("currentUser", data.data.username, { path: "/" });
      localStorage.setItem("currentUser", data.data.username);
      dispatch(updateAccount(data.data));
    },
  });

  const handlePictureInput = () => {
    // Skoro ładujemy nowe zdjęcie to znaczy, że nie chcemy go resetować
    formik.setFieldValue("profilePicture", "");
  };

  const handlePictureReset = () => {
    formik.setFieldValue(
      "profilePicture",
      "https://i.pinimg.com/474x/a7/e7/0f/a7e70f694c71eb52be215bb06e882116.jpg"
    );
  };

  return (
    <div className="edit-account-form">
      <form onSubmit={formik.handleSubmit}>
        <label>
          Private Account
          <input
            name="private"
            type="checkbox"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.private}
            style={{ width: "auto" }}
          />
        </label>
        <label>
          Profile Picture
          <input
            type="file"
            name="profilePicture"
            accept="image/png, image/jpeg"
            id="file-input"
            onChange={handlePictureInput}
          />
        </label>
        <button
          type="button"
          className="reset-profile-picture-button"
          onClick={handlePictureReset}
        >
          Reset profile picture
        </button>
        <label>
          Name
          <input
            name="fullname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullname}
          />
        </label>
        <label>
          Username
          <input
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            maxLength="30"
          />
        </label>
        <label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Bio
            <textarea
              ref={descriptionInput}
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              maxLength="150"
            />
          </div>
          <p className="small-p">Max 150 characters</p>
        </label>
        <label>
          Phone number / Email
          <input
            name="numberOrEmail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.numberOrEmail}
          />
          {formik.errors.numberOrEmail ? (
            <p className="small-p">{formik.errors.numberOrEmail}</p>
          ) : null}
        </label>
        <button type="submit" className="button">
          Submit
        </button>
        {msg ? (
          <p
            style={{
              color: "rgb(0, 149, 246)",
              alignSelf: "center",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {msg}
          </p>
        ) : null}
      </form>
    </div>
  );
}
