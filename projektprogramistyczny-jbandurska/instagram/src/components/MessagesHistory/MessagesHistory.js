import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function MessagesHistory({ roomId }) {
  const [messages, setMessages] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const getMessagesHistory = async () => {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/chats/${roomId}`
      );

      setMessages(data.data.messagesHistory || []);
    };
    getMessagesHistory();
  }, [pathname, roomId]);

  useEffect(() => {
    const messagesDiv = document.querySelector(".messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, [messages]);

  return (
    <>
      {messages.map((msg, i) =>
        msg.userId === localStorage.getItem("currentUserId") ? (
          <div key={i} className="message right">
            {msg.content}
          </div>
        ) : (
          <div key={i} className="message">
            {msg.content}
          </div>
        )
      )}
    </>
  );
}
