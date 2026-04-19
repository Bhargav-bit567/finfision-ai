import { motion } from "framer-motion";

const metrics = [
  { value: "18k", label: "practice trades completed in simulations" },
  { value: "42%", label: "average reduction in hesitation markers" },
  { value: "₹10k", label: "virtual balance for every new practice account" },
];

const testimonials = [
  {
    quote: "The coaching made losses feel like review points instead of panic buttons.",
    author: "Riya, first-time investor",
  },
  {
    quote: "I finally saw how much I was changing trade size after one bad candle.",
    author: "Arjun, practice trader",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function WhyFinfision() {
  return (
    <section className="premium-why-container" id="why">
      <motion.div
        className="premium-why-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="eyebrow">Confidence, measured</p>
        <h2>Practice until your process feels steady.</h2>
      </motion.div>

      <motion.div
        className="premium-metrics-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {metrics.map((metric, idx) => (
          <motion.article key={idx} className="premium-metric-card" variants={cardVariants}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </motion.article>
        ))}
      </motion.div>

      <div className="section-divider" />

      <motion.div
        className="premium-testimonials"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {testimonials.map((test, idx) => (
          <motion.blockquote key={idx} className="premium-testimonial-card" variants={cardVariants}>
            <span className="testimonial-quote-icon">"</span>
            <p>{test.quote}</p>
            <cite>{test.author}</cite>
          </motion.blockquote>
        ))}
      </motion.div>
    </section>
  );
}

export default WhyFinfision;
