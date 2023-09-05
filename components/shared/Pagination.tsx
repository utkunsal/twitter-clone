"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";


interface Props {
  pageNumber: number,
  hasNext: boolean,
  path: string,
}

export default function Pagination({ pageNumber, hasNext, path }: Props) {
  const router = useRouter();

  if (!hasNext && pageNumber === 1) return null;

  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;
    if (type === "prev")
      nextPageNumber = Math.max(1, pageNumber-1);
    else if (type === "next")
      nextPageNumber = pageNumber+1;
    
    nextPageNumber > 1 ? router.push(`/${path}?page=${nextPageNumber}`) : router.push(`/${path}`);
  };

  return (
    <div className='pagination'>
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className='!text-small-regular text-light-2'
      >
        Prev
      </Button>
      <p className='text-small-semibold text-light-1'>
        {pageNumber}
      </p>
      <Button
        onClick={() => handleNavigation("next")}
        disabled={!hasNext}
        className='!text-small-regular text-light-2'
      >
        Next
      </Button>
    </div>
  );
}