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
  clipsAdmin: 'https://clips.sa1nt.xyz/admin',
  defaultVolume: 0.70,
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
  [250, 540, 830, 1950].forEach((delay) => {
    window.setTimeout(() => triggerNameFlicker(), delay);
  });
}

// Add a real website button for the clip admin suite once the profile is revealed.
function setupClipsAdminButton() {
  const profileWrap = document.querySelector('.profile-wrap');
  if (!profileWrap || document.getElementById('clipsAdminButton')) return;

  const button = document.createElement('a');
  button.id = 'clipsAdminButton';
  button.className = 'clips-admin-button';
  button.href = CONFIG.clipsAdmin;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.innerHTML = '<span>CLIPS ADMIN</span><span class="clips-admin-arrow">↗</span>';
  profileWrap.appendChild(button);
}

setupClipsAdminButton();

function finishIntro() {
  if (finished) return;
  finished = true;
  intro.classList.add('finished');
  skipIntroButton.hidden = true;
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
        document.getElementById('clipsAdminButton')?.classList.add('visible');
        scheduleRandomNameGlitch();
      }, 3000);
    }
  }, 120);
}

// Proper in-page Skip Intro button. It is not a browser control or notification.
const skipIntroButton = document.createElement('button');
skipIntroButton.type = 'button';
skipIntroButton.id = 'skipIntroButton';
skipIntroButton.className = 'skip-intro-button';
skipIntroButton.textContent = 'SKIP INTRO';
skipIntroButton.setAttribute('aria-label', 'Skip intro');
skipIntroButton.hidden = true;
skipIntroButton.style.pointerEvents = 'auto';
intro.appendChild(skipIntroButton);

const skipIntroStyle = document.createElement('style');
skipIntroStyle.textContent = `
  #skipIntroButton.skip-intro-button {
    position: fixed;
    top: 24px;
    left: 24px;
    right: auto;
    bottom: auto;
    z-index: 1000;
    display: block;
    padding: 11px 18px;
    border: 1px solid rgba(255,255,255,.28);
    border-radius: 999px;
    background: rgba(8,8,8,.72);
    color: #fff;
    font: 700 12px/1 'Space Grotesk', Arial, sans-serif;
    letter-spacing: 1.8px;
    cursor: pointer;
    pointer-events: auto;
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 8px 30px rgba(0,0,0,.45), 0 0 22px rgba(255,30,30,.12);
    transition: transform .2s ease, background .2s ease, border-color .2s ease;
  }
  #skipIntroButton.skip-intro-button:hover {
    transform: translateY(-2px);
    background: rgba(120,0,0,.65);
    border-color: rgba(255,70,70,.65);
  }
  #skipIntroButton.skip-intro-button:active { transform: scale(.96); }
  #skipIntroButton.skip-intro-button:focus-visible {
    outline: 2px solid rgba(255,70,70,.9);
    outline-offset: 3px;
  }
  #skipIntroButton.skip-intro-button[hidden] { display: none !important; }
  .clips-admin-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: fit-content;
    margin: 24px auto 0;
    padding: 11px 17px;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 999px;
    background: rgba(10,10,10,.58);
    color: #fff;
    text-decoration: none;
    font: 700 11px/1 'Space Grotesk', Arial, sans-serif;
    letter-spacing: 1.7px;
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    transition: opacity .45s ease, transform .45s ease, background .2s ease, border-color .2s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .clips-admin-button.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .clips-admin-button:hover {
    background: rgba(120,0,0,.55);
    border-color: rgba(255,70,70,.55);
    transform: translateY(-2px);
  }
  .clips-admin-arrow { font-size: 14px; line-height: 0; }
  @media (max-width: 600px) {
    #skipIntroButton.skip-intro-button {
      top: 16px;
      left: 16px;
      padding: 10px 14px;
      font-size: 11px;
    }
    .clips-admin-button {
      width: 100%;
      max-width: 260px;
    }
  }
`;
document.head.appendChild(skipIntroStyle);

function skipIntro() {
  if (!started || finished) return;
  try {
    video.currentTime = INTRO_LENGTH;
  } catch (_) {}
  introProgressBar.style.width = '100%';
  skipIntroButton.hidden = true;
  finishIntro();
}

skipIntroButton.addEventListener('click', skipIntro);

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
    skipIntroButton.hidden = true;
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
  skipIntroButton.hidden = false;

  video.currentTime = 0;
  video.muted = (Number(volumeSlider?.value ?? 70) === 0);
  updateVolume();

  try {
    await video.play();
  } catch (error) {
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
  if ((event.key === 'Escape' || event.key.toLowerCase() === 's') && started && !finished) {
    skipIntro();
  }
});

profile.classList.remove('visible');
profile.setAttribute('aria-hidden', 'true');
