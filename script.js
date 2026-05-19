// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 1500);
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 80);
});

document.querySelectorAll('a, button, .card-3d, .project-card-3d, .achievement-card, input, textarea, .hobby-cube').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) item.classList.add('active');
    });
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) navLinks.classList.remove('active');
    });
});

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
const roles = ['Full Stack Web Designer', 'UI/UX Designer', 'Creative Developer', '3D Web Artist'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const current = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }
    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === current.length) {
        delay = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 500;
    }
    setTimeout(typeEffect, delay);
}
typeEffect();

// ===== 3D BACKGROUND PARTICLES (Three.js) =====
const bgCanvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const particlesGeo = new THREE.BufferGeometry();
const particleCount = 1500;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i+1] = (Math.random() - 0.5) * 50;
    positions[i+2] = (Math.random() - 0.5) * 50;

    const palette = [[0.39, 0.4, 0.94], [0.92, 0.28, 0.6], [0.02, 0.71, 0.83]];
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i] = c[0]; colors[i+1] = c[1]; colors[i+2] = c[2];
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, sizeAttenuation: true
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// 3D shapes
const shapes = [];
for (let i = 0; i < 12; i++) {
    let geo;
    const type = i % 4;
    if (type === 0) geo = new THREE.IcosahedronGeometry(0.7, 0);
    else if (type === 1) geo = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    else if (type === 2) geo = new THREE.OctahedronGeometry(0.7, 0);
    else geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);

    const colorChoices = [0x6366f1, 0xec4899, 0x06b6d4, 0x10b981];
    const mat = new THREE.MeshBasicMaterial({
        color: colorChoices[i % colorChoices.length],
        wireframe: true, transparent: true, opacity: 0.4
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 5
    );
    shapes.push(mesh);
    scene.add(mesh);
}

