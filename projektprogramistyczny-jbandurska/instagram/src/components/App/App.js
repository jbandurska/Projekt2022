import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LogInForm from "../LogInForm/LogInForm";
import Home from "../Home/Home";
import RegisterForm from "../RegisterForm/RegisterForm";
import ProfilePage from "../ProfilePage/ProfilePage";
import EditAccount from "../EditAccount/EditAccount";
import EditPassword from "../EditPassword/EditPassword";
import ScrollToTop from "../../ScrollToTop.ts";
import "./App.css";
import { useEffect } from "react";
import Inbox from "../Inbox/Inbox";
import PendingFollowRequests from "../PendingFollowRequests/PendingFollowRequests";
import LoadAccountFile from "../LoadAccountFile/LoadAccountFile";

function App() {
  const [cookies] = useCookies(["currentUser, currentUserId"]);

  useEffect(() => {
    // Jeśli localStorage się wyczyścił, ale mamy zapisane cookies z naszą nazwą
    // użytkownika - możemy zostać "zalogowani" ponownie
    if (
      !localStorage.getItem("currentUser") &&
      cookies.currentUser &&
      cookies.currentUserId
    ) {
      localStorage.setItem("currentUser", cookies.currentUser);
      localStorage.setItem("currentUserId", cookies.currentUserId);
    }
  }, [cookies.currentUser, cookies.currentUserId]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {localStorage.getItem("currentUser") ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/accounts/edit/" element={<EditAccount />} />
            <Route path="/pending/" element={<PendingFollowRequests />} />
            <Route path="/direct/inbox/:roomId" element={<Inbox />} />
            <Route
              path="/accounts/password/change/"
              element={<EditPassword />}
            />
          </>
        ) : (
          <>
            <Route path="/accounts/emailsignup/" element={<RegisterForm />} />
            <Route path="/" element={<LogInForm />} />
            <Route path="/accounts/loadfile/" element={<LoadAccountFile />} />
          </>
        )}
        <Route path="/:username/" element={<ProfilePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
