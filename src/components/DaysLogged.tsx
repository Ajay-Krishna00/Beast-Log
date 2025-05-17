import React, { useEffect, useState } from "react";

function DaysLogged() {
  const [DLogged, setDLogged] = useState(0);
  useEffect(() => {
    const fetchDaysLogged = async () => {
      const res = await fetch("/api/days-logged");
      const data = await res.json();
      setDLogged(data.daysLogged);
    };
    fetchDaysLogged();
  }, []);
  return (
    <div className="flex flex-start">
      <div className="flex px-10 ">
        <h2 className="text-2xl font-semibold text-white font-sl">
          Total Days Logged :{" "}
        </h2>
        <span className="text-2xl font-semibold text-white pl-5">
          {DLogged}
        </span>
      </div>
    </div>
  );
}

export default DaysLogged;
