import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-logo">
        Student Support System
      </div>

      <nav className="header-menu">
        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/tickets")}>
          Tickets
        </button>

        <button onClick={() => navigate("/staff")}>
          Staff
        </button>

        <button onClick={() => navigate("/categories")}>
          Categories
        </button>
      </nav>
    </header>
  );
}

export default Header;