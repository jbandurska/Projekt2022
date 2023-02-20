import { Link } from "react-router-dom";
import { useEffect } from "react";
import SingleChat from "../SingleChat/SingleChat";

export default function Chats({ getChats, chats }) {
  useEffect(() => {
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isolateTheOtherUsersId = (roomId) => {
    const [user1, user2] = roomId.split(":");
    return user1 === localStorage.getItem("currentUserId") ? user2 : user1;
  };

  return (
    <div className="chats">
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link to={`/direct/inbox/${chat.id}`}>
              <SingleChat userId={isolateTheOtherUsersId(chat.id)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
