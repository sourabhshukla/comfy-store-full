import { useSelector } from "react-redux";
import defaultAvatar from "/public/defaultAvatar.png";
import { Link } from "react-router-dom";

const Avatar = ({ image = defaultAvatar }) => {
  const user = useSelector((state) => state.userState.user);
  return (
    <div className="avatar ml-4 cursor-pointer dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} className="avatar btn btn-circle m-1">
        <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={image || defaultAvatar} />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
      >
        {user ? (
          <>
            <li>
              <Link to="/me/update">Update Profile</Link>
            </li>
            <li>
              <Link to="update/password">Change Password</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Create Account</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Avatar;
