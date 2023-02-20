import axios from "axios";
import { useProfile } from "../ProfileProvider/ProfileProvider";
import SideMenu from "../SideMenu/SideMenu";
import SingleChat from "../SingleChat/SingleChat";
import "./PendingFollowRequests.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "../accountReducer.ts";

export default function PendingFollowRequests() {
  const { getAccountData } = useProfile();
  const state = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const currentUserId = localStorage.getItem("currentUserId");

  const followUser = async (userId) => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/follow/${currentUserId}`,
      {
        userId,
      }
    );
  };

  const deleteFromRequestsList = async (userId) => {
    const data = await axios.delete(
      `${process.env.REACT_APP_API_URL}/follow/request/${currentUserId}`,
      {
        params: { userId },
      }
    );
    dispatch(updateAccount(data.data));
  };

  useEffect(() => {
    getAccountData();
  }, [getAccountData]);

  return (
    <div className="wrapper">
      <div className="home">
        <SideMenu />
        <div className="profile-main profile-main-margin">
          <div className="pending-follow-requests">
            {state.requests && state.requests.length ? (
              <ul>
                {state.requests.map((req, i) => (
                  <li key={i}>
                    <SingleChat userId={req} />
                    <div>
                      <button
                        className="button vivid"
                        onClick={() => {
                          followUser(req);
                          deleteFromRequestsList(req);
                        }}
                      >
                        accept
                      </button>
                      <button
                        className="button"
                        onClick={() => deleteFromRequestsList(req)}
                      >
                        reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no follow requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
