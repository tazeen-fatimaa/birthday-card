// Elements
const envelopeScreen = document.getElementById('envelope-screen');
const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const messageInput = document.getElementById('message-input');
const doneBtn = document.getElementById('done-btn');
const flipBtn = document.getElementById('flip-btn');
const messageDisplay = document.getElementById('message-display');
const audio = document.getElementById('birthday-audio');
const muteBtn = document.getElementById('mute-btn');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const balloons = document.getElementById('balloons');

// Confetti variables
let confettiParticles = [];
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#e84393', '#00b894'];

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Confetti particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 4 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
            this.y = Math.random() * canvas.height - canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// Create confetti
function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push(new Particle());
    }
}

// Animate confetti
function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateConfetti);
}

// Check for message in URL
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
if (msg) {
    messageDisplay.textContent = decodeURIComponent(msg);
    messageDisplay.style.display = 'block';
    messageInput.style.display = 'none';
    document.getElementById('buttons').style.display = 'none';
    card.classList.add('emerged');
    envelopeScreen.style.display = 'none';
    balloons.style.display = 'block';
    createConfetti();
    animateConfetti();
    audio.play();
}

// Envelope open on tap
envelopeScreen.addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
        card.classList.add('emerged');
        balloons.style.display = 'block';
        envelopeScreen.style.opacity = '0';
        setTimeout(() => {
            envelopeScreen.style.display = 'none';
            createConfetti();
            animateConfetti();
            audio.play();
        }, 500);
    }, 1000);
});

// Card flip
cardFront.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

// Flip to front button
flipBtn.addEventListener('click', () => {
    card.classList.remove('flipped');
});

// Done button
doneBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        messageDisplay.textContent = message;
        messageDisplay.style.display = 'block';
        messageInput.style.display = 'none';
        document.getElementById('buttons').style.display = 'none';
        const encodedMsg = encodeURIComponent(message);
        const shareLink = `${window.location.origin}${window.location.pathname}?msg=${encodedMsg}`;
        navigator.clipboard.writeText(shareLink).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert(`Copy this link: ${shareLink}`);
        });
    }
});

// Mute button
muteBtn.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        muteBtn.textContent = '🔊';
    } else {
        audio.muted = true;
        muteBtn.textContent = '🔇';
    }
});