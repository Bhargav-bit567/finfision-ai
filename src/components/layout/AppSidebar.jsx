import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Brain, 
  LayoutDashboard, 
  Compass, 
  Repeat, 
  Newspaper,
  TrendingUp,
  Settings,
  HelpCircle
} from "lucide-react";

const navItems = [
  { path: "/portfolio", label: "Portfolio", icon: <LayoutDashboard size={20} /> },
  { path: "/analysis", label: "Behavioral Analysis", icon: <BarChart3 size={20} /> },
  { path: "/advisor", label: "AI Advisor", icon: <Brain size={20} /> },
  { path: "/explore", label: "Market Explore", icon: <Compass size={20} /> },
  { path: "/compare", label: "Compare Assets", icon: <Repeat size={20} /> },
  { path: "/news", label: "Financial News", icon: <Newspaper size={20} /> },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand-mark">
          <span>F</span> Finfision
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link 
                key={item.path} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="link-icon">{item.icon}</span>
                <span className="link-label">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="active-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/trade" className="sidebar-cta">
          <TrendingUp size={18} />
          <span>Launch Terminal</span>
        </Link>
        
        <div className="sidebar-utils">
          <button className="util-btn" title="Settings"><Settings size={18} /></button>
          <button className="util-btn" title="Help"><HelpCircle size={18} /></button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
