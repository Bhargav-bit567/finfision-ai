import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";

import { articles } from "../utils/newsData";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <>
        <div className="error-container">
          <h2>Article not found</h2>
          <button onClick={() => navigate("/news")} className="back-btn">
            <ArrowLeft size={18} /> Back to News
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div 
        className="news-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <nav className="detail-nav">
          <button onClick={() => navigate("/news")} className="back-btn">
            <ArrowLeft size={18} /> Back to News
          </button>
          <div className="nav-actions">
            <button className="icon-btn"><Bookmark size={18} /></button>
            <button className="icon-btn"><Share2 size={18} /></button>
          </div>
        </nav>

        <header className="detail-header">
           <div className="meta-row">
              <span className={`sentiment-badge ${article.sentiment.toLowerCase()}`}>
                {article.sentiment} Sentiment
              </span>
              <span className="source-tag">{article.source}</span>
              <span className="time-tag">
                <Clock size={14} /> {article.time}
              </span>
           </div>
           <h1>{article.title}</h1>
        </header>

        <div className="detail-hero glass-panel">
            {/* Visual element representing the article impact */}
            <div className={`impact-banner impact-${article.impact.toLowerCase()}`}>
               {article.impact} Impact Event Detected
            </div>
        </div>

        <section className="detail-content glass-panel">
           <div className="content-body">
              {article.fullContent.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
           </div>
           
           <footer className="detail-footer">
              <p>Disclaimer: Market news is provided for informational purposes only and does not constitute financial advice. Behavioral patterns are simulated.</p>
           </footer>
        </section>
      </motion.div>
    </>
  );
};

export default NewsDetail;
