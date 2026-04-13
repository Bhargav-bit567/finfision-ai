import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, ChevronRight, Activity, ShieldAlert } from "lucide-react";
import { stocks, sectors, volatilities } from "../utils/stockData";
import { Sparkline } from "../components/shared/StockCharts";


const StockExplorer = () => {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedVolatility, setSelectedVolatility] = useState("All Volatility");

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(search.toLowerCase()) || 
                           stock.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesSector = selectedSector === "All Sectors" || stock.sector === selectedSector;
      const matchesVolatility = selectedVolatility === "All Volatility" || stock.volatility === selectedVolatility;
      return matchesSearch && matchesSector && matchesVolatility;
    });
  }, [search, selectedSector, selectedVolatility]);

  return (
    <>
      <div className="explorer-container">
        <header className="explorer-header">
          <div className="header-copy">
            <span className="eyebrow">Market Discovery</span>
            <h1>Stock Explorer</h1>
            <p>Uncover behavioral patterns and market signals across global assets.</p>
          </div>
          
          <div className="explorer-controls">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search stocks by name or symbol..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filters-row">
              <div className="filter-group">
                <label><Filter size={14} /> Sector</label>
                <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div className="filter-group">
                <label><Activity size={14} /> Volatility</label>
                <select value={selectedVolatility} onChange={(e) => setSelectedVolatility(e.target.value)}>
                  {volatilities.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </header>

        <motion.div 
          layout
          className="stock-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredStocks.length === 0 && (
          <div className="empty-state">
            <div className="thinking-blob"></div>
            <h3>No assets match your filters</h3>
            <p>Try adjusting your search or selection parameters.</p>
            <button onClick={() => {setSearch(""); setSelectedSector("All Sectors"); setSelectedVolatility("All Volatility");}}>Reset Filters</button>
          </div>
        )}
      </div>
    </>
  );
};

const StockCard = React.forwardRef(({ stock }, ref) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="stock-explorer-card"
    >
      <div className="card-header">
        <div className="symbol-info">
          <span className="stock-symbol">{stock.symbol}</span>
          <span className="stock-name">{stock.name}</span>
        </div>
        <div className={`risk-badge risk-${stock.volatility.toLowerCase()}`}>
          <ShieldAlert size={12} />
          {stock.volatility} Risk
        </div>
      </div>

      <div className="card-main">
        <div className="price-info">
          <span className="current-price">${stock.price.toLocaleString()}</span>
          <span className={`price-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}{stock.change}%
          </span>
        </div>
        <div className="sparkline-wrapper">
          <Sparkline 
            data={stock.sparkline} 
            color={isPositive ? "#10b981" : "#ef4444"} 
          />
        </div>
      </div>

      <div className="card-footer">
        <div className="sector-tag">{stock.sector}</div>
        <button className="view-compare-btn">
          Compare <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
});

StockCard.displayName = "StockCard";

export default StockExplorer;
