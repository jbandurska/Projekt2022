import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { updateAccount } from "../accountReducer.ts";
import { useDispatch } from "react-redux";

const ProfileContext = createContext(false);
export const useProfile = () => useContext(ProfileContext);

export default function ProfileProvider({ children }) {
  const dispatch = useDispatch();

  const getAccountData = useMemo(() => {
    return async (username = localStorage.getItem("currentUser")) => {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${username}`
      );

      dispatch(updateAccount(data.data));
    };
  }, [dispatch]);

  return (
    <ProfileContext.Provider
      value={{
        getAccountData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
