import { content } from './content.js';

const passwordScreen = document.getElementById('password-screen');
const appScreen = document.getElementById('app-screen');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const passwordMessage = document.getElementById('password-message');
const heroTitle = document.getElementById('hero-title');
const heroText = document.getElementById('hero-text');
const heroStart = document.getElementById('hero-start');
const introTitle = document.getElementById('intro-title');
const introText = document.getElementById('intro-text');
const photoCarouselsTitle = document.getElementById('photo-carousels-title');
const photoCarouselsText = document.getElementById('photo-carousels-text');
const photoCarouselsList = document.getElementById('photo-carousels-list');
const couponList = document.getElementById('coupon-list');
const finalLetter = document.getElementById('final-letter');
const finalButton = document.getElementById('final-button');
const finalResponse = document.getElementById('final-response');
const heartLayer = document.getElementById('heart-layer');

// Audio player elements
const audioPlayer = document.getElementById('audio-player');
const audioToggle = document.getElementById('audio-toggle');
const audioTitle = document.getElementById('audio-title');
const audioArtist = document.getElementById('audio-artist');
const audioProgress = document.getElementById('audio-progress');
const audioCurrentTime = document.getElementById('audio-current-time');
const audioDuration = document.getElementById('audio-duration');
const audioStatus = document.getElementById('audio-status');

let audio;
let isPlaying = false;
let couponState = [];
let isSeeking = false;

const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, '');

const isUnlocked = () => localStorage.getItem(content.passwordStorageKey) === 'true';

const setUnlocked = () => localStorage.setItem(content.passwordStorageKey, 'true');

const loadCouponState = () => {
  const stored = localStorage.getItem(content.couponsStorageKey);
  if (!stored) {
    couponState = content.coupons.map(() => false);
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length === content.coupons.length) {
      couponState = parsed;
    } else {
      couponState = content.coupons.map(() => false);
    }
  } catch {
    couponState = content.coupons.map(() => false);
  }
};

const saveCouponState = () => {
  localStorage.setItem(content.couponsStorageKey, JSON.stringify(couponState));
};

const setMessage = (text, isError = false) => {
  passwordMessage.textContent = text;
  passwordMessage.style.color = isError ? '#a0485a' : '#79515a';
};

const handleImageError = (event) => {
  const img = event.target;
  img.classList.add('image-fallback');
  const placeholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="100%" height="100%" fill="#f7e3e6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" fill="#9d6a74">Foto não disponível</text></svg>`
  )}`;
  img.src = placeholder;
};

const addHearts = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < 5; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    const left = 20 + i * 16;
    heart.style.left = `${left}%`;
    heart.style.animationDelay = `${i * 120}ms`;
    heartLayer.appendChild(heart);

    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }
};

const renderHero = () => {
  heroTitle.textContent = content.hero.title;
  heroText.textContent = content.hero.text;
  heroStart.textContent = content.hero.startButton;
  if (audioTitle) audioTitle.textContent = content.music?.title || content.music?.label || 'Nossa música';
  if (audioArtist) audioArtist.textContent = content.music?.artist || '';
};

const renderIntro = () => {
  introTitle.textContent = content.intro.title;
  introText.textContent = content.intro.text;
};

const renderPhotoCarousels = () => {
  photoCarouselsList.innerHTML = '';
  if (!Array.isArray(content.photoCarousels) || content.photoCarousels.length === 0) {
    return;
  }

  photoCarouselsTitle.textContent = content.photoCarouselsIntro?.title || 'Nossas fotos';
  photoCarouselsText.textContent = content.photoCarouselsIntro?.text || 'Separei algumas memórias em pedacinhos, do jeito que elas ficaram guardadas.';

  content.photoCarousels.forEach((album) => {
    const albumCard = document.createElement('article');
    albumCard.className = 'album-card';

    const albumHeader = document.createElement('div');
    albumHeader.className = 'album-header';
    const albumTitle = document.createElement('h3');
    albumTitle.textContent = album.title;
    const albumSubtitle = document.createElement('p');
    albumSubtitle.textContent = album.subtitle;
    albumHeader.append(albumTitle, albumSubtitle);

    const carouselShell = document.createElement('div');
    carouselShell.className = 'carousel-shell';

    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.setAttribute('aria-label', `${album.title} carrossel de fotos`);
    track.setAttribute('role', 'list');

    album.photos.forEach((photo) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.setAttribute('role', 'listitem');

      const img = document.createElement('img');
      img.className = 'carousel-image';
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = 'lazy';
      img.addEventListener('error', handleImageError);

      const caption = document.createElement('p');
      caption.className = 'carousel-caption';
      caption.textContent = photo.caption;

      slide.appendChild(img);
      slide.appendChild(caption);
      track.appendChild(slide);
    });

    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    const counter = document.createElement('span');
    counter.className = 'carousel-counter';
    counter.textContent = `1 / ${album.photos.length}`;

    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button secondary';
    prevButton.type = 'button';
    prevButton.textContent = 'Anterior';
    prevButton.disabled = true;

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button secondary';
    nextButton.type = 'button';
    nextButton.textContent = 'Próxima';
    nextButton.disabled = album.photos.length <= 1;

    controls.append(prevButton, counter, nextButton);
    carouselShell.appendChild(track);
    albumCard.append(albumHeader, carouselShell, controls);
    photoCarouselsList.appendChild(albumCard);

    const slides = Array.from(track.children);
    let currentIndex = 0;

    const updateCarousel = () => {
      const width = track.clientWidth;
      if (!width) return;
      const index = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / width)));
      currentIndex = index;
      prevButton.disabled = index === 0;
      nextButton.disabled = index === slides.length - 1;
      counter.textContent = `${index + 1} / ${slides.length}`;
    };

    const scrollToIndex = (index) => {
      const slide = slides[index];
      if (!slide) return;
      slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    prevButton.addEventListener('click', () => {
      if (currentIndex === 0) return;
      scrollToIndex(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex >= slides.length - 1) return;
      scrollToIndex(currentIndex + 1);
    });

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateCarousel);
    });

    updateCarousel();
  });
};

