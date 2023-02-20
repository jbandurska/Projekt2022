import { useMQTT } from "../MQTTProvider";
import "./NotificationCircle.css";

export default function NotificationCircle({ type }) {
  const { notificationsCount, messagesCount } = useMQTT();
  if (type === "notification") {
    return notificationsCount ? (
      <div className="notification-circle">{notificationsCount}</div>
    ) : null;
  } else {
    return messagesCount ? (
      <div className="notification-circle">{messagesCount}</div>
    ) : null;
  }
}
