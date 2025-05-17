import React from "react";
import { Separator } from "./ui/separator";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-gray-950">
      <div>
        <Separator className="bg-gray-700 h-[1px] w-full my-1" />
      </div>
      <div className="flex justify-center items-center ">
        <h4 className="text-white text-md font-sl ">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/Ajay-Krishna00/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Ajay
          </a>
        </h4>
      </div>
      <div className="flex justify-center items-center ">
        <h4 className="text-white text-sm  ">&copy; {date} Beast Log</h4>
      </div>
    </footer>
  );
};

export default Footer;
