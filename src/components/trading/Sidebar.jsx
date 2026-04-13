import { NavLink } from "react-router-dom";
import { LayoutDashboard, TrendingUp, BarChart3, BrainCircuit, Home, ChevronLeft } from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Trades" },
  { path: "/dashboard/explore", icon: TrendingUp, label: "Market" },
  { path: "/dashboard/analysis", icon: BarChart3, label: "Analysis" },
  { path: "/dashboard/advisor", icon: BrainCircuit, label: "Advisor" },
];

function Sidebar({ onBack }) {
  return (
    <aside className="trading-sidebar">
      <button className="brand-mark" type="button" onClick={onBack}>
        <ChevronLeft size={20} />
      </button>
      
      <nav aria-label="Trading navigation">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink 
            key={path} 
            to={path} 
            className={({ isActive }) => (isActive ? "active" : "")}
            title={label}
          >
            <Icon size={20} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-home" type="button" onClick={onBack}>
        <Home size={20} />
        <span className="nav-label">Home</span>
      </button>
    </aside>
  );
}

export default Sidebar;

