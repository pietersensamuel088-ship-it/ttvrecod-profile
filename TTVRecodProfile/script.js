const CONFIG = {
  // Replace these values with your real links. Keeping them here means you only edit one place.
  socials: {
    discord: 'https://discord.com/users/1162838607220965377',
    instagram: 'https://instagram.com/chrisbrownoffical',
    github: 'https://github.com/TTVRecod',
    reddit: 'https://reddit.com/u/TTVRecod',
    roblox: 'https://www.roblox.com/users/1369158216/profile',
    twitch: 'https://www.twitch.tv/TTVRecod',
    steam: 'https://steamcommunity.com/id/TTVRecod'
  },
  discordProfile: 'https://discord.com/users/1162838607220965377',
  defaultVolume: 0.70,
  // Custom cursor: set enabled to true and paste a direct image URL. PNG/WebP works best.
  // A local cursor also works: 'assets/cursor.png'
  customCursor: {
    enabled: true,
    url: 'assets/cursor.png',
    hotspotX: 22,
    hotspotY: 32
  }
};

function setupCustomCursor() {
  const cursor = CONFIG.customCursor || {};
  const pointer = document.getElementById('customPointer');
  if (!cursor.enabled || !cursor.url || !pointer || window.matchMedia('(pointer: coarse)').matches) return;
  document.documentElement.classList.add('custom-cursor-enabled');
  const img = pointer.querySelector('img');
  if (img) img.src = cursor.url;
  let raf = 0;
  const move = (event) => {
    const x = event.clientX; const y = event.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        pointer.style.left = `${x}px`; pointer.style.top = `${y}px`;
        pointer.classList.add('visible'); raf = 0;
      });
    }
  };
  window.addEventListener('pointermove', move, {passive:true});
  window.addEventListener('pointerdown', () => pointer.classList.add('pressed'), {passive:true});
  window.addEventListener('pointerup', () => pointer.classList.remove('pressed'), {passive:true});
  window.addEventListener('pointercancel', () => pointer.classList.remove('pressed'), {passive:true});
  window.addEventListener('blur', () => pointer.classList.remove('visible'));
}
setupCustomCursor();

const video = document.getElementById('bgVideo');
const intro = document.getElementById('intro');
const flash = document.getElementById('flash');
const introGlitch = document.getElementById('introGlitch');
const introProgressBar = document.getElementById('introProgressBar');
const profile = document.getElementById('profile');
const enterButton = document.getElementById('enterButton');
const loading = document.getElementById('loading');
const profileName = document.getElementById('profileName');
const socials = document.querySelector('.socials');
const saintName = document.querySelector('.saint-name');
const discordCard = document.querySelector('.discord-card');
const discordCardLink = document.getElementById('discordCard');
const volumeControl = document.querySelector('.volume-control');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Centralized editable links: change only CONFIG above.
const socialLinks = {
  socialDiscord: document.getElementById('socialDiscord'),
  socialInstagram: document.getElementById('socialInstagram'),
  socialGithub: document.getElementById('socialGithub'),
  socialReddit: document.getElementById('socialReddit'),
  socialRoblox: document.getElementById('socialRoblox'),
  socialTwitch: document.getElementById('socialTwitch'),
  socialSteam: document.getElementById('socialSteam')
};

for (const [id, url] of Object.entries({
  socialDiscord: CONFIG.socials.discord,
  socialInstagram: CONFIG.socials.instagram,
  socialGithub: CONFIG.socials.github,
  socialReddit: CONFIG.socials.reddit,
  socialRoblox: CONFIG.socials.roblox,
  socialTwitch: CONFIG.socials.twitch,
  socialSteam: CONFIG.socials.steam
})) {
  if (socialLinks[id]) socialLinks[id].href = url;
}
if (discordCardLink) discordCardLink.href = CONFIG.discordProfile;

function updateVolume() {
  const value = Math.max(0, Math.min(100, Number(volumeSlider?.value ?? 70)));
  if (volumeSlider) {
    volumeSlider.value = String(value);
    volumeSlider.style.setProperty('--fill', `${value}%`);
  }
  if (volumeValue) volumeValue.textContent = `${value}%`;
  video.volume = value / 100;
  video.muted = value === 0;
}

if (volumeSlider) {
  volumeSlider.value = String(Math.round(CONFIG.defaultVolume * 100));
  volumeSlider.addEventListener('input', updateVolume);
  updateVolume();
}

// Timings are intentionally tied to the uploaded video's own timeline.
const INTRO_LENGTH = 9.5;
const FLASHES = [
  { at: 2.10, text: 'TTV/RECOD' },
  { at: 2.56, text: 'RECOD' },
  { at: 3.04, text: 'TTV/RECOD' },
  { at: 3.62, text: 'RECOD' },
  { at: 4.20, text: 'TTV/RECOD' },
  { at: 4.94, text: 'TTV/RECOD' },
  { at: 5.52, text: 'RECOD' },
  { at: 6.16, text: 'TTV/RECOD' }
];

