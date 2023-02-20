import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";

export default function LoadAccountFile() {
  const [, setCookie] = useCookies(["currentUser, currentUserId"]);
  const fileInput = useRef();
  const [fileContent, setFileContent] = useState({});
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function showPassword() {
    const input = document.querySelector("#password-input");
    input.type = input.type === "password" ? "text" : "password";
  }

  function validate(values) {
    let msg = "";
    const errors = {};

    if (!values.file) {
      errors.file = true;
      msg += " You need to upload the file.";
    }

    if (!values.password) {
      errors.password = true;
      msg += " You need to type in the password.";
    }

    setMessage(msg);

    return errors;
  }

  function handleFileLoad(event, password) {
    setPassword(password);
    setFileContent(JSON.parse(event.target.result));
  }

  const registerFromFile = useMemo(() => {
    return async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/users`,
          { ...fileContent, password, following: [], followers: [] }
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
    };
  }, [fileContent, password, setCookie]);

  const formik = useFormik({
    initialValues: {
      file: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      const reader = new FileReader();
      reader.onload = (event) => handleFileLoad(event, values.password);
      reader.readAsText(fileInput.current.files[0]);
    },
  });

  useEffect(() => {
    if (JSON.stringify(fileContent) !== JSON.stringify({})) registerFromFile();
  }, [fileContent, registerFromFile]);

  return (
    <>
      <div className="logInForm">
        <h2 className="under-logo-register-form" style={{ marginTop: "-10px" }}>
          Please load your account copy file to register
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="file"
            accept=".txt"
            name="file"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.file}
            style={{ backgroundColor: "white" }}
            ref={fileInput}
          />
          <label className="relative-label">
            Set new password
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
          <button type="submit" className="login-button">
            Submit
          </button>
          <pre id="fileContent"></pre>
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
          Don't have an account?
          <Link to={"/accounts/emailsignup/"} className="link">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
