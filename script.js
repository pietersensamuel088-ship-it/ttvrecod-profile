const CONFIG = {
  // Profile links configuration
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
  discordUsername: 'ttvrecod',
  defaultVolume: 0.70,
  customCursor: {
    enabled: true,
    url: 'assets/cursor.png',
    hotspotX: 22,
    hotspotY: 32
  }
};

// --- Custom Hardware-Accelerated Cursor ---
function setupCustomCursor() {
  const cursor = CONFIG.customCursor || {};
  const pointer = document.getElementById('customPointer');
  if (!cursor.enabled || !cursor.url || !pointer || window.matchMedia('(pointer: coarse)').matches) return;

  document.documentElement.classList.add('custom-cursor-enabled');
  const img = pointer.querySelector('img');
  if (img) img.src = cursor.url;

  let raf = 0;
  const move = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        pointer.style.setProperty('--x', `${x}px`);
        pointer.style.setProperty('--y', `${y}px`);
        pointer.classList.add('visible');
        raf = 0;
      });
    }
  };

  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', () => pointer.classList.add('pressed'), { passive: true });
  window.addEventListener('pointerup', () => pointer.classList.remove('pressed'), { passive: true });
  window.addEventListener('pointercancel', () => pointer.classList.remove('pressed'), { passive: true });
  document.addEventListener('mouseleave', () => pointer.classList.remove('visible'));
  document.addEventListener('mouseenter', () => pointer.classList.add('visible'));
  window.addEventListener('blur', () => pointer.classList.remove('visible'));
}
setupCustomCursor();

// --- DOM References ---
const video = document.getElementById('bgVideo');
const intro = document.getElementById('intro');
const flash = document.getElementById('flash');
const introProgressBar = document.getElementById('introProgressBar');
const skipIntroButton = document.getElementById('skipIntroButton');
const profile = document.getElementById('profile');
const enterButton = document.getElementById('enterButton');
const loading = document.getElementById('loading');
const profileName = document.getElementById('profileName');
const saintName = document.querySelector('.saint-name');
const socials = document.querySelector('.socials');
const discordCard = document.getElementById('discordCard');
const discordUsernameText = document.getElementById('discordUsernameText');
const volumeControl = document.querySelector('.volume-control');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// --- Populate Dynamic Links ---
const socialMap = {
  socialDiscord: CONFIG.socials.discord,
  socialInstagram: CONFIG.socials.instagram,
  socialGithub: CONFIG.socials.github,
  socialReddit: CONFIG.socials.reddit,
  socialRoblox: CONFIG.socials.roblox,
  socialTwitch: CONFIG.socials.twitch,
  socialSteam: CONFIG.socials.steam
};

for (const [id, url] of Object.entries(socialMap)) {
  const el = document.getElementById(id);
  if (el && url) el.href = url;
}

if (discordCard && CONFIG.discordProfile) {
  discordCard.href = CONFIG.discordProfile;
}
if (discordUsernameText && CONFIG.discordUsername) {
  discordUsernameText.textContent = CONFIG.discordUsername;
}

// --- Volume Controller ---
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

// --- Cinematic Background Particles ---
function resizeParticles() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeParticles);
resizeParticles();

const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 2 + 0.3,
  a: Math.random() * 0.45 + 0.08,
  vx: (Math.random() - 0.5) * 0.16,
  vy: Math.random() * -0.22 - 0.04,
  pulse: Math.random() * Math.PI * 2
}));

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += 0.025;
    if (p.y < -12) {
      p.y = window.innerHeight + 12;
      p.x = Math.random() * window.innerWidth;
    }
    if (p.x < -12) p.x = window.innerWidth + 12;
    if (p.x > window.innerWidth + 12) p.x = -12;

    const alpha = Math.max(0.04, p.a + Math.sin(p.pulse) * 0.08);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// --- Intro Sequence & Glitches ---
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
const firedFlashes = new Set();

function showFlash(text) {
  flash.textContent = text;
  flash.classList.remove('show');
  void flash.offsetWidth;
  flash.classList.add('show');
}

function triggerNameBurst() {
  if (!profileName) return;
  profileName.classList.remove('name-flicker-burst');
  void profileName.offsetWidth;
  profileName.classList.add('name-flicker-burst');
  window.setTimeout(() => profileName.classList.remove('name-flicker-burst'), 700);
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
    }, 220);
  }, delay);
}

function finishIntro() {
  if (finished) return;
  finished = true;
  intro.classList.add('finished');
  if (skipIntroButton) skipIntroButton.hidden = true;

  window.setTimeout(() => {
    profile.classList.add('visible');
    profile.setAttribute('aria-hidden', 'false');

    if (profileName) {
      profileName.classList.remove('flicker-in');
      void profileName.offsetWidth;
      profileName.classList.add('flicker-in');

      // Staggered cinematic follow-up flickers
      [350, 750, 1200, 2100].forEach((d) => {
        window.setTimeout(() => triggerNameBurst(), d);
      });

      // Saint ignited reveal with cyber neon glow
      window.setTimeout(() => {
        saintName?.classList.add('saint-visible');
      }, 2100);

      // Socials and Discord card smooth spring reveal
      window.setTimeout(() => {
        socials?.classList.add('socials-visible');
        if (discordCard) discordCard.classList.add('discord-visible');
        scheduleRandomNameGlitch();
      }, 2800);
    }
  }, 100);
}

function skipIntro() {
  if (!started || finished) return;
  try {
    video.currentTime = INTRO_LENGTH;
  } catch (_) {}
  if (introProgressBar) introProgressBar.style.width = '100%';
  if (skipIntroButton) skipIntroButton.hidden = true;
  finishIntro();
}

if (skipIntroButton) {
  skipIntroButton.addEventListener('click', skipIntro);
}

function animateIntro() {
  if (finished) return;
  const t = video.currentTime || 0;
  if (introProgressBar) {
    introProgressBar.style.width = `${Math.min(100, (t / INTRO_LENGTH) * 100)}%`;
  }

  if (t >= 1.15) intro.classList.add('video-revealed');

  for (let i = 0; i < FLASHES.length; i++) {
    if (!firedFlashes.has(i) && t >= FLASHES[i].at) {
      firedFlashes.add(i);
      showFlash(FLASHES[i].text);
    }
  }

  if (t >= INTRO_LENGTH) {
    if (skipIntroButton) skipIntroButton.hidden = true;
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
  if (skipIntroButton) skipIntroButton.hidden = false;

  video.currentTime = 0;
  video.muted = (Number(volumeSlider?.value ?? 70) === 0);
  updateVolume();

  try {
    await video.play();
  } catch (error) {
    // Autoplay fallback with mute if blocked by browser policy
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
  if (!started && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    startExperience();
  } else if (started && !finished && (event.key === 'Escape' || event.key.toLowerCase() === 's')) {
    skipIntro();
  }
});
