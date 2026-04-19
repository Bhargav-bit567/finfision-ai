import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function CountUp({ value, prefix = "", suffix = "", duration = 1.5, decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = displayValue;
    const change = value - startValue;

    const easeOutQuart = (t) => 1 - (--t) * t * t * t;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / (duration * 1000);
      
      if (progress < 1) {
        const currentEasedProgress = easeOutQuart(progress);
        setDisplayValue(startValue + change * currentEasedProgress);
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
