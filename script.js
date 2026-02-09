
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation
    AOS.init({
        duration: 1000,
        once: false, // Animation happens every time you scroll
        mirror: true
    });

    // Populate Content from Data
    initializeContent();

    // Event Listeners
    setupEventListeners();

    // Start Particles
    createParticles();
});

function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 20; // Number of particles
    const icons = ['❤️', '✨', '💖', '🌟', '🦋'];

    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = icons[Math.floor(Math.random() * icons.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 4) + 's'; // 4-7s duration
        p.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
        container.appendChild(p);

        // Remove after animation
        setTimeout(() => {
            p.remove();
        }, 7000);
    }, 500); // New particle every 500ms
}

function initializeContent() {
    // 1. Set Surprise Text
    document.getElementById('surprise-text').textContent = appData.surprise.text;

    // 2. Set Greetings
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "صباح الخير يا" : "مساء النور يا";
    document.getElementById('greeting-name').textContent = `${greeting} ${appData.main.partnerName}`;
    document.getElementById('daily-quote').textContent = `"${appData.main.dailyQuote}"`;

    // 3. Start Love Counter
    startLoveCounter();

    // 4. Load Messages (With Typewriter Logic preparation)
    const messagesList = document.getElementById('messages-list');
    appData.messages.forEach((msg, index) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-card';
        msgDiv.setAttribute('data-aos', 'fade-up');
        msgDiv.setAttribute('data-aos-delay', index * 100);
        msgDiv.innerHTML = `
            <div class="message-header">
                <span>${msg.title}</span>
                <small>${msg.date}</small>
            </div>
            <div class="message-preview">${msg.content.substring(0, 50)}...</div>
            <div class="message-full" id="msg-full-${index}"></div> <!-- Empty for Typewriter -->
        `;
        msgDiv.addEventListener('click', () => {
            // Toggle logic with Typewriter effect
            if (!msgDiv.classList.contains('open')) {
                document.querySelectorAll('.message-card').forEach(c => c.classList.remove('open')); // Close others
                msgDiv.classList.add('open');
                const contentContainer = document.getElementById(`msg-full-${index}`);
                contentContainer.innerHTML = ''; // Clear prev
                contentContainer.style.display = 'block'; // Make visible
                typeWriter(msg.content, contentContainer);
            } else {
                msgDiv.classList.remove('open');
                document.getElementById(`msg-full-${index}`).style.display = 'none';
            }
        });
        messagesList.appendChild(msgDiv);


    });

    // 5. Load Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    appData.gallery.forEach((photo) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-aos', 'zoom-in');
        item.innerHTML = `
            <img src="${photo.src}" alt="Our Memory">
            <div class="gallery-caption">${photo.caption}</div>
        `;
        galleryGrid.appendChild(item);
    });

    // 6. Load Videos
    const videosGrid = document.getElementById('videos-grid');
    appData.videos.forEach(video => {
        const item = document.createElement('div');
        item.className = 'gallery-item'; // Reusing gallery style
        item.innerHTML = `
            <video controls>
                <source src="${video.src}" type="video/mp4">
                متصفحك لا يدعم الفيديو.
            </video>
            <div class="gallery-caption">${video.caption}</div>
        `;

        // Audio Control Logic
        const vidElement = item.querySelector('video');
        vidElement.onplay = () => {
            const bgMusic = document.getElementById('bg-music');
            if (!bgMusic.paused) {
                bgMusic.pause();
                document.querySelector('.music-control').classList.remove('playing');
                document.querySelector('.music-control button').innerHTML = '<i class="fas fa-play"></i>';
            }
        };

        vidElement.onpause = () => {
            // Optional: Resume music on pause? usually better to let user decide or resume on end.
            // But user asked "when it finishes, music plays".
        };

        vidElement.onended = () => {
            const bgMusic = document.getElementById('bg-music');
            bgMusic.play();
            document.querySelector('.music-control').classList.add('playing');
            document.querySelector('.music-control button').innerHTML = '<i class="fas fa-pause"></i>';
        };

        videosGrid.appendChild(item);
    });

    // 4. Load Reasons
    const reasonsContainer = document.getElementById('reasons-container');
    appData.reasons.forEach((reason, index) => {
        const item = document.createElement('div');
        item.className = 'reason-card';
        item.setAttribute('data-aos', 'flip-left');
        item.setAttribute('data-aos-delay', index * 100);
        item.innerHTML = `<p>❤️ ${reason}</p>`;
        reasonsContainer.appendChild(item);
    });
}

