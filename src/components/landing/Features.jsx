import { motion } from "framer-motion";

const features = [
  ["Fear Detection AI", "Real-time read on hesitation, impulsive entries, and sizing changes that signal emotional trading."],
  ["Practice Trading", "Virtual ₹10,000 balance with live-feeling candles, fast outcomes, and zero real risk."],
  ["Confidence Building", "Personalized guidance that turns every mistake into a calmer, more deliberate next step."],
  ["Live Market Lens", "Watchlists, index moves, and curated headlines — all in the same working surface."],
  ["Progress Tracking", "Fear index, emotion timeline, streaks, and weekly confidence milestones in one view."],
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function Features() {
  return (
    <section className="feature-section" id="features">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">Built around behavior</p>
        <h2>Spot the feeling before it becomes the trade.</h2>
      </motion.div>

      <motion.div
        className="feature-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {features.map(([title, text], index) => (
          <motion.article
            className="feature-card"
            key={title}
            variants={cardVariants}
            whileHover={{
              y: -14,
              transition: { type: "spring", stiffness: 380, damping: 16 },
            }}
          >
            <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default Features;
