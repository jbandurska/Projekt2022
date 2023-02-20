import { FaSistrix } from "@react-icons/all-files/fa/FaSistrix";
import { FaTelegramPlane } from "@react-icons/all-files/fa/FaTelegramPlane";
import { FaCircleNotch } from "@react-icons/all-files/fa/FaCircleNotch";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaPlus } from "@react-icons/all-files/fa/FaPlus";

import instagramLogo from "../../img/instagram-text.png";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProfile } from "../ProfileProvider/ProfileProvider";
import SearchPannel from "../SearchPannel/SearchPannel";
import CreatePost from "../CreatePost/CreatePost";
import "./SideMenu.css";
import Modal from "../../Modal";
import Notifications from "../Notifications/Notifications";
import { useMQTT } from "../MQTTProvider";
import NotificationCircle from "../NotificationCircle/NotificationCircle";
import { useSelector } from "react-redux";

export default function SideMenu({ active }) {
  const [showModal, setShowModal] = useState(false);
  const [, setCookie] = useCookies(["currentUser", "currentUserId"]);
  const [lastClicked, setLastClicked] = useState("");
  const [elemToRender, setElemToRender] = useState(<></>);
  const { getAccountData } = useProfile();
  const state = useSelector((state) => state.account);
  const { setNotificationsCount, setNotifications } = useMQTT();

  const unwind = (toUnwind) => {
    // toUnwind czyli czy wysunąć panel z wyszukiwaniem/powiadomieniami
    const menu = document.querySelector(".side-menu");
    const logo = document.querySelector(".logo");
    const pullout = document.querySelector(".pullout-elem");
    const listElements = document.querySelectorAll(".side-menu li");

    if (toUnwind === "toggle") {
      menu.classList.toggle("side-menu-unwind");
      logo.classList.toggle("logo-unwind");
      pullout.classList.toggle("pullout-elem-unwind");
      listElements.forEach((el) => {
        el.classList.toggle("unhovery");
      });
    } else if (toUnwind === "wind down") {
      menu.classList.remove("side-menu-unwind");
      logo.classList.remove("logo-unwind");
      pullout.classList.remove("pullout-elem-unwind");
      listElements.forEach((el) => {
        el.classList.remove("unhovery");
      });
    }
  };

  const fold = (clickedElement) => {
    // clickedElement === "" jeśli kliknęliśmy poza menu
    // Wtedy jeśli lastClicked też jest pusty oznacza to, że menu jest schowane i nic nie zmieniamy
    // Jeśli lastClicked nie jest puste - chowamy menu
    if (clickedElement === "" && lastClicked === "") return;

    if (clickedElement === "" && lastClicked !== "") {
      unwind("wind down");
      setElemToRender(<></>);
      setLastClicked("");
      return;
    }

    // Zmieniamy ułożenie elementów
    if (lastClicked === clickedElement || lastClicked === "") unwind("toggle");

    // Zmieniamy zawartość i zmienne pomocnicze
    const newValue = lastClicked === clickedElement ? "" : clickedElement;
    setLastClicked(newValue);

    switch (newValue) {
      case "Search":
        setElemToRender(<SearchPannel />);
        break;
      case "Notifications":
        setElemToRender(<Notifications />);
        break;
      default:
        setElemToRender(<></>);
        break;
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!document.querySelector(".side-menu-wrapper").contains(e.target))
        fold("");
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastClicked]);

  useEffect(() => {
    if (!state.profilePicture)
      getAccountData(localStorage.getItem("currentUser"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  const menuElements = [
    { icon: <FaHome className="icon" />, text: "Home", link: "/" },
    { icon: <FaSistrix className="icon" />, text: "Search", onclick: fold },
    {
      icon: (
        <>
          <NotificationCircle type="message" />
          <FaTelegramPlane className="icon" />
        </>
      ),
      text: "Messages",
      link: "/direct/inbox/:",
    },
    {
      icon: (
        <>
          <NotificationCircle type="notification" />
          <FaHeart className="icon" />
        </>
      ),
      text: "Notifications",
      onclick: (text) => {
        fold(text);
        setNotificationsCount(0);
        setNotifications([]);
      },
    },
    { icon: <FaPlus className="icon" />, text: "Create", onclick: toggleModal },
    {
      icon: (
        <img
          src={state.profilePicture}
          alt={state.username}
          className="profile-picure-side-menu"
        />
      ),
      text: "Profile",
      link: `/${state.username}/`,
    },
  ];
  return (
    <div className="side-menu-wrapper">
      <div className="side-menu">
        <Link to="/">
          <img src={instagramLogo} alt="Instagram" className="logo" />
        </Link>
        <ul>
          {menuElements.map((el, i) =>
            el.text === active ? (
              <Link to={el.link} className="link-sidemenu" key={i}>
                <li key={i} className="active">
                  {el.icon} {el.text}
                </li>
              </Link>
            ) : (
              <Link to={el.link} className="link-sidemenu" key={i}>
                {el.onclick ? (
                  <li key={i} onClick={() => el.onclick(el.text)}>
                    {el.icon} {el.text}
                  </li>
                ) : (
                  <li key={i}>
                    {el.icon} {el.text}
                  </li>
                )}
              </Link>
            )
          )}
          <li
            key={menuElements.length}
            onClick={() => {
              setCookie("currentUser", "", { path: "/" });
              setCookie("currentUserId", "", { path: "/" });
              localStorage.setItem("currentUser", "");
              localStorage.setItem("currentUserId", "");
              window.location.reload(false);
            }}
          >
            <FaCircleNotch className="icon" />
            Log Out
          </li>
        </ul>
      </div>
      {showModal ? (
        <Modal div="modal">
          <CreatePost toggleModal={toggleModal} showModal={showModal} />
        </Modal>
      ) : null}
      <div className="pullout-elem">{elemToRender}</div>
    </div>
  );
}
