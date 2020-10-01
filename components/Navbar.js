import logo from "../public/logo.png";
import { useAuthFunctions } from "aws-cognito-next";
import { useAuth } from "../auth";

import ActiveLink from "./ActiveLink";
import HeaderBase, { NavLinks, NavLink, PrimaryLink } from "./headers/light.js";

const Navbar = () => {
  const auth = useAuth(null);
  const { login, logout } = useAuthFunctions();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <style jsx>
        {`
          #logoImage {
            height: 60px;
          }
        `}
      </style>

      <ActiveLink href="#">
        <a className="navbar-brand">
          <img src={logo} alt="logo" id="logoImage" />
        </a>
      </ActiveLink>

      <div className="collapse navbar-collapse" id="navbarColor03">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <ActiveLink href="/" activeClassName="active">
              <a className="nav-link">
                Home <span className="sr-only">(current)</span>
              </a>
            </ActiveLink>
          </li>
          <li className="nav-item">
            <ActiveLink href="/about" activeClassName="active">
              <a className="nav-link">About</a>
            </ActiveLink>
          </li>
          <li className="nav-item">
            <ActiveLink href="/cards" activeClassName="active">
              <a className="nav-link">Cards</a>
            </ActiveLink>
          </li>
          {!auth ? (
            <li className="nav-item">
              <button onClick={login} className="btn btn-link nav-link">
                Log in
              </button>
            </li>
          ) : null}

          {auth ? (
            <li className="nav-item">
              <button onClick={logout} className="btn btn-link nav-link">
                Log out
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