const renderCoupons = () => {
  couponList.innerHTML = '';
  content.coupons.forEach((coupon, index) => {
    const card = document.createElement('div');
    card.className = 'coupon-card';
    const title = document.createElement('h3');
    title.textContent = coupon.title;
    const description = document.createElement('p');
    description.textContent = coupon.description;
    const button = document.createElement('button');
    const redeemed = Boolean(couponState[index]);
    button.textContent = redeemed ? 'Resgatado ❤️' : 'Resgatar';
    button.disabled = redeemed;
    button.type = 'button';
    button.addEventListener('click', () => {
      couponState[index] = true;
      saveCouponState();
      renderCoupons();
    });
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);
    couponList.appendChild(card);
  });
};

const renderLetter = () => {
  finalLetter.textContent = content.finalLetter.trim();
  finalButton.textContent = content.final.buttonText;
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const updateAudioPlayer = () => {
  if (!audio) return;

  // Button
  if (audioToggle) {
    audioToggle.textContent = isPlaying ? '❚❚' : '▶';
    const aria = isPlaying ? (content.music.pauseLabel || 'Pausar música') : (content.music.playLabel || 'Tocar música');
    audioToggle.setAttribute('aria-label', aria);
  }

  // Times and progress
  const current = audio.currentTime;
  const duration = audio.duration;
  if (audioCurrentTime) audioCurrentTime.textContent = formatTime(current);
  if (audioDuration) audioDuration.textContent = Number.isFinite(duration) ? formatTime(duration) : '0:00';

  if (audioProgress && !isSeeking) {
    const percent = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;
    audioProgress.value = percent;
  }
};

const initAudio = () => {
  if (!content.music || !content.music.enabled || !content.music.src) {
    if (audioPlayer) audioPlayer.style.display = 'none';
    return;
  }

  if (audioTitle) audioTitle.textContent = content.music.title || content.music.label || '';
  if (audioArtist) audioArtist.textContent = content.music.artist || '';

  audio = new Audio(content.music.src);
  audio.preload = 'metadata';
  audio.loop = true;

  audio.addEventListener('loadedmetadata', () => {
    updateAudioPlayer();
  });

  audio.addEventListener('timeupdate', () => {
    updateAudioPlayer();
  });

  audio.addEventListener('play', () => {
    isPlaying = true;
    updateAudioPlayer();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updateAudioPlayer();
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    audio.currentTime = 0;
    updateAudioPlayer();
  });

  audio.addEventListener('error', () => {
    if (audioToggle) audioToggle.disabled = true;
    if (audioStatus) audioStatus.textContent = content.music.unavailableLabel || 'Áudio indisponível';
    if (audioPlayer) audioPlayer.classList.add('is-error');
  });
};

const toggleAudio = async () => {
  if (!audio) return;
  try {
    if (audio.paused) {
      await audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
    updateAudioPlayer();
  } catch (e) {
    if (audioStatus) audioStatus.textContent = content.music.unavailableLabel || 'Áudio indisponível';
    if (audioToggle) audioToggle.disabled = true;
  }
};

const handleProgressInput = () => {
  if (!audio || !audioProgress) return;
  isSeeking = true;
  const percent = Number(audioProgress.value);
  const duration = audio.duration;
  const newTime = Number.isFinite(duration) && duration > 0 ? (percent / 100) * duration : 0;
  if (audioCurrentTime) audioCurrentTime.textContent = formatTime(newTime);
};

const handleProgressChange = () => {
  if (!audio || !audioProgress) return;
  const percent = Number(audioProgress.value);
  const duration = audio.duration;
  const newTime = Number.isFinite(duration) && duration > 0 ? (percent / 100) * duration : 0;
  isSeeking = false;
  audio.currentTime = newTime;
  updateAudioPlayer();
};

const showApp = () => {
  passwordScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  renderHero();
  renderIntro();
  renderPhotoCarousels();
  renderCoupons();
  renderLetter();
  updateMusicButton();
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const handlePasswordSubmit = (event) => {
  event.preventDefault();
  const entered = normalize(passwordInput.value);
  const valid = content.acceptedPasswords.some((password) => normalize(password) === entered);

  if (valid) {
    setUnlocked();
    setMessage('Bem-vindo ao nosso cantinho.', false);
    showApp();
  } else {
    setMessage('Quase lá. Tenta de novo com carinho.', true);
    passwordInput.value = '';
    passwordInput.focus();
  }
};

const handleFinalClick = () => {
  finalResponse.textContent = content.final.response;
  addHearts();
};

const initEvents = () => {
  passwordForm.addEventListener('submit', handlePasswordSubmit);
  heroStart.addEventListener('click', () => {
    document.getElementById('intro').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (audioToggle) audioToggle.addEventListener('click', toggleAudio);
  if (audioProgress) {
    audioProgress.addEventListener('input', handleProgressInput);
    audioProgress.addEventListener('change', handleProgressChange);
  }
  finalButton.addEventListener('click', handleFinalClick);
};

const init = () => {
  document.title = content.appTitle;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#fff6f7');
  initAudio();
  loadCouponState();
  initEvents();

  if (isUnlocked()) {
    showApp();
  } else {
    passwordScreen.classList.remove('hidden');
    passwordInput.focus();
  }
};

init();
