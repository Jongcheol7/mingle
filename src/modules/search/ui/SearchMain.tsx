"use client";
import { useState } from "react";
import SearchHeader from "./SearchHeader";
import SearchLists from "./SearchLists";

export default function SearchMain() {
  const [searchOption, setSearchOption] = useState("");
  const [searchInput, setSearchInput] = useState("");

  console.log("searchOption : ", searchOption);
  console.log("searchInput : ", searchInput);

  return (
    <div className="p-2 pt-3 flex-col">
      <SearchHeader
        setSearchOption={setSearchOption}
        setSearchInput={setSearchInput}
      />
      <SearchLists />
    </div>
  );
}
