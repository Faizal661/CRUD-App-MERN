import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        console.log(data);
        return;
      }
      dispatch(signInSuccess(data));
      if (data.isAdmin) {
        return navigate("/admin");
      }
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto mt-5">
      <h1 className="text-3xl font-semibold text-center my-10">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-600 p-3 rounded-lg text-white hover:opacity-90"
        >
          {loading ? "Submitting . . ." : "SIGN IN"}
        </button>
      </form>
      <div className="flex gap-2 mt-4 ">
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign Up Now</span>
        </Link>
      </div>
      <p className="text-red-600 mt-3">
        {error ? error.message || "Something went wrong !!!" : ""}
      </p>
    </div>
  );
};

export default SignIn;
