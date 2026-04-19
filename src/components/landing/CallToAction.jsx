import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="premium-cta-section">
      <div className="premium-cta-background" />
      <motion.div
        className="premium-cta-content"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>Master your emotions. Master the market.</h2>
        <p>
          Join thousands of traders building calmer, more deliberate habits.
          Start experiencing the AI-led practice environment today.
        </p>
        <div className="premium-cta-buttons">
          <button
            className="cta-button-primary magnetic"
            onClick={() => navigate("/signup")}
          >
            Create Free Account
          </button>
          <button
            className="cta-button-secondary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default CallToAction;
