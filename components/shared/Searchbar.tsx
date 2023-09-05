"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

interface Props {
  routeType: string;
}


export default function Searchbar({ routeType }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    // to search after 0.2s of no input
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain opacity-80"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${routeType !== "search" ? "Search communities" : "Search users"}`}
        className="searchbar_input no-focus"
      />
    </div>
  );
}