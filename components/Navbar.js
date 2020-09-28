import logo from "../public/logo.png";
import { useAuthFunctions } from "aws-cognito-next";
import { useAuth } from "../auth";
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
      <a className="navbar-brand" href="#">
        <img src={logo} alt="logo" id="logoImage" />
      </a>
      <div className="collapse navbar-collapse" id="navbarColor03">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">
              About
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/cards">
              Cards
            </a>
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
