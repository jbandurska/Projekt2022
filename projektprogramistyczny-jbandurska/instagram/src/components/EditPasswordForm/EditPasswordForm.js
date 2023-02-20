import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import DeleteAccountButton from "../EditPasswordForm/DeleteAccountButton";
import { useSelector } from "react-redux";

export default function EditPasswordForm() {
  const [msg, setMsg] = useState("");
  const state = useSelector((state) => state.account);

  const validate = (values) => {
    setMsg("");
    const errors = {};

    if (values.newPassword !== values.confirmNewPassword)
      errors.confirmNewPassword = "Make sure that both passwords are the same.";
    if (values.newPassword === "")
      errors.confirmNewPassword = "New password cannot be empty.";

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validate,
    onSubmit: async (values) => {
      const data = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/password/${localStorage.getItem(
          "currentUser"
        )}`,
        values
      );

      setMsg(data.data.message);
    },
  });

  return (
    <div className="edit-account-form">
      <form onSubmit={formik.handleSubmit}>
        <label>
          Old password
          <input
            name="oldPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            type="password"
          />
        </label>
        <label>
          New password
          <input
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            type="password"
          />
        </label>
        <label>
          Confirm new password
          <input
            name="confirmNewPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmNewPassword}
            type="password"
          />
          {formik.errors.confirmNewPassword ? (
            <p className="small-p">{formik.errors.confirmNewPassword}</p>
          ) : null}
        </label>
        <button type="submit" className="button">
          Change password
        </button>
        <DeleteAccountButton
          id={localStorage.getItem("currentUserId")}
          setMsg={setMsg}
          pswd={formik.values.oldPassword}
        />
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
        <a
          className="button delete-button"
          href={
            "data:text/plain;charset=utf-8," +
            encodeURIComponent(JSON.stringify(state))
          }
          download={`${state.username}-account-copy.txt`}
        >
          Download account copy
        </a>
      </form>
    </div>
  );
}
