import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React from "react";

const Back = (props: { className: string }) => {
  const linkStyles =
    "inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";

  return (
    <div className={props.className}>
      <Link href="https://vadoapp.com/" className={linkStyles}>
        <ChevronLeftIcon />
        Back to VADO Homepage
      </Link>
    </div>
  );
};

export default Back;
