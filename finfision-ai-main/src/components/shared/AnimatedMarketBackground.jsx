import { useEffect, useRef, memo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedMarketBackground
// Canvas-rendered, 60fps stock market background.
// Features: perspective grid, glowing candlesticks, dual wave lines (blue+orange),
// floating stock price numbers with fade lifecycle, depth gradient overlay.
// ─────────────────────────────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Catmull-Rom smooth curve through an array of {x, y} points */
function drawSmoothLine(ctx, pts) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

/** Draw a single candlestick */
function drawCandle(ctx, x, open, close, high, low, w, bullish) {
  const bodyTop = Math.min(open, close);
  const bodyH   = Math.max(1, Math.abs(close - open));
  const midX    = x + w / 2;

  // Wick
  ctx.beginPath();
  ctx.moveTo(midX, high);
  ctx.lineTo(midX, low);
  ctx.strokeStyle = bullish
    ? "rgba(56, 189, 248, 0.5)"
    : "rgba(56, 189, 248, 0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Body
  ctx.fillStyle = bullish
    ? "rgba(56, 189, 248, 0.75)"
    : "rgba(14, 76, 112, 0.85)";
  ctx.fillRect(x, bodyTop, w, bodyH);

  // Glow on body
  ctx.shadowColor  = "rgba(56, 189, 248, 0.8)";
  ctx.shadowBlur   = 10;
  ctx.fillStyle    = bullish
    ? "rgba(103, 232, 249, 0.25)"
    : "rgba(56, 189, 248, 0.1)";
  ctx.fillRect(x, bodyTop, w, bodyH);
  ctx.shadowBlur = 0;
}

// ── Simulation state factories ────────────────────────────────────────────────

function makeCandles(count, W, H) {
  const candles = [];
  const cw = Math.max(8, Math.floor(W / (count + count * 0.5)));
  const spacing = cw * 1.6;
  const baseY = H * 0.55;
  let price = 1000 + Math.random() * 200;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 40;
    const open   = price;
    price       += change;
    const close  = price;
    const high   = Math.max(open, close) - Math.abs(change) * Math.random() * 0.7;
    const low    = Math.min(open, close) + Math.abs(change) * Math.random() * 0.7;
    const h      = Math.abs(close - open) * 1.5 + 15;
    candles.push({
      x:       i * spacing + W * 0.08,
      open:    baseY - (open - 900) * 0.18,
      close:   baseY - (close - 900) * 0.18,
      high:    baseY - (Math.max(open, close) + h * 0.4 - 900) * 0.18,
      low:     baseY - (Math.min(open, close) - h * 0.6 - 900) * 0.18,
      w:       cw,
      bullish: close > open,
      // animation
      tickOffset: Math.random() * 400,
    });
  }
  return candles;
}

function makeSinePoints(W, H, offset = 0, ampMult = 1) {
  const pts = [];
  const baseY = H * 0.45;
  const amp   = H * 0.14 * ampMult;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    pts.push({
      x: t * W,
      baseY,
      amp,
      phase: offset + t * Math.PI * 3,
    });
  }
  return pts;
}

