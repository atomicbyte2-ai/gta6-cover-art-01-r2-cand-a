// GOLDEN GETAWAY — cover renderer. Draws the 7-panel sunset cast collage
// at any size (landscape, square or portrait) with a relative layout, so the
// frame is always filled: top press strip, 7 labelled photo panels, giant
// gradient title, pink script subtitle, tagline strip, credits + barcode.
export const ROLES = [
  'THE WHEELMAN', 'THE INSIDE MAN', 'THE CHARMER', 'THE MECHANIC',
  'THE SIREN', 'THE GHOST', 'THE MUSCLE',
];
export const SAMPLES = [
  'samples/wheelman.jpg', 'samples/insideman.jpg', 'samples/charmer.jpg',
  'samples/mechanic.jpg', 'samples/siren.jpg', 'samples/ghost.jpg',
  'samples/muscle.jpg',
];
export function defaultState() {
  return {
    title: 'GOLDEN GETAWAY',
    subtitle: 'one last summer job',
    quote: 'A JOYRIDE WORTH EVERY TICKET',
    gazette: 'THE SUNSET HERALD',
    tagline: 'SEVEN CREW \u2022 ONE SUNSET \u2022 NO WAY BACK',
    credits: 'SUNSET PICTURES  \u2022  A GOLDEN GETAWAY FILM  \u2022  STARRING YOU AND YOUR CREW  \u2022  IN THEATRES THIS SUMMER',
    roles: ROLES.slice(),
    panels: SAMPLES.map((src) => ({ src, img: null, zoom: 1, ox: 0, oy: 0 })),
  };
}
export function loadImage(src) {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}
export async function ensureImages(state) {
  for (const p of state.panels) {
    if (!p.img && p.src) p.img = await loadImage(p.src);
  }
}
function drawPanel(ctx, p, x, y, w, h) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#ff7a18'); g.addColorStop(0.55, '#e84393'); g.addColorStop(1, '#2b1055');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (p.img) {
    const iw = p.img.naturalWidth, ih = p.img.naturalHeight;
    const base = Math.max(w / iw, h / ih) * (p.zoom || 1);
    const dw = iw * base, dh = ih * base;
    const dx = x + (w - dw) / 2 + (p.ox || 0) * w * 0.4;
    const dy = y + (h - dh) / 2 + (p.oy || 0) * h * 0.4;
    ctx.drawImage(p.img, dx, dy, dw, dh);
  }
  const warm = ctx.createLinearGradient(x, y, x, y + h);
  warm.addColorStop(0, 'rgba(255,122,24,0.10)');
  warm.addColorStop(1, 'rgba(43,16,85,0.28)');
  ctx.fillStyle = warm; ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}
