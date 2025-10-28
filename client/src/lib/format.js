// client/src/lib/format.js
export function msToMMSS(ms) {
  if (ms == null || Number.isNaN(ms)) return "–";
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// If accuracy is stored as 0..1, pass {fraction:true} or pre-multiply.
export function pct(value, { fraction = true } = {}) {
  if (value == null || Number.isNaN(value)) return "–";
  const n = fraction ? value * 100 : value;
  return `${Math.round(n)}%`;
}
