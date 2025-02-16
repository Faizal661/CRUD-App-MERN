import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const profileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setupdateSuccess(false);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAccountDelete = async () => {
    Swal.fire({
      text: "Are you really want to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete my account",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            dispatch(deleteUserFailure(data));
            Swal.fire({
              title: "Something went wrong",
              icon: "error",
            });
            return;
          }
          dispatch(deleteUserSuccess(data));
          Swal.fire({
            icon: "success",
            text:"Account Deleted Successfully",
            showConfirmButton: false,
            timer:1000
          });
        } catch (error) {
          dispatch(deleteUserFailure(error));
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
          });
        }
      }
    });
   
  };

  const handleSignOut = async () => {
    Swal.fire({
      text: "Are you really want to logout ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch("/api/auth/signout");
          dispatch(signOut());
          Swal.fire({
            icon: "success",
            showConfirmButton: false,
            timer:1000
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">Profile</h1>
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
            src={formData.profilePicture || currentUser.profilePicture}
            alt="profile picute"
            className="w-32 h-32 border-2 shadow-xl rounded-full object-cover"
          />
          <span
            className="fas fa-edit float-end relative bottom-8  cursor-pointer"
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
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg mt-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
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
        <button className="bg-slate-800 p-3 rounded-lg text-white hover:opacity-90">
          {loading ? "Updating . . ." : "UPDATE"}
        </button>
      </form>
      <div className="flex justify-between  px-1 mt-3">
        <span
          onClick={handleAccountDelete}
          className="text-red-500 cursor-pointer"
        >
          Delete Account?
        </span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-600 mt-3">
        {error && (error.message || "Something went wrong !!!")}
      </p>
      <p className="text-green-500 mt-3">
        {updateSuccess && "Updated successfully."}
      </p>
    </div>
  );
};

export default Profile;
