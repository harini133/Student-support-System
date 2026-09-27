import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="app-header">
      <div className="app-logo">
        Student Support System
      </div>

      <nav className="header-menu">
        <button className={isActive("/dashboard") ? "active" : ""} aria-current={isActive("/dashboard") ? "page" : undefined} onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button className={isActive("/tickets") ? "active" : ""} aria-current={isActive("/tickets") ? "page" : undefined} onClick={() => navigate("/tickets")}>
          Tickets
        </button>

        <button className={isActive("/staff") ? "active" : ""} aria-current={isActive("/staff") ? "page" : undefined} onClick={() => navigate("/staff")}>
          Staff
        </button>

        <button className={isActive("/categories") ? "active" : ""} aria-current={isActive("/categories") ? "page" : undefined} onClick={() => navigate("/categories")}>
          Categories
        </button>
      </nav>
    </header>
  );
}

export default Header;
