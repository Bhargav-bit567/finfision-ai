import { motion } from "framer-motion";

const steps = [
  ["Complete a quick fear assessment", "Understand your baseline before you place the first simulated trade."],
  ["Practice with virtual currency", "Use ₹1,00,000 of virtual capital on live-feeling candlestick simulations."],
  ["Let AI observe decision patterns", "Every trade, pause, and hesitation is logged and scored in real time."],
  ["Review personalized coaching", "Plain-language insights tell you exactly what raised or lowered your fear index."],
  ["Build confidence before real risk", "Graduate from fearful to deliberate — at your own pace and on your own terms."],
];

function HowItWorks() {
  return (
    <section className="workflow-section" id="practice">
      <div className="workflow-visual">
        {steps.map((step, index) => (
          <motion.div
            className="orbit-step"
            key={step[0]}
            initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              x: index % 2 === 0 ? 8 : -8,
              transition: { type: "spring", stiffness: 420, damping: 20 },
            }}
          >
            <span>{index + 1}</span>
            <div>
              <strong>{step[0]}</strong>
              <em>{step[1]}</em>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="workflow-copy"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">A calmer loop</p>
        <h2>Practice, observe, adjust, repeat.</h2>
        <p>
          Finfision tracks the rhythm around a trade: how long you analyze, how quickly you react after a loss,
          and whether your sizing stays consistent under pressure.
        </p>
      </motion.div>
    </section>
  );
}

export default HowItWorks;
