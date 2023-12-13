import { BsCart3, BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/user/userSlice";
import Avatar from "./Avatar";

const Navbar = () => {
  const dispatch = useDispatch();
  const numItemsInCart = useSelector((state) => state.userState.cartCount);
  const [a, seta] = useState(numItemsInCart);

  // useEffect(() => {
  //   seta(numItemsInCart);
  // }, [numItemsInCart]);
  const [theme, setTheme] = useState(
    useSelector((state) => state.userState.theme)
  );
  const avatar = useSelector((state) => state.userState.avatar);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  //const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);
  return (
    <nav className="bg-base-200">
      <div className="navbar align-element">
        <div className="navbar-start">
          <NavLink
            to="/"
            className="hidden lg:flex btn btn-primary text-3xl items-center"
          >
            C
          </NavLink>
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <FaBarsStaggered className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content p-2 z-[1] shadow bg-base-100 rounded-box w-52"
            >
              <NavLinks />
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            <NavLinks />
          </ul>
        </div>
        <div className="navbar-end">
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleTheme} />
            {/* sun Icon */}
            <BsSunFill
              className={`${
                theme === "dracula" ? "swap-off" : "swap-on"
              } h-4 w-4`}
            />
            {/* Moon Icon */}
            <BsMoonFill
              className={`${
                theme === "dracula" ? "swap-on" : "swap-off"
              } h-4 w-4`}
            />
          </label>
          <NavLink to="/cart" className="btn btn-ghost btn-circle btn-md ml-4">
            <div className="indicator">
              <BsCart3 className="h-6 w-6" />
              <span className="badge badge-sm badge-primary indicator-item">
                {numItemsInCart}
              </span>
            </div>
          </NavLink>
          <Avatar image={avatar} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
