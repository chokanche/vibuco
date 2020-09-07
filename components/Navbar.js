import logo from '../public/logo.png';

const Navbar = () => (
<nav className="navbar navbar-expand-lg navbar-light bg-light">
<style jsx>{`
            #logoImage {
                height: 60px;
            }
            `}
  </style>
  <a className="navbar-brand" href="#">
    <img src={logo} alt='logo' id='logoImage'/>
  </a>
  <div className="collapse navbar-collapse" id="navbarColor03">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/about">About</a>
      </li>

      <li className="nav-item">
        <a className="nav-link" href="/login">Login</a>
      </li>
    </ul>
  </div>
</nav>
);
export default Navbar;