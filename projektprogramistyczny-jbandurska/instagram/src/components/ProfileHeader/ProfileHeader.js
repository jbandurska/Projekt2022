import "./ProfileHeader.css";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "../../Modal";
import FollowersList from "../FollowersList/FollowersList";
import { useMQTT } from "../MQTTProvider";

export default function ProfileHeader({ setIsPrivate, setUserId }) {
  const { username } = useParams();
  const currentUser = localStorage.getItem("currentUser");
  const currentUserId = localStorage.getItem("currentUserId");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [accountData, setAccountData] = useState({
    id: "",
    fullname: "",
    profilePicture: "",
    description: "",
    posts: [],
    following: [],
    followers: [],
    private: true,
  });
  const [buttons, setButtons] = useState(<></>);
  const { publishMsg } = useMQTT();

  const publishFollowRequest = () => {
    publishMsg(
      JSON.stringify({
        message: " sent you a follow request!",
        user: currentUserId,
        link: "/pending/",
      }),
      accountData.id
    );
  };

  const publishFollow = () => {
    publishMsg(
      JSON.stringify({
        message: " is now following you!",
        user: localStorage.getItem("currentUserId"),
      }),
      accountData.id
    );
  };

  const followUser = async () => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/follow/${accountData.id}`,
      {
        userId: currentUserId,
      }
    );

    getAccountData(username);
    publishFollow();
  };

  const unfollowUser = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/follow/${accountData.id}`,
      {
        params: { userId: currentUserId },
      }
    );

    getAccountData(username);
  };

  const sendFollowRequest = async () => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/follow/request/${accountData.id}`,
      {
        userId: currentUserId,
      }
    );

    getAccountData(username);
    publishFollowRequest();
  };

  const getAccountData = useMemo(() => {
    return async (username) => {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${username}`
      );

      setAccountData(data.data);
      setIsPrivate(data.data.private);
      setUserId(data.data.id);
    };
  }, [setIsPrivate, setUserId]);

  useEffect(() => {
    getAccountData(username);
    setShowModal(false);
  }, [username, getAccountData]);

  useEffect(() => {
    // Jakie przyciski mają być wyświetlane na profilu
    const messageLoggedButton = (
      <Link
        to={
          accountData.id > currentUserId
            ? `/direct/inbox/${currentUserId}:${accountData.id}`
            : `/direct/inbox/${accountData.id}:${currentUserId}`
        }
        className="button"
      >
        Message
      </Link>
    );
    const unfollowButton = (
      <Link
        style={{ marginRight: "5px" }}
        className="button"
        onClick={unfollowUser}
      >
        Unfollow
      </Link>
    );

    // Jeśli to twój profil
    if (username === currentUser) {
      if (accountData.private) {
        setButtons(
          <>
            <Link
              to="/accounts/edit/"
              className="button"
              style={{ marginRight: "5px" }}
            >
              Edit profile
            </Link>
            <Link to="/pending/" className="button">
              Follow requests
            </Link>
          </>
        );
      } else {
        setButtons(
          <Link to="/accounts/edit/" className="button">
            Edit profile
          </Link>
        );
      }
    }
    // Jeśli to nie twój profil
    else {
      // Jeśli nie jesteś zalogowany
      if (
        localStorage.getItem("currentUser") === "" ||
        !localStorage.getItem("currentUser")
      ) {
        setButtons(
          <>
            <Link to="/" style={{ marginRight: "5px" }} className="button">
              Follow
            </Link>
            <Link to="/" className="button">
              Message
            </Link>
          </>
        );
      }
      // Jeśli jesteś zalogowany i na cudzym profilu
      else {
        // Jeśli to konto prywatne
        if (accountData.private) {
          // Jeśli czekasz na zatwierdzenie prośby o obserwację
          if (
            accountData.requests &&
            accountData.requests.includes(currentUserId)
          ) {
            setButtons(
              <>
                {!accountData.followers.includes(currentUserId) ? (
                  <Link style={{ marginRight: "5px" }} className="button">
                    Request sent
                  </Link>
                ) : (
                  unfollowButton
                )}
                {messageLoggedButton}
              </>
            );
          }
          // Jeśli nie ma cię na liście oczekujących
          else {
            setButtons(
              <>
                {!accountData.followers.includes(currentUserId) ? (
                  <Link
                    style={{ marginRight: "5px" }}
                    className="button vivid"
                    onClick={sendFollowRequest}
                  >
                    Send request
                  </Link>
                ) : (
                  unfollowButton
                )}
                {messageLoggedButton}
              </>
            );
          }
        }
        // Jeśli to konto publiczne
        else {
          setButtons(
            <>
              {!accountData.followers.includes(currentUserId) ? (
                <Link
                  style={{ marginRight: "5px" }}
                  className="button vivid"
                  onClick={followUser}
                >
                  Follow
                </Link>
              ) : (
                unfollowButton
              )}
              {messageLoggedButton}
            </>
          );
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData]);

  const { followers, following, posts, profilePicture, fullname, description } =
    accountData;

  const toggleModal = () => setShowModal(!showModal);

  return !fullname ? (
    <div style={{ textAlign: "center", padding: "200px 0" }}>
      Account with username {username} was not found.
    </div>
  ) : (
    <div className="profile-header">
      <div className="picture">
        <img src={profilePicture} alt={username} />
      </div>
      <div className="info">
        <div className="username">
          <h2>{username}</h2>
          <div className="profile-header-buttons">{buttons}</div>
        </div>
        <ul>
          <li>
            <span>{posts.length}</span> posts
          </li>
          <li
            onClick={() => {
              toggleModal();
              setModalContent(accountData.followers);
            }}
            className="clickable"
          >
            <span>{followers.length}</span> followers
          </li>
          <li
            onClick={() => {
              toggleModal();
              setModalContent(accountData.following);
            }}
            className="clickable"
          >
            <span>{following.length}</span> following
          </li>
        </ul>
        {showModal ? (
          <Modal div="modal">
            <FollowersList
              followers={modalContent}
              toggleModal={toggleModal}
              showModal={showModal}
            />
          </Modal>
        ) : null}
        <span className="fullname">{fullname}</span>
        <span className="description">{description}</span>
      </div>
    </div>
  );
}
