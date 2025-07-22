const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const gameContainer = document.getElementById('game-container');
const scoreCount = document.getElementById('score-count');
const endScreen = document.getElementById('end-screen');
const collectSound = document.getElementById('collect-sound');
const heartAnimation = document.getElementById('heart-animation');
const slideshowImg = document.getElementById('slideshow-img');
const characterDiv = document.getElementById('character');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

const photos = [
  '../photos/photo1.jpg',
  '../photos/photo2.jpg',
  '../photos/photo3.jpg'
];
let photoIndex = 0;
let score = 0;
let gameActive = true;

// Karakter pozisyonu
let characterX = window.innerWidth / 2 - 32;
const characterY = window.innerHeight - 120;
const characterSpeed = 30;

// Aktif kalplerin tutulduğu dizi
let hearts = [];

function updateCharacter() {
  characterDiv.style.left = characterX + 'px';
  characterDiv.style.top = characterY + 'px';
}

function spawnHeart() {
  if (!gameActive) return;
  const heart = document.createElement('div');
  heart.className = 'heart';
  const heartX = Math.random() * (window.innerWidth - 60);
  heart.style.left = heartX + 'px';
  heart.style.top = '-60px';
  gameContainer.appendChild(heart);
  hearts.push({el: heart, x: heartX, y: -60});
}

function moveHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.y += 2; // Düşüş hızı azaltıldı
    h.el.style.top = h.y + 'px';
    // Çarpışma kontrolü
    if (isColliding(h)) {
      collectHeart(h, i);
      continue;
    }
    // Ekrandan çıktıysa sil
    if (h.y > window.innerHeight) {
      if (gameContainer.contains(h.el)) gameContainer.removeChild(h.el);
      hearts.splice(i, 1);
    }
  }
}

function isColliding(heartObj) {
  const heartRect = heartObj.el.getBoundingClientRect();
  const charRect = characterDiv.getBoundingClientRect();
  return !(
    heartRect.right < charRect.left ||
    heartRect.left > charRect.right ||
    heartRect.bottom < charRect.top ||
    heartRect.top > charRect.bottom
  );
}

function collectHeart(heartObj, idx) {
  // Efekt
  heartObj.el.style.transition = 'transform 0.3s, opacity 0.3s';
  heartObj.el.style.transform = 'scale(1.5) rotate(-20deg)';
  heartObj.el.style.opacity = '0';
  // Ses
  collectSound.currentTime = 0;
  collectSound.play();
  setTimeout(() => {
    if (gameContainer.contains(heartObj.el)) {
      gameContainer.removeChild(heartObj.el);
    }
  }, 250);
  hearts.splice(idx, 1);
  score++;
  scoreCount.textContent = score;
  if (score >= 5) {
    endGame();
  }
}

function startGame() {
  score = 0;
  scoreCount.textContent = score;
  gameActive = true;
  startScreen.style.display = 'none';
  endScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  characterX = window.innerWidth / 2 - 32;
  updateCharacter();
  hearts = [];
  // Tüm eski kalpleri sil
  document.querySelectorAll('.heart').forEach(h => h.remove());
  spawnLoop();
  gameLoop();
}

function spawnLoop() {
  if (!gameActive) return;
  spawnHeart();
  setTimeout(spawnLoop, 700 + Math.random() * 600);
}

function gameLoop() {
  if (!gameActive) return;
  moveHearts();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameActive = false;
  setTimeout(() => {
    gameContainer.style.display = 'none';
    endScreen.style.display = 'flex';
    startHeartAnimation();
    startSlideshow();
  }, 600);
}

// Karakter hareketi
window.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  if (e.key === 'ArrowLeft') {
    characterX = Math.max(0, characterX - characterSpeed);
    updateCharacter();
  } else if (e.key === 'ArrowRight') {
    characterX = Math.min(window.innerWidth - 64, characterX + characterSpeed);
    updateCharacter();
  }
});

// Touch/swipe controls
let touchStartX = 0;
let touchEndX = 0;

gameContainer.addEventListener('touchstart', (e) => {
  if (!gameActive) return;
  touchStartX = e.touches[0].clientX;
});

gameContainer.addEventListener('touchend', (e) => {
  if (!gameActive) return;
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  const minSwipeDistance = 30;
  
  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Swipe right
      characterX = Math.min(window.innerWidth - 64, characterX + characterSpeed);
    } else {
      // Swipe left
      characterX = Math.max(0, characterX - characterSpeed);
    }
    updateCharacter();
  }
}

// Responsive için karakter ve kalpleri yeniden konumlandır
window.addEventListener('resize', () => {
  characterX = window.innerWidth / 2 - 32;
  updateCharacter();
});

// Karakteri başta konumlandır
characterDiv.style.position = 'absolute';
updateCharacter();

// Kalp animasyonu (placeholder)
function startHeartAnimation() {
  heartAnimation.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.top = Math.random() * 100 + 'vh';
    h.style.opacity = 0.2 + Math.random() * 0.5;
    h.style.transform = `scale(${0.7 + Math.random() * 1.2})`;
    h.style.animation = `floatHeart ${2 + Math.random() * 3}s ease-in-out infinite`;
    heartAnimation.appendChild(h);
  }
}

// Fotoğraf slaytı
function startSlideshow() {
  photoIndex = 0;
  slideshowImg.src = photos[photoIndex];
  setInterval(() => {
    photoIndex = (photoIndex + 1) % photos.length;
    slideshowImg.src = photos[photoIndex];
  }, 2500);
}

// Mobile control event listeners
leftBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameActive) return;
  characterX = Math.max(0, characterX - characterSpeed);
  updateCharacter();
});

rightBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameActive) return;
  characterX = Math.min(window.innerWidth - 64, characterX + characterSpeed);
  updateCharacter();
});

// Also handle mouse clicks for testing on desktop
leftBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!gameActive) return;
  characterX = Math.max(0, characterX - characterSpeed);
  updateCharacter();
});

rightBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!gameActive) return;
  characterX = Math.min(window.innerWidth - 64, characterX + characterSpeed);
  updateCharacter();
});

// Play button event listener
playButton.addEventListener('click', startGame);

// Oyun başlatma yerine start screen göster
window.onload = function() {
  startScreen.style.display = 'flex';
  gameContainer.style.display = 'none';
  endScreen.style.display = 'none';
};

// Ekstra kalp animasyonu için CSS
const style = document.createElement('style');
style.innerHTML = `
@keyframes floatHeart {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
}`;
document.head.appendChild(style); 