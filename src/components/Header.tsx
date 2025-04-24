import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

function Header() {
  return (
    <header
      className="flex bg-black relative h-22 w-full justify-between items-center px-3 sm:px-8 "
      style={{ boxShadow: "0 0 10px 0 rgba(77, 209, 223, .5)" }}
    >
      <Link href="/home" className="flex items-center gap-2">
        <Image
          src="/beast.png"
          height={60}
          width={60}
          alt="logo"
          className="rounded-md"
          priority
        />
        <h1 className="text-4xl font-semibold text-white font-sl">Beast Log</h1>
      </Link>
      <div className="flex gap-4">
        <LogoutButton />
      </div>
    </header>
  );
}

export default Header;
