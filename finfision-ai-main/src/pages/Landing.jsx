import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useSpring } from "framer-motion";
import HeroDashboard from "../components/landing/HeroDashboard.jsx";
import Hero3D from "../components/landing/Hero3D.jsx";
import Features from "../components/landing/Features.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import DashboardPreview from "../components/landing/DashboardPreview.jsx";
import WhyFinfision from "../components/landing/WhyFinfision.jsx";
import CallToAction from "../components/landing/CallToAction.jsx";
import Footer from "../components/landing/Footer.jsx";
import SiteNav from "../components/layout/SiteNav.jsx";

import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  
  // Custom global scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance timeline ──────────────────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".site-nav", { y: -32, opacity: 0, duration: 0.7 })
        .from(".eyebrow", { y: 20, opacity: 0, duration: 0.65 }, "-=0.35")
        .from(".hero-copy h1", { y: 52, opacity: 0, duration: 0.9, skewY: 2 }, "-=0.4")
        .from(".hero-copy > p", { y: 24, opacity: 0, duration: 0.65, stagger: 0.1 }, "-=0.45")
        .from(".hero-email-cta", { scale: 0.95, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(".social-proof-row", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-visual", { x: 40, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8");

      // ── Ribbon parallax ─────────────────────────────────────────────
      gsap.to(".ribbon-depth", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // ── Hero Visual Parallax (New) ──────────────────────────────────
      gsap.to(".hero-visual", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── Dashboard preview glow pulse ────────────────────────────────
      gsap.from(".dashboard-preview", {
        opacity: 0,
        y: 48,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".dashboard-preview", start: "top 82%" },
      });

      // ── Stock ticker animation ──────────────────────────────────────
      gsap.to(".ticker-item", {
        y: -2,
        duration: 1.5,
        stagger: 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".mini-sparkline polyline", {
        strokeDashoffset: -100,
        duration: 3,
        ease: "none",
        repeat: -1,
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "instant" }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return (
    <div className="landing-page" ref={rootRef}>
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      <SiteNav />

      <div className="hero-background">
        <Hero3D />
      </div>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Practice account • Fear-aware coaching</p>
          <h1>Fear is costing you more than the market ever will</h1>
          <p>
            Experience a financial mastery with Finfision's innovative AI-led solutions.
            Streamline your financial operations, gain real-time insights, and boost confidence effortlessly.
          </p>

          <div className="hero-email-cta">
            <input type="email" placeholder="active@strategyworkshop.com" />
            <button
              className="primary-button magnetic"
              type="button"
              onClick={() => navigate("/login")}
            >
              Get started for free
            </button>
          </div>

          <div className="social-proof-row">
            <div className="stock-ticker-mini">
              <div className="ticker-item positive">
                <span className="ticker-symbol">NIFTY</span>
                <span className="ticker-price">24,315</span>
                <span className="ticker-change">+0.8%</span>
              </div>
              <div className="ticker-item positive">
                <span className="ticker-symbol">SENSEX</span>
                <span className="ticker-price">80,428</span>
                <span className="ticker-change">+1.2%</span>
              </div>
              <div className="ticker-item negative">
                <span className="ticker-symbol">BANK</span>
                <span className="ticker-price">52,145</span>
                <span className="ticker-change">-0.3%</span>
              </div>
              <div className="mini-sparkline">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                  <polyline
                    points="0,25 10,22 20,18 30,20 40,15 50,12 60,14 70,10 80,8 90,11 100,7"
                    fill="none"
                    stroke="url(#sparkGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <defs>
                    <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="social-proof-text">
              <strong>Live market data</strong> • Practice with real-time prices
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <HeroDashboard />
        </div>
      </section>

      <div className="section-divider" />
      <Features />
      
      <div className="section-divider" />
      <HowItWorks />
      
      <div className="section-divider" />
      <DashboardPreview onOpenTrading={() => navigate("/trade")} />
      
      <WhyFinfision />
      
      <div className="section-divider" />
      <CallToAction />

      <Footer onOpenTrading={() => navigate("/trade")} />
    </div>
  );
}

export default Landing;
