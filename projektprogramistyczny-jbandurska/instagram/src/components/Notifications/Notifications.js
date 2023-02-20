import axios from "axios";
import { useEffect, useState } from "react";
import { useMQTT } from "../MQTTProvider";
import Notification from "../Notification/Notification";
import "./Notifications.css";

export default function Notifications() {
  const id = localStorage.getItem("currentUserId");
  const { notifications } = useMQTT();
  const [oldNotifications, setOldNotifications] = useState([]);

  useEffect(() => {
    const getOldNotifications = async () => {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/feed/${id}`
      );
      setOldNotifications(data.data.feed);
    };
    getOldNotifications();
  }, [id]);

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {oldNotifications.map((n, i) => (
          <li key={-i}>
            <Notification payload={n} />
          </li>
        ))}
        {notifications.map((n, i) => (
          <li key={i}>
            <Notification payload={n} />
          </li>
        ))}
      </ul>
    </div>
  );
}
