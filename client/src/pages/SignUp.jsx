import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage,setErrorMessage]=useState(null)
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      setErrorMessage(null)
      const res = await fetch("/api/auth/signup", {
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
      navigate('/sign-in')
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto mt-5">
      <h1 className="text-3xl font-semibold text-center my-10">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
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
          {loading ? "Submitting . . ." : "SIGN UP"}
        </button>
      </form>
      <div className="flex gap-2 mt-4 ">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
      <p className="text-red-600 mt-3">{error && (errorMessage || "Something went wrong !!!")}</p>
    </div>
  );
};

export default SignUp;
