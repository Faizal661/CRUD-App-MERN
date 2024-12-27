import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const [userList, setUserList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleViewUser = (userId) => {
    return navigate(`/admin/users/${userId}`);
  };

  const filteredUsers = userList?.filter((user) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-5xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 px-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Home Page</h1>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-2 "
            >
             <span className="font-semibold text-lg text-black  hover:text-gray-500">X</span> 
            </button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 text-center">#</th>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Joined Date</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers?.map((user, index) => (
              <tr key={index} className="bg-white hover:bg-gray-200">
                <td className="px-4 py-3 text-center font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span>{user.isAdmin ? "Admin" : "User"}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleViewUser(user._id)}
                    className="border-2 px-3 rounded-lg bg-slate-200 hover:bg-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers?.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-xl">
          No user found ,based on your search.
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;
