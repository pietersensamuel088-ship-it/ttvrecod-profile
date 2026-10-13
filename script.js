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
const volumeControlWrap = document.getElementById('volumeControlWrap');
const volumeMuteBtn = document.getElementById('volumeMuteBtn');
const volumeIcon = document.getElementById('volumeIcon');
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
let previousVolume = Math.round(CONFIG.defaultVolume * 100);

function updateVolume() {
  const value = Math.max(0, Math.min(100, Number(volumeSlider?.value ?? 70)));
  if (volumeSlider) {
    volumeSlider.value = String(value);
    volumeSlider.style.setProperty('--fill', `${value}%`);
  }
  if (volumeValue) volumeValue.textContent = `${value}%`;

  if (video) {
    video.volume = value / 100;
    video.muted = value === 0;
  }

  // Update speaker SVG dynamically
  if (volumeIcon) {
    if (value === 0) {
      volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else if (value < 50) {
      volumeIcon.innerHTML = '<path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
    } else {
      volumeIcon.innerHTML = '<path d="M4 9v6h4l5 4V5L8 9H4Zm11.5 3a3.5 3.5 0 0 0-1.7-3v6a3.5 3.5 0 0 0 1.7-3Zm0-7v1.7a7 7 0 0 1 0 10.6v1.7a8.7 8.7 0 0 0 0-14Z"/>';
    }
  }
}

function toggleMute() {
  const current = Number(volumeSlider?.value ?? 0);
  if (current > 0) {
    previousVolume = current;
    if (volumeSlider) volumeSlider.value = '0';
  } else {
    if (volumeSlider) volumeSlider.value = String(previousVolume || 70);
  }
  updateVolume();
}

if (volumeSlider) {
  volumeSlider.value = String(Math.round(CONFIG.defaultVolume * 100));
  volumeSlider.addEventListener('input', updateVolume);
  volumeSlider.addEventListener('change', updateVolume);
  updateVolume();
}

if (volumeMuteBtn) {
  volumeMuteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMute();
  });
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

const particles = Array.from({ length: 110 }, () => ({
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
const INTRO_LENGTH = 10.0; // 10-second cinematic sequence
const FLASHES = [
  { at: 2.10, text: 'TTV/RECOD' },
  { at: 2.80, text: 'RECOD' },
  { at: 3.60, text: 'TTV/RECOD' },
  { at: 4.50, text: 'RECOD' },
  { at: 5.50, text: 'TTV/RECOD' },
  { at: 6.60, text: 'TTV/RECOD' },
  { at: 7.80, text: 'RECOD' },
  { at: 8.90, text: 'TTV/RECOD' },
  { at: 9.40, text: 'RECOD' }
];

let started = false;
let finished = false;
let introStartTime = 0;
let fallbackTimer = null;
const firedFlashes = new Set();

function showFlash(text) {
  if (!flash) return;
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
  if (fallbackTimer) clearTimeout(fallbackTimer);

  if (intro) intro.classList.add('finished');
  if (skipIntroButton) skipIntroButton.hidden = true;

  // Immediately make profile section visible
  if (profile) {
    profile.classList.add('visible');
    profile.setAttribute('aria-hidden', 'false');
  }

  if (profileName) {
    profileName.classList.remove('flicker-in');
    void profileName.offsetWidth;
    profileName.classList.add('flicker-in');

    // Follow-up micro-glitches
    [250, 600, 1000].forEach((d) => {
      window.setTimeout(() => triggerNameBurst(), d);
    });

    // Saint neon reveal
    window.setTimeout(() => {
      saintName?.classList.add('saint-visible');
    }, 1200);

    // Socials & Discord connect card reveal
    window.setTimeout(() => {
      socials?.classList.add('socials-visible');
      if (discordCard) discordCard.classList.add('discord-visible');
      scheduleRandomNameGlitch();
    }, 1800);
  }
}

function skipIntro() {
  if (!started || finished) return;
  finishIntro();
}

if (skipIntroButton) {
  skipIntroButton.addEventListener('click', (e) => {
    e.stopPropagation();
    skipIntro();
  });
}

function animateIntro() {
  if (finished) return;

  // Hybrid timer: always advances in real-time regardless of network/buffering
  const elapsed = (performance.now() - introStartTime) / 1000;
  const videoTime = (video && !video.paused && !video.seeking) ? (video.currentTime || 0) : 0;
  const t = Math.max(videoTime, elapsed);

  if (introProgressBar) {
    const pct = Math.min(100, (t / INTRO_LENGTH) * 100);
    introProgressBar.style.width = `${pct}%`;
  }

  if (t >= 1.0 && intro) {
    intro.classList.add('video-revealed');
  }

  for (let i = 0; i < FLASHES.length; i++) {
    if (!firedFlashes.has(i) && t >= FLASHES[i].at) {
      firedFlashes.add(i);
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
  introStartTime = performance.now();

  enterButton?.classList.add('hidden');
  loading?.classList.add('hidden');
  if (skipIntroButton) skipIntroButton.hidden = false;

  if (video) {
    video.currentTime = 0;
    video.muted = (Number(volumeSlider?.value ?? 70) === 0);
    updateVolume();

    try {
      await video.play();
    } catch (_) {
      video.muted = true;
      try { await video.play(); } catch (err) {}
    }
    video.classList.add('visible');
  }

  volumeControlWrap?.classList.add('ready');
  animateIntro();

  // Fail-safe timeout: unconditionally reveal details after 10.2s
  fallbackTimer = setTimeout(() => {
    if (!finished) finishIntro();
  }, 10200);
}

video?.addEventListener('loadeddata', () => {
  loading?.classList.add('hidden');
  if (enterButton) enterButton.disabled = false;
});

video?.addEventListener('error', () => {
  if (loading) loading.textContent = 'video failed to load';
});

enterButton?.addEventListener('click', startExperience);

window.addEventListener('keydown', (event) => {
  if (!started && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    startExperience();
  } else if (started && !finished && (event.key === 'Escape' || event.key.toLowerCase() === 's')) {
    skipIntro();
  }
});
