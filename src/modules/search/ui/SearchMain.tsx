"use client";
import { useState } from "react";
import SearchHeader from "./SearchHeader";
import SearchLists from "./SearchLists";
import { usePostLists } from "@/hooks/usePostLists";

export default function SearchMain() {
  const [searchOption, setSearchOption] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data } = usePostLists(searchOption, searchInput);

  console.log("리엑트쿼리로 부터 가져온 데이터는 : ", data);

  return (
    <div className="p-2 pt-3 flex-col">
      <SearchHeader
        setSearchOption={setSearchOption}
        setSearchInput={setSearchInput}
      />
      {data && <SearchLists posts={data} />}
    </div>
  );
}
