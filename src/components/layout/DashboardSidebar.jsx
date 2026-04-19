import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Compass,
  Repeat,
  Newspaper,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

const navItems = [
  { path: "/dashboard",           label: "Overview",         icon: LayoutDashboard, end: true },
  { path: "/dashboard/portfolio", label: "Portfolio",        icon: Wallet },
  { path: "/dashboard/analysis",  label: "Analysis",         icon: BarChart3 },
  { path: "/dashboard/advisor",   label: "AI Advisor",       icon: Brain },
  { path: "/dashboard/explore",   label: "Market Explore",   icon: Compass },
  { path: "/dashboard/compare",   label: "Compare Assets",   icon: Repeat },
  { path: "/dashboard/news",      label: "Financial News",   icon: Newspaper },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.aside
      className="dash-sidebar"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Brand */}
      <div className="dash-sidebar-brand">
        <div className="dash-brand-icon">
          <TrendingUp size={18} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="dash-brand-name"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              Finfision
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          className="dash-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Section label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            className="dash-nav-section-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Navigation
          </motion.span>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="dash-sidebar-nav">
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <motion.div
            key={path}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <NavLink
              to={path}
              end={end}
              className={({ isActive }) =>
                `dash-nav-link${isActive ? " active" : ""}`
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <span className="dash-nav-icon">
                    <Icon size={20} />
                  </span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="dash-nav-label"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="dash-active-pill"
                      className="dash-active-pill"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Trade CTA */}
      <div className="dash-sidebar-footer">
        <button
          className="dash-trade-btn"
          onClick={() => navigate("/trade")}
          title={collapsed ? "Launch Terminal" : undefined}
        >
          <TrendingUp size={18} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Launch Terminal
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Profile */}
        <div className="dash-user-row" title={collapsed ? user?.email : undefined}>
          <div className="dash-user-avatar">{user?.avatar ?? "U"}</div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="dash-user-info"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
              >
                <span className="dash-user-name">{user?.name ?? "User"}</span>
                <span className="dash-user-email">{user?.email}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="dash-logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
