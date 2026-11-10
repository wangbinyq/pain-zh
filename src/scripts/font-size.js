const KEY = "pain-zh:font-size";
const STEPS = [
  ["中", "18px"],
  ["大", "20px"],
  ["特大", "22px"],
];

function read() {
  try {
    const i = Number(localStorage.getItem(KEY));
    return Number.isInteger(i) && i >= 0 && i < STEPS.length ? i : 0;
  } catch {
    return 0;
  }
}

function apply(i) {
  document.documentElement.style.setProperty("--fs", STEPS[i][1]);
}

export function applyFontSize() {
  apply(read());
}

export function cycleFontSize() {
  const next = (read() + 1) % STEPS.length;
  try {
    localStorage.setItem(KEY, String(next));
  } catch {}
  apply(next);
}

cycleFontSize.current = () => STEPS[read()][0];