camera.position.z = 10;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
});

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0004;
    shapes.forEach((s, i) => {
        s.rotation.x += 0.005 + i * 0.0003;
        s.rotation.y += 0.007 + i * 0.0002;
    });
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== SKILLS - FALLING BALLS (Custom Canvas Physics) =====
(function () {
    const canvas = document.getElementById('skills-canvas');
    const ctx = canvas.getContext('2d');

    const skills = [
        { name: 'HTML',       color: '#e34c26' },
        { name: 'CSS',        color: '#264de4' },
        { name: 'JS',         color: '#f7df1e' },
        { name: 'React',      color: '#61dafb' },
        { name: 'Node.js',    color: '#68a063' },
        { name: 'Express',    color: '#cccccc' },
        { name: 'MongoDB',    color: '#47a248' },
        { name: 'Redux',      color: '#764abc' },
        { name: 'Bootstrap',  color: '#7952b3' },
        { name: 'REST API',   color: '#06b6d4' },
        { name: 'Git',        color: '#f05032' },
        { name: 'Firebase',   color: '#ffca28' },
        { name: 'Next.js',    color: '#aaaaff' },
        { name: 'TypeScript', color: '#3178c6' },
        { name: 'Photoshop',  color: '#31a8ff' },
        { name: 'Premiere',   color: '#ea77ff' },
        { name: 'Figma',      color: '#a259ff' },
        { name: 'Three.js',   color: '#6366f1' }
    ];

    let W, H, balls = [], dragging = null, dragOffX = 0, dragOffY = 0;
    const GRAVITY = 0.35;
    const DAMPING = 0.72;
    const FRICTION = 0.988;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        W = canvas.width  = Math.max(rect.width  || canvas.offsetWidth  || 480, 100);
        H = canvas.height = Math.max(rect.height || canvas.offsetHeight || 550, 100);
        // Re-clamp all balls inside new bounds
        balls.forEach(b => {
            if (b.x + b.r > W) b.x = W - b.r;
            if (b.x - b.r < 0) b.x = b.r;
            if (b.y + b.r > H) b.y = H - b.r;
        });
    }

    function spawnBalls() {
        balls = [];
        skills.forEach((sk, i) => {
            const r = 36 + Math.random() * 12;
            balls.push({
                x: r + Math.random() * Math.max(W - r * 2, 10),
                y: -r * 2 - i * 90,          // stagger spawn above canvas
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 1.5,
                r,
                skill: sk,
                angle: 0,
                angularV: (Math.random() - 0.5) * 0.04
            });
        });
    }

    function drawBall(b) {
        const { x, y, r, skill } = b;
        const col = skill.color;

        ctx.save();
        ctx.translate(x, y);

        // --- subtle translucent fill (15% opacity of skill color) ---
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = col + '26'; // hex alpha ~15%
        ctx.fill();

        // --- outer glow ring ---
        const grad = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r + 6);
        grad.addColorStop(0, col + '00');
        grad.addColorStop(1, col + '55');
        ctx.beginPath();
        ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // --- main outline stroke ---
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = col;
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // --- inner highlight arc ---
        ctx.beginPath();
        ctx.arc(-r * 0.28, -r * 0.3, r * 0.38, Math.PI * 1.1, Math.PI * 1.85);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // --- skill name text ---
        const fontSize = r > 44 ? 13 : 11;
        ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = col;
        ctx.fillText(skill.name, 0, 0);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    function resolveCollision(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.r + b.r;
        if (dist >= minDist || dist === 0) return;

        // Separate overlapping balls
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist, ny = dy / dist;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        // Exchange velocity components along collision normal
        const dvx = a.vx - b.vx;
        const dvy = a.vy - b.vy;
        const dot = dvx * nx + dvy * ny;
        if (dot > 0) return; // already separating
        const restitution = 0.55;
        const impulse = (1 + restitution) * dot / 2;
        a.vx -= impulse * nx;
        a.vy -= impulse * ny;
        b.vx += impulse * nx;
        b.vy += impulse * ny;
    }

    function update() {
        balls.forEach(b => {
            if (b === dragging) return;

            b.vy += GRAVITY;
            b.vx *= FRICTION;
            b.vy *= FRICTION;
            b.x += b.vx;
            b.y += b.vy;
            b.angle += b.angularV;

            // Floor
            if (b.y + b.r > H) {
                b.y = H - b.r;
                b.vy *= -DAMPING;
                b.vx *= 0.92;
                if (Math.abs(b.vy) < 0.4) b.vy = 0;
            }
            // Ceiling
            if (b.y - b.r < 0) {
                b.y = b.r;
                b.vy *= -DAMPING;
            }
            // Left wall
            if (b.x - b.r < 0) {
                b.x = b.r;
                b.vx *= -DAMPING;
            }
            // Right wall
            if (b.x + b.r > W) {
                b.x = W - b.r;
                b.vx *= -DAMPING;
            }
        });

        // Ball-ball collisions
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(balls[i], balls[j]);
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        update();
        balls.forEach(drawBall);
        requestAnimationFrame(loop);
    }

    // ---- Mouse / Touch interaction ----
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }

    function onDown(e) {
        const { x, y } = getPos(e);
        // Pick topmost ball under cursor
        for (let i = balls.length - 1; i >= 0; i--) {
            const b = balls[i];
            const dx = b.x - x, dy = b.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < b.r) {
                dragging = b;
                dragOffX = dx; dragOffY = dy;
                b.vx = 0; b.vy = 0;
                canvas.style.cursor = 'grabbing';
                e.preventDefault();
                break;
            }
        }
    }

    function onMove(e) {
        if (!dragging) return;
        const { x, y } = getPos(e);
        dragging.vx = x + dragOffX - dragging.x;
        dragging.vy = y + dragOffY - dragging.y;
        dragging.x = x + dragOffX;
        dragging.y = y + dragOffY;
        e.preventDefault();
    }

    function onUp() {
        dragging = null;
        canvas.style.cursor = 'grab';
    }

    // Click-to-scatter
    canvas.addEventListener('click', (e) => {
        const { x, y } = getPos(e);
        balls.forEach(b => {
            const dx = b.x - x, dy = b.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                const f = 5 / Math.max(dist, 20);
                b.vx += dx * f;
                b.vy += dy * f - 3;
            }
        });
    });

    canvas.addEventListener('mousedown',  onDown, { passive: false });
    canvas.addEventListener('mousemove',  onMove, { passive: false });
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove',  onMove, { passive: false });
    canvas.addEventListener('touchend',   onUp);

    // Prevent page scroll when interacting with canvas
    canvas.addEventListener('wheel', e => e.preventDefault(), { passive: false });

    // Init
    resize();
    spawnBalls();
    loop();

    window.addEventListener('resize', () => {
        clearTimeout(window._skillsRT);
        window._skillsRT = setTimeout(resize, 150);
    });
})();

// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Section titles
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 80%', toggleActions: 'play none none reverse' },
        y: 80, opacity: 0, duration: 1, ease: 'power3.out'
    });
});

// About
gsap.from('.about-image-card', {
    scrollTrigger: { trigger: '.about', start: 'top 70%' },
    x: -100, opacity: 0, duration: 1.2, ease: 'power3.out'
});
gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about', start: 'top 70%' },
    x: 100, opacity: 0, duration: 1.2, ease: 'power3.out'
});

// Timeline
gsap.utils.toArray('.timeline-item').forEach(item => {
    const isLeft = item.classList.contains('left');
    gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' },
        x: isLeft ? -100 : 100, opacity: 0, duration: 1, ease: 'power3.out'
    });
});

// Projects
gsap.utils.toArray('.project-card-3d').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        y: 80, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'back.out(1.5)'
    });
});

// Achievements
gsap.utils.toArray('.achievement-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        scale: 0.5, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'back.out(1.7)'
    });
});

// Skill bars
gsap.utils.toArray('.fill').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    ScrollTrigger.create({
        trigger: bar, start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: width, duration: 1.5, ease: 'power2.out' })
    });
});

// Hobbies
gsap.from('.hobby-cube', {
    scrollTrigger: { trigger: '.hobbies', start: 'top 70%' },
    scale: 0, rotation: 360, opacity: 0, duration: 1.2, ease: 'back.out(1.7)'
});
gsap.utils.toArray('.hobby-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: { trigger: '.hobbies', start: 'top 70%' },
        x: 50, opacity: 0, duration: 0.6, delay: i * 0.1
    });
});

// Contact
gsap.from('.contact-info', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    x: -80, opacity: 0, duration: 1
});
gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    x: 80, opacity: 0, duration: 1
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-count');
            const duration = 2000;
            const startTime = performance.now();
            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * eased) + '+';
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== PROJECT CARD 3D TILT =====
document.querySelectorAll('.project-card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        // Don't override the flip rotation on hover - this is just for subtle tilt
    });
});

// ===== ACHIEVEMENT CARDS 3D TILT =====
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = `translateY(-15px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== HOBBY CUBE DRAG =====
const hobbyCube = document.querySelector('.hobby-cube');
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let cubeRotX = 0, cubeRotY = 0;

if (hobbyCube) {
    hobbyCube.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        hobbyCube.style.animation = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        cubeRotY += (e.clientX - dragStartX) * 0.5;
        cubeRotX -= (e.clientY - dragStartY) * 0.5;
        hobbyCube.style.transform = `rotateX(${cubeRotX}deg) rotateY(${cubeRotY}deg)`;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
    });
});

// ===== PARALLAX HERO SHAPES =====
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    document.querySelectorAll('.shape').forEach((shape, i) => {
        const factor = (i + 1) * 0.5;
        shape.style.transform = `translate(${x * factor}px, ${y * factor}px) rotate(${x * factor}deg)`;
    });
});

function sendwhatsapp(event) {
    event.preventDefault();

    const name    = document.querySelector(".name").value.trim();
    const number  = document.querySelector(".number").value.trim();
    const message = document.querySelector(".message").value.trim();

    const text = `Name: ${name}%0APhone: ${number}%0AMessage: ${message}`;
    const url  = `https://wa.me/6379981170?text=${encodeURIComponent(`Name: ${name}\nPhone: ${number}\nMessage: ${message}`)}`;

    window.open(url, "_blank");

    document.querySelector(".name").value    = "";
    document.querySelector(".number").value  = "";
    document.querySelector(".message").value = "";
}

console.log('%c🚀 Azhaghiri V - 3D Portfolio', 'background: linear-gradient(135deg, #6366f1, #ec4899); color: white; padding: 10px 20px; font-size: 18px; font-weight: bold; border-radius: 5px;');
console.log('%cCrafted with passion ❤️', 'color: #06b6d4; font-size: 14px;');