function makeFloatingNumbers(count, W, H) {
  const nums = [];
  const templates = [
    "1095", "1083", "1099", "0983", "1085",
    "0880", "1107", "2095", "1089", "1088",
    "0995", "1101", "1067", "0934", "1122",
  ];
  for (let i = 0; i < count; i++) {
    nums.push({
      x:       Math.random() * W,
      y:       Math.random() * H,
      vy:      -(0.08 + Math.random() * 0.18),   // drift upward
      vx:      (Math.random() - 0.5) * 0.05,
      alpha:   Math.random(),
      dalpha:  (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      size:    10 + Math.random() * 18,
      text:    templates[Math.floor(Math.random() * templates.length)],
      rotated: Math.random() < 0.35, // some are rotated 90° like in reference
    });
  }
  return nums;
}

// ── Main Component ────────────────────────────────────────────────────────────

function AnimatedMarketBackground() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // ── Resize helper ───────────────────────────────────────────────
    function resize() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;

      const CANDLE_COUNT = Math.floor(W / 40);
      const FLOAT_COUNT  = 18;

      stateRef.current = {
        W, H,
        t: 0,
        candles:  makeCandles(CANDLE_COUNT, W, H),
        bluePts:  makeSinePoints(W, H, 0, 1),
        orangePts: makeSinePoints(W, H, Math.PI * 0.55, 0.85),
        floats:   makeFloatingNumbers(FLOAT_COUNT, W, H),
      };
    }

    resize();
    window.addEventListener("resize", resize);

    // ── Grid drawing ────────────────────────────────────────────────
    function drawGrid(W, H) {
      const COLS = 20;
      const ROWS = 14;
      const dx   = W / COLS;
      const dy   = H / ROWS;

      ctx.save();
      ctx.strokeStyle = "rgba(30, 90, 140, 0.18)";
      ctx.lineWidth   = 0.75;

      // Vertical lines
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, H);
        ctx.stroke();
      }
      // Horizontal lines
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(W, j * dy);
        ctx.stroke();
      }

      // ── Perspective floor grid (bottom-third) ───────────────────
      const floorY   = H * 0.7;
      const horizonX = W * 0.5;
      const FLOOR_LINES = 12;
      for (let i = 0; i <= FLOOR_LINES; i++) {
        const t  = i / FLOOR_LINES;
        const x1 = horizonX + (0 - horizonX) * (1 - t);
        const x2 = horizonX + (W - horizonX) * (1 - t);
        // horizontal floor lines
        ctx.strokeStyle = "rgba(30,120,160,0.12)";
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, floorY + (H - floorY) * t);
        ctx.lineTo(W, floorY + (H - floorY) * t);
        ctx.stroke();
        // perspective convergence lines
        ctx.strokeStyle = "rgba(30,90,140,0.09)";
        ctx.beginPath();
        ctx.moveTo(x1, floorY + (H - floorY) * t);
        ctx.lineTo(horizonX, floorY * 0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, floorY + (H - floorY) * t);
        ctx.lineTo(horizonX, floorY * 0.2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // ── Floating numbers ─────────────────────────────────────────────
    function updateAndDrawFloats(floats, W, H, dt) {
      for (const f of floats) {
        // Move
        f.x += f.vx;
        f.y += f.vy;
        f.alpha += f.dalpha;

        // Bounce alpha
        if (f.alpha <= 0 || f.alpha >= 1) {
          f.dalpha *= -1;
          f.alpha = Math.max(0, Math.min(1, f.alpha));
        }

        // Wrap y
        if (f.y < -40) {
          f.y = H + 20;
          f.x = Math.random() * W;
          f.alpha = 0;
        }
        if (f.y > H + 40) f.y = -20;

        // Wrap x
        if (f.x < -60) f.x = W + 20;
        if (f.x > W + 60) f.x = -20;

        // Draw
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(0.45, f.alpha * 0.45));
        ctx.font = `${f.size}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.fillStyle   = "rgba(103, 232, 249, 1)";
        ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
        ctx.shadowBlur  = 6;

        if (f.rotated) {
          ctx.translate(f.x, f.y);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(f.text, 0, 0);
        } else {
          ctx.fillText(f.text, f.x, f.y);
        }
        ctx.restore();
      }
    }

    // ── Wave lines ──────────────────────────────────────────────────
    function drawWaveLine(pts, t, color, glowColor, lineW, phaseShift) {
      // Resolve current y values
      const resolved = pts.map((p) => ({
        x: p.x,
        y: p.baseY + Math.sin(p.phase + t * 0.6 + phaseShift) * p.amp
           + Math.sin(p.phase * 2 + t * 0.35) * p.amp * 0.3,
      }));

      // Outer glow (wide, faint)
      ctx.save();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth   = lineW + 14;
      ctx.globalAlpha = 0.08;
      ctx.filter      = "blur(4px)";
      drawSmoothLine(ctx, resolved);
      ctx.stroke();

      // Mid glow
      ctx.globalAlpha = 0.18;
      ctx.lineWidth   = lineW + 6;
      ctx.filter      = "blur(2px)";
      drawSmoothLine(ctx, resolved);
      ctx.stroke();

      // Core line
      ctx.globalAlpha = 1;
      ctx.lineWidth   = lineW;
      ctx.strokeStyle = color;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur  = 18;
      ctx.filter      = "none";
      drawSmoothLine(ctx, resolved);
      ctx.stroke();

      // Bright highlight on top
      ctx.lineWidth   = 1.5;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.shadowBlur  = 0;
      drawSmoothLine(ctx, resolved);
      ctx.stroke();

      ctx.restore();
    }

    // ── Candle animation ─────────────────────────────────────────────
    function drawCandles(candles, t) {
      ctx.save();
      for (const c of candles) {
        // Subtle flicker on top of candle
        const flicker = Math.sin((t + c.tickOffset) * 3) * 1.5;
        drawCandle(
          ctx,
          c.x,
          c.open  + flicker * 0.5,
          c.close + flicker,
          c.high  + flicker * 0.7,
          c.low   - flicker * 0.3,
          c.w,
          c.bullish
        );
      }
      ctx.restore();
    }

    // ── Main render loop ─────────────────────────────────────────────
    function render() {
      const s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(render); return; }

      const { W, H, candles, bluePts, orangePts, floats } = s;
      s.t += 0.012;
      const t = s.t;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // ── Background gradient (deep navy to near-black) ──────────────
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0,   "#010c1a");
      bgGrad.addColorStop(0.45, "#021528");
      bgGrad.addColorStop(0.75, "#010c1a");
      bgGrad.addColorStop(1,   "#010a14");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // ── Grid ──────────────────────────────────────────────────────
      drawGrid(W, H);

      // ── Candlesticks (behind lines) ────────────────────────────────
      drawCandles(candles, t);

      // ── Wave lines ─────────────────────────────────────────────────
      // Orange line (runs slightly behind/below blue in reference)
      drawWaveLine(
        orangePts, t,
        "#f97316",        // tailwind orange-500
        "rgba(251,146,60,0.9)",
        3,
        Math.PI * 0.18
      );
      // Blue line (slightly above orange)
      drawWaveLine(
        bluePts, t,
        "#38bdf8",        // tailwind sky-400
        "rgba(56,189,248,0.9)",
        3,
        0
      );

      // ── Floating numbers ───────────────────────────────────────────
      updateAndDrawFloats(floats, W, H, t);

      // ── Depth overlay: radial vignette + bottom fog ────────────────
      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H);
      vig.addColorStop(0,   "rgba(0,0,0,0)");
      vig.addColorStop(0.65, "rgba(0,0,0,0)");
      vig.addColorStop(1,   "rgba(0,4,12,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Bottom fog (hides grid horizon)
      const fog = ctx.createLinearGradient(0, H * 0.7, 0, H);
      fog.addColorStop(0, "rgba(1,10,20,0)");
      fog.addColorStop(1, "rgba(1,8,16,0.88)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, H * 0.68, W, H * 0.32);

      // Top fade
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.12);
      topFade.addColorStop(0, "rgba(1,12,26,0.6)");
      topFade.addColorStop(1, "rgba(1,12,26,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.12);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

// Memoize — this component never needs to re-render from props
export default memo(AnimatedMarketBackground);
