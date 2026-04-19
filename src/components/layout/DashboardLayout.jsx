import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardSidebar from "./DashboardSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { Bell, Search, Settings, X } from "lucide-react";

// ─── Breadcrumb map ───────────────────────────────────────────────
const ROUTE_LABELS = {
  "/dashboard": "Overview",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/analysis": "Analysis",
  "/dashboard/advisor": "AI Advisor",
  "/dashboard/explore": "Market Explore",
  "/dashboard/compare": "Compare",
  "/dashboard/news": "News",
};

/**
 * DashboardLayout — the persistent shell for all /dashboard/* routes.
 * Renders the sidebar + a topbar + a content area fed by nested <Outlet />.
 */
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // mock unread count

  const currentLabel = ROUTE_LABELS[location.pathname] ?? "Dashboard";

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Navigate to explore with the query pre-filled (URL param)
    navigate(`/dashboard/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="dashboard-shell">
      {/* Animated background orbs */}
      <div className="dash-bg-layers">
        <div className="dash-bg-orb dash-bg-orb-1" />
        <div className="dash-bg-orb dash-bg-orb-2" />
      </div>

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="dashboard-content">
        {/* ── Top Header Bar ── */}
        <header className="dash-topbar">
          {/* Breadcrumb */}
          <div className="dash-topbar-bread">
            <span className="dash-bread-root">Finfision</span>
            <span className="dash-bread-sep">/</span>
            <span className="dash-bread-current">{currentLabel}</span>
          </div>

          {/* Search + Actions */}
          <div className="dash-topbar-actions">
            {/* Search bar */}
            {searchOpen ? (
              <motion.form
                className="dash-search-form"
                onSubmit={handleSearch}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Search size={14} className="dash-search-icon" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search stocks…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
                <button
                  type="button"
                  className="dash-search-close"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                >
                  <X size={14} />
                </button>
              </motion.form>
            ) : (
              <button
                className="dash-topbar-icon-btn"
                onClick={() => setSearchOpen(true)}
                title="Search stocks"
              >
                <Search size={18} />
              </button>
            )}

            {/* Notifications */}
            <button className="dash-topbar-icon-btn dash-notif-btn" title="Notifications">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="dash-notif-badge">{notifications}</span>
              )}
            </button>

            {/* Settings */}
            <button
              className="dash-topbar-icon-btn"
              title="Settings"
              onClick={() => {/* future settings page */}}
            >
              <Settings size={18} />
            </button>

            {/* User avatar */}
            <div className="dash-topbar-avatar" title={user?.email}>
              {user?.avatar ?? "U"}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <motion.div
          key={location.pathname}
          className="dashboard-page-wrapper"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
