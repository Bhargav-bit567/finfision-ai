import { motion } from "framer-motion";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import HoldingsList from "../components/portfolio/HoldingsList";
import AllocationChart from "../components/portfolio/AllocationChart";
import EmotionPanel from "../components/portfolio/EmotionPanel";
import TradeHistory from "../components/portfolio/TradeHistory";
import AIInsights from "../components/portfolio/AIInsights";

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <header className="portfolio-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="eyebrow">Performance & Behavior</span>
          <h1>My Portfolio</h1>
        </motion.div>
      </header>

      <div className="portfolio-grid">
        <section className="summary-section">
          <PortfolioSummary />
        </section>

        <section className="main-content-section">
           <div className="top-grid">
              <HoldingsList />
              <AllocationChart />
           </div>
           
           <div className="bottom-grid">
              <TradeHistory />
              <AIInsights />
           </div>
        </section>

        <aside className="behavior-rail">
           <EmotionPanel />
        </aside>
      </div>
    </div>
  );
};

export default Portfolio;
