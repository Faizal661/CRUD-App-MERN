import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-slate-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        {currentUser?.isAdmin ? (
          <>
            <Link to="/admin">
              <h1 className="font-bold text-lg">MERN CRUD APP admin</h1>
            </Link>
            <ul className="flex gap-7 font-semibold">
              <Link to="/admin">
                <li>Home</li>
              </Link>
              <Link to="/about">
                <li>About</li>
              </Link>
              <Link to="/profile">
                {currentUser ? (
                  <img
                    src={currentUser?.profilePicture}
                    alt="profile image"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <li>Sign In</li>
                )}
              </Link>
            </ul>
          </>
        ) : (
          <>
            <Link to="/">
              <h1 className="font-bold text-lg">MERN CRUD APP</h1>
            </Link>
            <ul className="flex gap-7 font-semibold">
              <Link to="/">
                <li>Home</li>
              </Link>
              <Link to="/about">
                <li>About</li>
              </Link>
              <Link to="/profile">
                {currentUser ? (
                  <img
                    src={currentUser?.profilePicture}
                    alt="profile image"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <li>Sign In</li>
                )}
              </Link>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