function fitFont(ctx, text, maxW, startPx, family, weight) {
  let px = startPx;
  ctx.font = `${weight} ${px}px ${family}`;
  while (px > 12 && ctx.measureText(text).width > maxW) {
    px -= 2; ctx.font = `${weight} ${px}px ${family}`;
  }
  return px;
}
export function drawCover(ctx, state, W, H) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2b1055'); sky.addColorStop(0.35, '#e84393');
  sky.addColorStop(0.62, '#ff7a18'); sky.addColorStop(1, '#1a0b2e');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(W / 2, H * 0.52, 10, W / 2, H * 0.52, W * 0.42);
  sun.addColorStop(0, 'rgba(255,214,64,0.55)'); sun.addColorStop(1, 'rgba(255,214,64,0)');
  ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);

  const stripH = H * 0.088, credH = H * 0.075;
  const panelY = stripH, panelH = H - stripH - credH;
  const gap = Math.max(2, W * 0.004);
  const pw = (W - gap * 8) / 7;
  state.panels.forEach((p, i) => {
    drawPanel(ctx, p, gap + i * (pw + gap), panelY, pw, panelH);
  });
  const labelH = Math.max(20, H * 0.052);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  state.panels.forEach((p, i) => {
    const x = gap + i * (pw + gap);
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(x, panelY + panelH - labelH, pw, labelH);
    fitFont(ctx, state.roles[i], pw * 0.92, labelH * 0.52, 'Anton, "Arial Black", sans-serif', 400);
    ctx.fillStyle = '#ffd640';
    ctx.fillText(state.roles[i], x + pw / 2, panelY + panelH - labelH / 2 + 1);
  });

  // Top press strip
  ctx.fillStyle = 'rgba(10,4,24,0.92)'; ctx.fillRect(0, 0, W, stripH);
  ctx.fillStyle = '#ffd640';
  fitFont(ctx, '\u2605\u2605\u2605\u2605\u2605', W * 0.16, stripH * 0.5, 'Arial, sans-serif', 700);
  ctx.textAlign = 'left'; ctx.fillText('\u2605\u2605\u2605\u2605\u2605', W * 0.02, stripH / 2 + 1);
  ctx.fillStyle = '#ffffff';
  fitFont(ctx, '\u201C' + state.quote + '\u201D', W * 0.58, stripH * 0.42, 'Anton, "Arial Black", sans-serif', 400);
  ctx.textAlign = 'center';
  ctx.fillText('\u201C' + state.quote + '\u201D', W * 0.5, stripH / 2 + 1);
  ctx.fillStyle = '#ffb3d9';
  fitFont(ctx, state.gazette, W * 0.17, stripH * 0.34, 'Anton, "Arial Black", sans-serif', 400);
  ctx.textAlign = 'right';
  ctx.fillText(state.gazette, W * 0.985, stripH / 2 + 1);

  // Title block
  const titleCy = H * 0.47;
  const bandH = H * 0.235;
  ctx.fillStyle = 'rgba(12,4,26,0.55)';
  ctx.fillRect(0, titleCy - bandH / 2, W, bandH);
  const titlePx = fitFont(ctx, state.title, W * 0.96, W * 0.105, 'Anton, "Arial Black", sans-serif', 400);
  const grad = ctx.createLinearGradient(0, titleCy - titlePx * 0.6, 0, titleCy + titlePx * 0.6);
  grad.addColorStop(0, '#ff8c1a'); grad.addColorStop(0.5, '#ffc93c'); grad.addColorStop(1, '#ff5e3a');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#14060a'; ctx.lineWidth = Math.max(4, titlePx * 0.11);
  ctx.strokeText(state.title, W / 2, titleCy - titlePx * 0.08);
  ctx.fillStyle = grad;
  ctx.fillText(state.title, W / 2, titleCy - titlePx * 0.08);
  ctx.save();
  ctx.shadowColor = '#ff2e88'; ctx.shadowBlur = Math.max(8, W * 0.012);
  ctx.fillStyle = '#ff8fc7';
  const subPx = fitFont(ctx, state.subtitle, W * 0.5, W * 0.038, '"Segoe Script", "Brush Script MT", cursive', 700);
  ctx.fillText(state.subtitle, W / 2, titleCy + bandH / 2 - subPx * 0.7);
  ctx.restore();
  const tagH = Math.max(22, H * 0.05);
  const tagY = titleCy + bandH / 2 + H * 0.012;
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(W * 0.06, tagY, W * 0.88, tagH);
  ctx.fillStyle = '#ffffff';
  fitFont(ctx, state.tagline, W * 0.84, tagH * 0.52, 'Anton, "Arial Black", sans-serif', 400);
  ctx.fillText(state.tagline, W / 2, tagY + tagH / 2 + 1);

  // Bottom credits band
  ctx.fillStyle = 'rgba(10,4,24,0.94)'; ctx.fillRect(0, H - credH, W, credH);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  fitFont(ctx, state.credits, W * 0.78, credH * 0.32, 'Arial, sans-serif', 400);
  ctx.textAlign = 'left';
  ctx.fillText(state.credits, W * 0.015, H - credH / 2 + 1);
  let bx = W * 0.86, bw = W * 0.115, bh = credH * 0.62;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(bx - 4, H - credH + 4, bw + 8, bh + 8);
  ctx.fillStyle = '#000000';
  let seed = 1234567;
  for (let x = bx; x < bx + bw; x += 3) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const wBar = 1 + (seed % 3);
    if (seed % 3 !== 0) ctx.fillRect(x, H - credH + 6, wBar, bh);
  }
  // Gold BEST CAST seal, bottom-right over the panels
  const sr = Math.max(26, W * 0.038);
  const sx = W - sr - W * 0.015, sy = H - credH - sr - H * 0.06;
  ctx.save();
  ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd640'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#8a5a00'; ctx.stroke();
  ctx.beginPath(); ctx.arc(sx, sy, sr * 0.78, 0, Math.PI * 2);
  ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#5c3a00'; ctx.textAlign = 'center';
  const sealPx = fitFont(ctx, 'BEST', sr * 0.85, sr * 0.42, 'Anton, "Arial Black", sans-serif', 400);
  ctx.fillText('BEST', sx, sy - sealPx * 0.55);
  ctx.fillText('CAST', sx, sy + sealPx * 0.55);
  ctx.fillStyle = '#8a5a00';
  ctx.font = `${Math.max(9, sr * 0.3)}px Arial`;
  ctx.fillText('\u2605', sx, sy + sealPx * 1.15);
  ctx.restore();
}
