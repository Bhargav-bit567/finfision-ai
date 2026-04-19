import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Pages
import Landing      from "./pages/Landing.jsx";
import Login        from "./pages/Login.jsx";
import Signup       from "./pages/Signup.jsx";
import Dashboard    from "./pages/Dashboard.jsx";
import Portfolio    from "./pages/Portfolio.jsx";
import Insights     from "./pages/Insights.jsx";
import AIAdvisor    from "./pages/AIAdvisor.jsx";
import StockExplorer from "./pages/StockExplorer.jsx";
import Compare      from "./pages/Compare.jsx";
import News         from "./pages/News.jsx";
import NewsDetail   from "./pages/NewsDetail.jsx";
import Trading      from "./pages/Trading.jsx";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute  from "./components/layout/ProtectedRoute.jsx";

// Global overlays
import AICoach from "./components/shared/AICoach.jsx";
import AnimatedMarketBackground from "./components/shared/AnimatedMarketBackground.jsx";

// State
import { useBehaviorStore } from "./store/useBehaviorStore";

gsap.registerPlugin(ScrollTrigger);

// ── Scroll to top on every route change ───────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ── Conditional animated background ─────────────────────────────
// Shows on every route EXCEPT the landing page "/" and the trading terminal "/trade"
function MarketBackgroundLayer() {
  const { pathname } = useLocation();
  const EXCLUDED = ["/", "/trade"];
  if (EXCLUDED.includes(pathname)) return null;
  return <AnimatedMarketBackground />;
}

function AnimatedRoutes() {
  const location = useLocation();

  // Stable key for dashboard routes to prevent layout unmounting and overlapping UI
  const routeKey = location.pathname.startsWith('/dashboard') 
    ? 'dashboard' 
    : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        {/* ── Public ── */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Trading Terminal (standalone, no sidebar) ── */}
        <Route path="/trade" element={<Trading />} />

        {/* ── Protected Dashboard ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"             element={<Dashboard />} />
            <Route path="/dashboard/portfolio"   element={<Portfolio />} />
            <Route path="/dashboard/analysis"    element={<Insights />} />
            <Route path="/dashboard/advisor"     element={<AIAdvisor />} />
            <Route path="/dashboard/explore"     element={<StockExplorer />} />
            <Route path="/dashboard/compare"     element={<Compare />} />
            <Route path="/dashboard/news"        element={<News />} />
            <Route path="/dashboard/news/:id"    element={<NewsDetail />} />
          </Route>
        </Route>

        {/* ── Legacy redirects (old paths → dashboard) ── */}
        <Route path="/portfolio" element={<Navigate to="/dashboard/portfolio" replace />} />
        <Route path="/analysis"  element={<Navigate to="/dashboard/analysis" replace />} />
        <Route path="/advisor"   element={<Navigate to="/dashboard/advisor" replace />} />
        <Route path="/explore"   element={<Navigate to="/dashboard/explore" replace />} />
        <Route path="/compare"   element={<Navigate to="/dashboard/compare" replace />} />
        <Route path="/news"      element={<Navigate to="/dashboard/news" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// ── App root ──────────────────────────────────────────────────────
function App() {
  const lenisRef = useRef(null);
  const updateFearScore = useBehaviorStore((s) => s.updateFearScore);

  // Fear score decay tick
  useEffect(() => {
    const id = setInterval(() => updateFearScore(), 10_000);
    return () => clearInterval(id);
  }, [updateFearScore]);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.85 });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const frame = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MarketBackgroundLayer />
      <AnimatedRoutes />
      <AICoach />
    </BrowserRouter>
  );
}

export default App;
