// GOLDEN GETAWAY editor: pick panels, assign photos, drag to pan, zoom,
// edit every line of copy, export PNG in three sizes. ?shot=cover shows the
// cover full-frame; ?shot=editor shows the editor with samples loaded.
// Both scenes set window.__shotReady once painted.
import { defaultState, ensureImages, drawCover, ROLES, SAMPLES } from './cover.js';

const state = defaultState();
const canvas = document.getElementById('cover');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
let selected = 0;

function redraw() {
  drawCover(ctx, state, canvas.width, canvas.height);
}
function bindText(id, key) {
  const el = document.getElementById(id);
  el.addEventListener('input', () => { state[key] = el.value; redraw(); });
}
['title', 'subtitle', 'quote', 'gazette', 'tagline', 'credits'].forEach((k) => bindText(k, k));

// Panel picker + role editing
const picker = document.getElementById('panels');
ROLES.forEach((role, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'panel-btn'; b.textContent = `${i + 1} · ${role}`;
  b.addEventListener('click', () => { selected = i; syncPicker(); });
  picker.appendChild(b);
});
const roleInput = document.getElementById('role');
roleInput.addEventListener('input', () => {
  state.roles[selected] = roleInput.value.toUpperCase();
  picker.children[selected].textContent = `${selected + 1} · ${state.roles[selected]}`;
  redraw();
});
function syncPicker() {
  [...picker.children].forEach((c, i) => c.classList.toggle('active', i === selected));
  roleInput.value = state.roles[selected];
  document.getElementById('zoom').value = state.panels[selected].zoom;
}

// Photo library: bundled samples + user uploads
const thumbs = document.getElementById('thumbs');
function addThumb(src, label) {
  const t = document.createElement('button');
  t.type = 'button'; t.className = 'thumb'; t.title = label;
  const im = new Image(); im.src = src; im.alt = label;
  t.appendChild(im);
  t.addEventListener('click', async () => {
    const img = await new Promise((res) => { const x = new Image(); x.onload = () => res(x); x.onerror = () => res(null); x.src = src; });
    if (!img) return;
    state.panels[selected] = { src, img, zoom: 1, ox: 0, oy: 0 };
    syncPicker(); redraw();
    status.textContent = `Panel ${selected + 1} (${state.roles[selected]}) now uses ${label}.`;
  });
  thumbs.appendChild(t);
}
SAMPLES.forEach((s, i) => addThumb(s, ROLES[i]));
document.getElementById('upload').addEventListener('change', async (e) => {
  for (const file of e.target.files) {
    const url = URL.createObjectURL(file);
    addThumb(url, file.name);
    const img = await new Promise((res) => { const x = new Image(); x.onload = () => res(x); x.src = url; });
    state.panels[selected] = { src: url, img, zoom: 1, ox: 0, oy: 0 };
  }
  redraw();
  status.textContent = 'Your photo is in the library — click a thumbnail to put it in a panel.';
});
document.getElementById('fillAll').addEventListener('click', () => {
  const p = state.panels[selected];
  state.panels.forEach((_, i) => { state.panels[i] = { ...p }; });
  redraw(); status.textContent = 'One photo now fills all 7 panels — drag each panel to frame a different crop.';
});
document.getElementById('zoom').addEventListener('input', (e) => {
  state.panels[selected].zoom = parseFloat(e.target.value);
  redraw();
});

// Drag to pan the panel under the pointer
let drag = null;
function panelAt(cx, cy) {
  const r = canvas.getBoundingClientRect();
  const x = (cx - r.left) / r.width * canvas.width;
  const y = (cy - r.top) / r.height * canvas.height;
  const stripH = canvas.height * 0.088, credH = canvas.height * 0.075;
  if (y < stripH || y > canvas.height - credH) return -1;
  const gap = Math.max(2, canvas.width * 0.004);
  const pw = (canvas.width - gap * 8) / 7;
  const i = Math.floor((x - gap) / (pw + gap));
  return (i >= 0 && i < 7) ? i : -1;
}
canvas.addEventListener('pointerdown', (e) => {
  const i = panelAt(e.clientX, e.clientY);
  if (i < 0) return;
  selected = i; syncPicker();
  drag = { x: e.clientX, y: e.clientY, ox: state.panels[i].ox, oy: state.panels[i].oy };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const r = canvas.getBoundingClientRect();
  state.panels[selected].ox = drag.ox + (e.clientX - drag.x) / r.width * 2.2;
  state.panels[selected].oy = drag.oy + (e.clientY - drag.y) / r.height * 2.2;
  state.panels[selected].ox = Math.max(-1, Math.min(1, state.panels[selected].ox));
  state.panels[selected].oy = Math.max(-1, Math.min(1, state.panels[selected].oy));
  redraw();
});
canvas.addEventListener('pointerup', () => { drag = null; });

// Export PNG in three sizes
async function exportPNG(w, h) {
  await ensureImages(state);
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  drawCover(off.getContext('2d'), state, w, h);
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `golden-getaway-${w}x${h}.png`;
    a.click();
    status.textContent = `Saved golden-getaway-${w}x${h}.png`;
  }, 'image/png');
}
document.querySelectorAll('[data-export]').forEach((b) => {
  b.addEventListener('click', () => {
    const [w, h] = b.dataset.export.split('x').map(Number);
    exportPNG(w, h);
  });
});

// Shots
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
async function ready() {
  await document.fonts.ready;
  await ensureImages(state);
  redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
if (shot === 'cover') {
  document.body.classList.add('shot-cover');
  const size = params.get('size') || '1280x720';
  const [w, h] = size.split('x').map(Number);
  canvas.width = w; canvas.height = h;
  ready();
} else if (shot === 'editor') {
  canvas.width = 1280; canvas.height = 720;
  syncPicker();
  ready();
} else {
  syncPicker();
  ready();
}
