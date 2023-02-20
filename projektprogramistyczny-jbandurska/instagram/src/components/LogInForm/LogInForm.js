import instagramLogo from "../../img/instagram-text.png";
import "./LogInForm.css";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LogInForm() {
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [message, setMessage] = useState("");
  const [, setCookie] = useCookies(["currentUser", "currentUserId"]);

  function showPassword() {
    const input = document.querySelector("#password-input");

    input.type = input.type === "password" ? "text" : "password";
  }

  function validate(values) {
    setMessage("");

    const errors = {};

    if (!values.username) {
      errors.username = true;
    }

    if (!values.password) {
      errors.password = true;
    }

    if (errors.username || errors.password) setIsSubmittable(false);
    else setIsSubmittable(true);

    return errors;
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL
          }/users/login/${values.username.toLowerCase()}`,
          {
            params: {
              password: values.password,
            },
          }
        );

        if (!response.data.message) {
          setCookie("currentUser", response.data.username, { path: "/" });
          setCookie("currentUserId", response.data.id, { path: "/" });
          localStorage.setItem("currentUser", response.data.username);
          localStorage.setItem("currentUserId", response.data.id);
          window.location.reload(false);
        } else {
          setMessage("Incorrect username and/or password.");
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <>
      <div className="logInForm">
        <img src={instagramLogo} alt="Instagram" />
        <form onSubmit={formik.handleSubmit}>
          <label>
            Phone number, username or email
            <input
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
          </label>
          <label className="password-label">
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
          {isSubmittable ? (
            <button type="submit" className="login-button">
              Log In
            </button>
          ) : (
            <button type="submit" className="login-button" disabled>
              Log In
            </button>
          )}
        </form>
      </div>
      <div className="register">
        <p style={{ marginBottom: "5px" }}>
          Don't have an account?
          <Link to={"/accounts/emailsignup/"} className="link">
            Sign up
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
