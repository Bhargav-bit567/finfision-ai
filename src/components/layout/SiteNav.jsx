import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const SiteNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleBrandClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="site-nav">
      <button
        className="brand-mark"
        type="button"
        onClick={handleBrandClick}
      >
        <span>F</span> Finfision
      </button>

      <nav aria-label="Main navigation">
        <a 
          href="/#features" 
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Features
        </a>
        <a 
          href="/#why"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              document.getElementById("why")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Why Finfision
        </a>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <button
            className="nav-cta magnetic"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-login-link">Sign in</Link>
            <button
              className="nav-cta magnetic"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default SiteNav;
