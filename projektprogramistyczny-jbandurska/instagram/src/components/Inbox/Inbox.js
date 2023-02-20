import "./Inbox.css";
import SideMenu from "../SideMenu/SideMenu";
import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import PictureProfileHeader from "../PictureProfileHeader/PictureProfileHeader";
import axios from "axios";
import MessagesHistory from "../MessagesHistory/MessagesHistory";
import Chats from "../Chats/Chats";
import { useMQTT } from "../MQTTProvider";
import { debounce } from "lodash";

export default function Inbox() {
  const { pathname } = useLocation();
  const { roomId } = useParams();
  const [user1, user2] = roomId.split(":");
  const [msg, setMsg] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [dots, setDots] = useState(false);
  const [chats, setChats] = useState([]);
  const { publishMsg, setMessagesCount } = useMQTT();

  const publishIsTyping = () => {
    if (socket) {
      socket.emit("dots", isTyping);
    }
  };

  const funcToDebounce = () => setIsTyping(false);

  const handleTyping = useMemo(
    () =>
      debounce(funcToDebounce, 1500, {
        leading: false,
        trailing: true,
      }),
    []
  );

  const handleBlur = (e) => setMsg(e.target.value);
  const handleChange = (e) => {
    setMsg(e.target.value);
    handleTyping();
    setIsTyping(true);
  };

  // eslint-disable-next-line
  useEffect(publishIsTyping, [isTyping]);

  const publishGotMessage = () => {
    publishMsg(
      JSON.stringify({
        message: "chat",
      }),
      user1 === localStorage.getItem("currentUserId") ? user2 : user1
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(msg);
    saveMessageInHistory({
      chatId: roomId,
      userId: localStorage.getItem("currentUserId"),
      content: msg,
    });
    setMsg("");
    publishGotMessage();
  };

  const getChats = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/chats/all/${localStorage.getItem(
        "currentUserId"
      )}`
    );
    setChats(data.data.chats || []);
  };

  const saveMessageInHistory = async (msg) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/chats/`, msg);
    getChats();
  };

  useEffect(() => {
    setCurrentMessages([]);
    setMessagesCount(0);
    setDots(false);
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    const ws = io(`${process.env.REACT_APP_API_URL}`);
    setSocket(ws);

    ws.on("connect", () => {
      if (roomId !== ":") ws.emit("joinRoom", roomId);
    });

    ws.on("message", (message) => {
      const msgDiv = { class: "message", content: message };
      setCurrentMessages((prevMessages) => [...prevMessages, msgDiv]);
    });

    ws.on("dots", (dots) => {
      setDots(dots);
    });

    return () => {
      ws.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const messagesDiv = document.querySelector(".messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, [currentMessages, dots]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("message", message);

      const msgDiv = { class: "message right", content: message };
      setCurrentMessages((prevMessages) => [...prevMessages, msgDiv]);
    }
  };

  return (
    <div className="home">
      <SideMenu active="Messages" />
      <div className="home-main inbox-main">
        <div className="inbox">
          <Chats chats={chats} getChats={getChats} />
          <div className="conversation">
            <div className="header">
              {user1 && user2 ? (
                <PictureProfileHeader
                  userId={
                    user1 === localStorage.getItem("currentUserId")
                      ? user2
                      : user1
                  }
                />
              ) : (
                <>
                  <span className="picture-header">
                    Choose a chat or visit someone's profile to send them a
                    message!
                  </span>
                </>
              )}
            </div>
            <div className="messages">
              <MessagesHistory roomId={roomId} />
              {currentMessages.map((msg, i) => (
                <div key={-i} className={msg.class}>
                  {msg.content}
                </div>
              ))}
            </div>
            {dots ? <div className="dots message">...</div> : null}
            {user1 && user2 ? (
              <form className="input" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Message..."
                  value={msg}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
