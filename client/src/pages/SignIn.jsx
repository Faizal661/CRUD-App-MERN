import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage,setErrorMessage]=useState(null)
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      setErrorMessage(null)
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        setErrorMessage(data.message)
        return;
      }
    } catch (error) {
      setError(true);
      setLoading(false);
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
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
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
        {error && (errorMessage || "Something went wrong !!!")}
      </p>
    </div>
  );
};

export default SignIn;
