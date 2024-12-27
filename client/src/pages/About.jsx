import React from "react";
import { useSelector } from "react-redux";

const About = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="px-10 my-24 max-w-xl mx-auto ">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="text-2xl font-semibold mt-8">
        Welcome to about page{" "}
        <span className="font-bold text-3xl text-slate-700 ">
          {currentUser ? currentUser.username : "User"}
        </span>{" "}
      </p>
    </div>
  );
};

export default About;
