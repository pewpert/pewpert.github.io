// Draws the decorative barcode on the consignee label from a fixed code,
// so it renders the same on every visit.
(function () {
  const svg = document.getElementById('barcode');
  if (!svg) return;

  const code = 'DC-SIN-TYO-2026';
  const ns = 'http://www.w3.org/2000/svg';
  const width = 300;
  let x = 0;
  let seed = 0;
  for (const ch of code) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;

  const next = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 4294967296;
  };

  while (x < width) {
    const bar = 1 + Math.floor(next() * 4);
    const gap = 1 + Math.floor(next() * 3);
    if (x + bar > width) break;
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', bar);
    rect.setAttribute('height', 54);
    rect.setAttribute('fill', 'currentColor');
    svg.appendChild(rect);
    x += bar + gap;
  }
})();
