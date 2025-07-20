"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useRef } from "react";

type Props = {
  setSearchOption: (value: string) => void;
  setSearchInput: (value: string) => void;
};

export default function SearchHeader({
  setSearchOption,
  setSearchInput,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = inputRef.current?.value.trim();
    if (keyword) {
      setSearchInput(keyword);
    }
  };

  return (
    <form className="flex gap-1 mb-3" onSubmit={handleSubmit}>
      <Select onValueChange={(value) => setSearchOption(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="content">내용</SelectItem>
          <SelectItem value="tag">태그</SelectItem>
          <SelectItem value="user">사용자</SelectItem>
        </SelectContent>
      </Select>
      <Input ref={inputRef} placeholder="검색어를 입력하세요" />
      <Button type="submit" variant={"custom"}>
        검색
      </Button>
    </form>
  );
}
