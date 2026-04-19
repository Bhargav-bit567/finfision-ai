import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Newspaper, TrendingUp, TrendingDown, ExternalLink, Clock } from "lucide-react";

import { articles } from "../utils/newsData";

const News = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="news-page">
        <header className="page-header">
          <div className="header-icon">
            <Newspaper size={48} className="glow-icon" />
          </div>
          <h1>Market Intelligence</h1>
          <p>Real-time news and sentiment analysis for smarter decisions</p>
        </header>

        <div className="news-grid">
          {articles.map((article, i) => (
            <motion.article 
              key={article.id}
              className="news-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="news-meta">
                <span className={`sentiment-badge ${article.sentiment.toLowerCase()}`}>
                  {article.sentiment} Sentiment
                </span>
                <span className="news-time">
                  <Clock size={12} />
                  {article.time}
                </span>
              </div>
              
              <h2 className="news-title">{article.title}</h2>
              <p className="news-summary">{article.summary}</p>
              
              <div className="news-footer">
                <div className="source-info">
                  <strong>{article.source}</strong>
                  <span className={`impact-dot impact-${article.impact.toLowerCase()}`} />
                  <span className="impact-text">{article.impact} Impact</span>
                </div>
                <button 
                  className="read-more"
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  Read Full <ExternalLink size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <section className="sentiment-overview glass-panel">
          <div className="overview-header">
            <h3>Global Sentiment Pulse</h3>
            <div className="pulse-indicator">
              <span className="pulse-bar positive" style={{width: '65%'}} />
              <span className="pulse-bar neutral" style={{width: '20%'}} />
              <span className="pulse-bar negative" style={{width: '15%'}} />
            </div>
          </div>
          <div className="sentiment-labels">
            <span className="label"><TrendingUp size={14} /> 65% Bullish</span>
            <span className="label">20% Neutral</span>
            <span className="label"><TrendingDown size={14} /> 15% Bearish</span>
          </div>
        </section>
      </div>
    </>
  );
};

export default News;
