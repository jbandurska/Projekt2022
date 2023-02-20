// Użycie tailwind

import axios from "axios";
import { useState } from "react";
import SuggestedPerson from "../SuggestedPerson/SuggestedPerson";

export default function SearchPannel() {
  const [suggested, setSuggested] = useState([]);

  const handleSearchInput = async (e) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/key/${e.target.value}`
    );
    setSuggested(data.data.users);
  };

  return (
    <div className=" w-full">
      <h3 className="p-6 h-10 text-gray-700 text-left">Search</h3>
      <label htmlFor="search-input" className="relative">
        <input
          id="search-input"
          placeholder="Search"
          className=" w-11/12 mx-auto bg-gray-50 py-2 px-3 border-none rounded-lg focus:outline-none"
          onChange={handleSearchInput}
          onBlur={handleSearchInput}
        />
        <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center">
          <button
            type="button"
            className="rounded-full bg-black/25 border-none text-white text-sm mr-2 flex items-center justify-center h-3 w-3 font-semibold"
            onClick={() => {
              document.getElementById("search-input").value = "";
            }}
          >
            X
          </button>
        </div>
      </label>
      <div className="mt-6 border-solid border border-gray-200 w-full"></div>
      <ul className="p-0">
        {suggested.map((person, i) => (
          <SuggestedPerson person={person} key={i} />
        ))}
      </ul>
    </div>
  );
}
