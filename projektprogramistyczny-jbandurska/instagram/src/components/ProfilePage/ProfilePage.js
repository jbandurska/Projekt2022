import SideMenu from "../SideMenu/SideMenu";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import PostsGrid from "../PostsGrid/PostsGrid";
import "./ProfilePage.css";
import UnloggedBar from "../UnloggedBar/UnloggedBar";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ProfilePage() {
  const { username } = useParams();
  const currentUser = localStorage.getItem("currentUser");
  const [isPrivate, setIsPrivate] = useState(true);
  const [userId, setUserId] = useState("");

  const mainSectionClass = currentUser
    ? "profile-main profile-main-margin"
    : "profile-main";

  return (
    <div className="wrapper">
      {currentUser ? null : <UnloggedBar />}
      <div className="home">
        {currentUser ? (
          <SideMenu active={username === currentUser ? "Profile" : ""} />
        ) : null}
        <div className={mainSectionClass}>
          <ProfileHeader setIsPrivate={setIsPrivate} setUserId={setUserId} />
          <PostsGrid isPrivate={isPrivate} userId={userId} />
        </div>
      </div>
    </div>
  );
}
