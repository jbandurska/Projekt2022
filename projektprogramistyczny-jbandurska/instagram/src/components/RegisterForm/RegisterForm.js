import instagramLogo from "../../img/instagram-text.png";
import "./RegisterForm.css";
import { useFormik } from "formik";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { FaExclamationCircle } from "@react-icons/all-files/fa/FaExclamationCircle";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function RegisterForm() {
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [message, setMessage] = useState("");
  const [, setCookie] = useCookies(["currentUser, currentUserId"]);

  function showPassword() {
    const input = document.querySelector("#password-input");

    input.type = input.type === "password" ? "text" : "password";
  }

  function validate(values) {
    const errors = {};

    if (!values.numberOrEmail) {
      errors.numberOrEmail = true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.numberOrEmail) &&
      !/^[0-9]{9,11}$/i.test(values.numberOrEmail)
    ) {
      errors.numberOrEmail = true;
    }

    if (!values.fullname) {
      errors.fullname = true;
    }

    if (!values.username || values.username.includes(":")) {
      errors.username = true;
    }

    if (!values.password) {
      errors.password = true;
    }

    if (
      errors.username ||
      errors.fullname ||
      errors.numberOrEmail ||
      errors.password
    )
      setIsSubmittable(false);
    else setIsSubmittable(true);

    return errors;
  }

  const formik = useFormik({
    initialValues: {
      numberOrEmail: "",
      fullname: "",
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/users`,
          values
        );

        if (!response.data.message) {
          setCookie("currentUser", response.data.username, { path: "/" });
          setCookie("currentUserId", response.data.id, { path: "/" });
          localStorage.setItem("currentUser", response.data.username);
          localStorage.setItem("currentUserId", response.data.id);
          window.location.reload(false);
        } else setMessage(response.data.message);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <>
      {localStorage.getItem("currentUser") ? <Navigate to="/" /> : null}
      <div className="logInForm">
        <img src={instagramLogo} alt="Instagram" />
        <h2 className="under-logo-register-form">
          Sign up to see photos and videos from your friends.
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <label className="relative-label">
            Mobile number or email
            <input
              name="numberOrEmail"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.numberOrEmail}
            />
            {formik.errors.numberOrEmail ? (
              <div className="input-button invalid">
                <FaExclamationCircle />
              </div>
            ) : null}
          </label>
          <label className="relative-label">
            Full Name
            <input
              name="fullname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullname}
            />
            {formik.errors.fullname ? (
              <div className="input-button invalid">
                <FaExclamationCircle />
              </div>
            ) : null}
          </label>
          <label className="relative-label">
            Username
            <input
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              type="text"
              maxLength="30"
            />
            {formik.errors.username ? (
              <div className="input-button invalid">
                <FaExclamationCircle />
              </div>
            ) : null}
          </label>
          <label className="relative-label">
            Password
            <input
              id="password-input"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <button
              type="button"
              className="input-button"
              onClick={showPassword}
            >
              Show
            </button>
          </label>
          <p className="logging-message">{message}</p>
          <p className="under-input-register-form">
            By signing up, you agree to our <span>Terms</span>. We collect, use
            and share your data in our <span>Privacy Policy</span> and we use
            cookies and similar technology in our
            <span> Cookies Policy </span>.
          </p>
          {isSubmittable ? (
            <button type="submit" className="login-button">
              Register
            </button>
          ) : (
            <button type="submit" className="login-button" disabled>
              Register
            </button>
          )}
        </form>
      </div>
      <div className="register">
        <p style={{ marginBottom: "5px" }}>
          Already have an account?
          <Link to={"/"} className="link">
            Log in
          </Link>
        </p>
        <p>
          Or click
          <Link to="/accounts/loadfile/" className="link">
            here
          </Link>{" "}
          to load your account from file!
        </p>
      </div>
    </>
  );
}