let started = false;
let finished = false;
let loaded = false;
const fired = new Set();

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const particles = Array.from({ length: 135 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 2.2 + .25,
  a: Math.random() * .55 + .08,
  vx: (Math.random() - .5) * .18,
  vy: Math.random() * -.22 - .03,
  pulse: Math.random() * Math.PI * 2
}));

function drawParticles(t = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += .025;
    if (p.y < -12) { p.y = window.innerHeight + 12; p.x = Math.random() * window.innerWidth; }
    if (p.x < -12) p.x = window.innerWidth + 12;
    if (p.x > window.innerWidth + 12) p.x = -12;
    const alpha = Math.max(.03, p.a + Math.sin(p.pulse) * .08);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

function showFlash(text) {
  flash.textContent = text;
  flash.classList.remove('show');
  void flash.offsetWidth;
  flash.classList.add('show');
}

function showGlitch() {
  introGlitch.classList.remove('show');
  void introGlitch.offsetWidth;
  introGlitch.classList.add('show');
}

function scheduleRandomNameGlitch() {
  if (!profileName || !finished) return;
  const delay = 3500 + Math.random() * 4500;
  window.setTimeout(() => {
    if (!finished) return;
    profileName.classList.remove('random-glitch');
    void profileName.offsetWidth;
    profileName.classList.add('random-glitch');
    window.setTimeout(() => {
      profileName.classList.remove('random-glitch');
      scheduleRandomNameGlitch();
    }, 180 + Math.random() * 120);
  }, delay);
}

function triggerNameFlicker() {
  if (!profileName) return;
  profileName.classList.remove('name-flicker-burst');
  void profileName.offsetWidth;
  profileName.classList.add('name-flicker-burst');
  window.setTimeout(() => profileName.classList.remove('name-flicker-burst'), 780);
}

function scheduleNameFlickerBursts() {
  // Three quick flashes, then another pass about a second later.
  [250, 540, 830, 1950].forEach((delay) => {
    window.setTimeout(() => triggerNameFlicker(), delay);
  });
}

function finishIntro() {
  if (finished) return;
  finished = true;
  intro.classList.add('finished');
  window.setTimeout(() => {
    profile.classList.add('visible');
    profile.setAttribute('aria-hidden', 'false');
    if (profileName) {
      profileName.classList.remove('flicker-in');
      void profileName.offsetWidth;
      profileName.classList.add('flicker-in');
      scheduleNameFlickerBursts();
      window.setTimeout(() => {
        saintName?.classList.add('saint-visible');
      }, 2350);
      window.setTimeout(() => {
        socials?.classList.add('socials-visible');
        if (discordCard) discordCard.classList.add('discord-visible');
        scheduleRandomNameGlitch();
      }, 3000);
    }
  }, 120);
}

function animateIntro() {
  if (finished) return;
  const t = video.currentTime || 0;
  introProgressBar.style.width = `${Math.min(100, (t / INTRO_LENGTH) * 100)}%`;

  if (t >= 1.15) intro.classList.add('video-revealed');
  if (t >= 2.0 && t < 2.2) showGlitch();

  for (let i = 0; i < FLASHES.length; i++) {
    if (!fired.has(i) && t >= FLASHES[i].at) {
      fired.add(i);
      showFlash(FLASHES[i].text);
    }
  }

  if (t >= INTRO_LENGTH) {
    finishIntro();
    return;
  }
  requestAnimationFrame(animateIntro);
}

async function startExperience() {
  if (started) return;
  started = true;
  enterButton.classList.add('hidden');
  loading.classList.add('hidden');

  video.currentTime = 0;
  video.muted = (Number(volumeSlider?.value ?? 70) === 0);
  updateVolume();

  try {
    await video.play();
  } catch (error) {
    // A user click normally grants audio playback. If a browser still blocks it,
    // fall back to muted video rather than breaking the intro.
    video.muted = true;
    try { await video.play(); } catch (_) {}
  }

  video.classList.add('visible');
  volumeControl?.classList.add('ready');
  animateIntro();
}

video.addEventListener('loadeddata', () => {
  loaded = true;
  loading.classList.add('hidden');
  enterButton.disabled = false;
});

video.addEventListener('error', () => {
  loading.textContent = 'video failed to load';
});

enterButton.addEventListener('click', startExperience);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    startExperience();
  }
});

// Make sure the profile never appears before the cinematic intro is actually played.
profile.classList.remove('visible');
profile.setAttribute('aria-hidden', 'true');
