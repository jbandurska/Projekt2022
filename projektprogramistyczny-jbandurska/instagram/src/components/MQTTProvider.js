import axios from "axios";
import { Client, Message } from "paho-mqtt";
import { useEffect, useState, useContext, createContext } from "react";

const MQTTContext = createContext(false);
export const useMQTT = () => useContext(MQTTContext);

export default function MQTTProvider({ children }) {
  const [client, setClient] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [isNewPost, setIsNewPost] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const id = localStorage.getItem("currentUserId");

  useEffect(() => {
    const newClient = new Client("test.mosquitto.org", 8080, `${id}`);

    // Set callback handlers
    newClient.onConnectionLost = onConnectionLost;
    newClient.onMessageArrived = onMessageArrived;

    newClient.connect({
      onSuccess: onConnect,
      onFailure: onConnectError,
    });

    // Callback function for when the client connects
    function onConnect() {
      newClient.subscribe(`/user/${id}`);
    }

    // Callback function for when the client fails to connect
    function onConnectError(error) {
      console.log("Failed to connect to broker: " + error.errorMessage);
    }

    // Callback function for when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("Connection lost: " + responseObject.errorMessage);
      }
    }

    // Callback function for when a message arrives
    function onMessageArrived(message) {
      const msgJSON = JSON.parse(message.payloadString);
      if (msgJSON.message === "chat") {
        setMessagesCount((prev) => prev + 1);
      } else if (msgJSON.message === "new post") {
        setIsNewPost(true);
      } else {
        setNotifications((prev) => [...prev, message.payloadString]);
        setNotificationsCount((prev) => prev + 1);
      }
    }

    setClient(newClient);

    return () => {
      if (newClient) {
        newClient.disconnect();
      }
    };

    // eslint-disable-next-line
  }, []);

  const publishMsg = async (msg, userId) => {
    if (client) {
      const message = new Message(msg);
      message.destinationName = `/user/${userId}`;
      client.send(message);
    }

    const msgJSON = JSON.parse(msg);

    if (!["chat", "new post"].includes(msgJSON.message)) {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/feed/${userId}`,
        msgJSON
      );
    }
  };

  return (
    <MQTTContext.Provider
      value={{
        publishMsg,
        notifications,
        setNotifications,
        notificationsCount,
        setNotificationsCount,
        messagesCount,
        setMessagesCount,
        isNewPost,
        setIsNewPost,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
}