// Typewriter Utility
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.innerHTML = '<span class="typewriter-text"></span>';
    const span = element.querySelector('.typewriter-text');

    function type() {
        if (i < text.length) {
            span.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after finishing
            span.style.borderLeft = 'none';
        }
    }
    type();
}

// Love Counter Logic
function startLoveCounter() {
    const startDate = new Date(appData.main.startDate);

    function update() {
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) return; // Future date protection

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        // Seconds removed as requested

        document.getElementById('years').innerText = years;
        document.getElementById('months').innerText = months;
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
    }

    setInterval(update, 60000); // Update every minute instead of second
    update(); // Initial call
}

// Love Calculator Logic
window.calculateLove = function () {
    const resultDiv = document.getElementById('love-result');
    const percentageSpan = document.getElementById('love-percentage');
    const messageP = document.getElementById('love-message');

    resultDiv.classList.add('show'); // Use new animation class
    resultDiv.classList.remove('hidden'); // Just in case
    let percentage = 0;

    const interval = setInterval(() => {
        percentage += Math.floor(Math.random() * 5);
        if (percentage >= 100) {
            percentage = 100; // Limit for visual, then set infinity
            clearInterval(interval);

            // Final Result
            percentageSpan.innerHTML = "∞%"; // Infinity Symbol
            messageP.innerHTML = "حبنا ملوش آخر.. إحنا روح واحدة في جسدين ❤️✨";

            // Celebration Effects
            createParticles();

            // Add extra heart pulses
            const pulse = setInterval(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.bottom = '0';
                heart.style.fontSize = Math.random() * 30 + 20 + 'px';
                heart.style.animation = 'floatUp 4s linear forwards';
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 4000);
            }, 300);

            // Stop extra hearts after 5 seconds
            setTimeout(() => clearInterval(pulse), 5000);

        } else {
            percentageSpan.innerHTML = percentage + "%";
        }
    }, 50);
}

function setupEventListeners() {
    // Password Check (Auto music play included)
    window.checkPassword = function () {
        const day = document.getElementById('day-input').value.padStart(2, '0');
        const month = document.getElementById('month-input').value.padStart(2, '0');
        const year = document.getElementById('year-input').value;

        const input = `${day}${month}${year}`;
        const errorMsg = document.getElementById('error-message');

        if (input === appData.auth.password) {
            // Success Animation
            document.querySelector('.login-container').innerHTML = `
                <div style="font-size: 4rem; animation: bg-music 1s infinite alternate;">💖</div>
                <h2 style="color:var(--primary-color)">بحبك...</h2>
            `;

            // Play Music Immediately
            tryPlayMusic();

            setTimeout(() => {
                document.getElementById('login-section').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('login-section').classList.add('hidden');
                    document.getElementById('main-app').classList.remove('hidden');
                }, 1000);
            }, 1000);

        } else {
            errorMsg.textContent = appData.auth.errorMessage;
            document.querySelector('.input-group').classList.add('shake');
            setTimeout(() => document.querySelector('.input-group').classList.remove('shake'), 500);
        }
    };

    // Navigation
    window.showSection = function (sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        // Show target
        document.getElementById(sectionId).classList.add('active');
    };

    // Music Toggle
    window.toggleMusic = function () {
        const audio = document.getElementById('bg-music');
        const btn = document.querySelector('.music-control button');

        if (audio.paused) {
            audio.play();
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            document.querySelector('.music-control').classList.add('playing');
        } else {
            audio.pause();
            btn.innerHTML = '<i class="fas fa-music"></i>';
            document.querySelector('.music-control').classList.remove('playing');
        }
    };

    // Prank logic removed
}


function tryPlayMusic() {
    const audio = document.getElementById('bg-music');
    audio.src = appData.main.bgMusic;
    // Attempt play
    audio.play().then(() => {
        document.getElementById('music-control').classList.remove('hidden');
        document.querySelector('.music-control button').innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.music-control').classList.add('playing');
    }).catch(err => {
        console.log("Auto-play prevented.", err);
        // Show control anyway so user can click
        document.getElementById('music-control').classList.remove('hidden');
    });
}

// Shake Animation (injected via JS for robustness)
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(5px); }
    50% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}
.shake { animation: shake 0.3s; }
`;
document.head.appendChild(style);
