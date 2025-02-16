import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetailView = () => {
  const { id } = useParams();
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(undefined);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        profilePicture: data.profilePicture || "",
      });
    } catch (error) {
      setError("Error fetching user details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (image) => {
    setImageUploading(true);
    setImageError(false);
    setImageUploadSuccess(false);
    const preset_key = import.meta.env.VITE_PRESET_KEY;
    const cloud_name = import.meta.env.VITE_CLOUD_NAME;

    const formImageUpload = new FormData();
    formImageUpload.append("file", image);
    formImageUpload.append("upload_preset", preset_key);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formImageUpload
      )
      .then((res) => {
        setFormData({ ...formData, profilePicture: res.data.secure_url });
        setImageUploading(false);
        setImageUploadSuccess(true);
      })
      .catch((err) => {
        setImageUploading(false);
        setImageError(true);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/user/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }

      setUpdateSuccess(true);
      setUser(data);
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      text: "Are you really want to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete this account",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/user/delete/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();

          if (data.success === false) {
            setError(data.message);
            Swal.fire({
              title: "Something went wrong",
              icon: "error",
            });
            return;
          }
          Swal.fire({
            icon: "success",
            text: "Account Deleted Successfully",
            showConfirmButton: false,
            timer: 1000,
          });

          navigate("/admin");
        } catch (error) {
          setError("Error deleting user");
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-5xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">User Details</h1>
      <input
        type="file"
        ref={profileRef}
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="self-center">
          <img
            src={formData.profilePicture || user?.profilePicture}
            alt="profile picture"
            className="w-32 h-32 border-2 shadow-xl rounded-full object-cover"
          />
          <span
            className="fas fa-edit float-end relative bottom-8 cursor-pointer"
            onClick={() => profileRef.current.click()}
          ></span>
        </div>
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : imageUploading ? (
            <span className="text-green-700">Updating Image....</span>
          ) : imageUploadSuccess ? (
            <span className="text-green-500">Image changed successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={user?.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          defaultValue={user?.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-90"
          disabled={updating}
        >
          {updating ? "Updating..." : "UPDATE"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button
          onClick={handleDelete}
          className="text-red-700 hover:underline"
          disabled={loading}
        >
          Delete User
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="text-blue-700 hover:underline"
        >
          Back to Home
        </button>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 mt-5">User updated successfully!</p>
      )}
    </div>
  );
};

export default UserDetailView;
