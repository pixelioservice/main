/* ==========================================================================
   Pixel Io Service - Main JavaScript Application
   Includes: Interactive Pixel-to-3D Canvas, Navigation effects, Hover effects
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initServiceCardHover();
    initScrollReveal();
    initPixelCanvas();
});

/* --- WhatsApp Contact Form Integration --- */
function toggleOtherInput(select) {
    const wrapper = document.getElementById('other-type-wrapper');
    const input   = document.getElementById('other-type');
    if (select.value === 'other') {
        wrapper.style.display = 'block';
        input.required = true;
    } else {
        wrapper.style.display = 'none';
        input.required = false;
        input.value = '';
    }
}


function sendToWhatsApp(event) {
    event.preventDefault();

    const firstName  = document.getElementById('first-name').value.trim();
    const lastName   = document.getElementById('last-name').value.trim();
    const email      = document.getElementById('email').value.trim();
    const phone      = document.getElementById('phone').value.trim();
    const company    = document.getElementById('company').value.trim();
    const typeEl     = document.getElementById('project-type');
    const projectType = typeEl.value === 'other'
        ? 'Other — ' + (document.getElementById('other-type').value.trim() || 'Not specified')
        : typeEl.options[typeEl.selectedIndex].text;
    const budgetEl   = document.querySelector('input[name="budget"]:checked');
    const budget     = budgetEl ? budgetEl.parentElement.querySelector('span').textContent.trim() : 'Not specified';
    const message    = document.getElementById('message').value.trim();
    const now        = new Date();
    const date       = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const wa_number  = '8801575478716'; // +880 15754-78716

    const text = 
`📩 *New Project Inquiry — Pixel Io Service*

📅 *Date:* ${date}
👤 *Name:* ${firstName} ${lastName}
📧 *Email:* ${email}
📞 *Phone Number:* ${phone}
🏢 *Business Name:* ${company}
🖥️ *Type:* ${projectType}
💰 *Budget:* ${budget}
💬 *Comment:*
${message}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${wa_number}?text=${encoded}`, '_blank');
}


/* --- Mobile Navigation & Header Scroll --- */
function initNavigation() {
    const header = document.querySelector('.navbar-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        updateActiveLink();
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav links during scroll
    const sections = document.querySelectorAll('section');
    function updateActiveLink() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 150; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

/* --- Card Spotlight Hover Effect (CSS Variable injection) --- */
function initServiceCardHover() {
    const cards = document.querySelectorAll('.service-card');
    // ensure each card has a decorative underline for hover animation
    cards.forEach(card => {
        if (!card.querySelector('.card-underline')) {
            const underline = document.createElement('span');
            underline.className = 'card-underline';
            card.appendChild(underline);
        }
    });

    cards.forEach(card => {
        let raf = null;
        const innerIcon = card.querySelector('.service-icon > i');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within card
            const y = e.clientY - rect.top;  // y position within card

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Throttle via RAF for smooth transform updates
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rx = ((cy - y) / cy) * 8; // rotateX (invert Y)
                const ry = ((x - cx) / cx) * 10; // rotateY

                card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
                card.style.boxShadow = `0 18px 45px rgba(0,0,0,0.35)`;

                if (innerIcon) {
                    // subtle pop for the icon
                    innerIcon.style.transform = `translateZ(18px) translateY(${(cy - y) / 20}px)`;
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            card.style.transform = '';
            card.style.boxShadow = '';
            if (innerIcon) innerIcon.style.transform = '';
        });
    });
}

/* --- Scroll Reveal Animations (Intersection Observer) --- */
function initScrollReveal() {
    const revealElements = [
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-card'),
        ...document.querySelectorAll('.step-item'),
        document.querySelector('.hero-content'),
        document.querySelector('.hero-visual'),
        document.querySelector('.services-visual-wrapper'),
        document.querySelector('.concept-visual'),
        document.querySelector('.concept-content'),
        document.querySelector('.contact-header'),
        document.querySelector('.contact-form-wrapper')
    ].filter(Boolean);

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Style configuration for animations
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            transition-delay: var(--reveal-delay, 0ms);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleTag);

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el, idx) => {
        if (el) {
            // stagger reveal using CSS variable
            const delay = (idx % 8) * 80; // cap grouping so delays remain reasonable
            el.style.setProperty('--reveal-delay', `${delay}ms`);
            el.classList.add('reveal-hidden');
            observer.observe(el);
        }
    });
}

/* --- Interactive Pixel-to-3D Canvas Background --- */
function initPixelCanvas() {
    const canvas = document.getElementById('pixel-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    // Particle definition
    class Particle {
        constructor(x, y, targetX, targetY, color) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            
            // Home/Grid target position
            this.baseX = targetX;
            this.baseY = targetY;
            
            // Velocity / Physics variables
            this.density = (Math.random() * 30) + 15;
            this.size = 2;
            this.color = color;
            
            // 3D rotation relative positions
            this.mode = 'grid'; // grid, shape, or disperse
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update(targetX, targetY) {
            // Update targets based on current state
            const destX = targetX !== undefined ? targetX : this.baseX;
            const destY = targetY !== undefined ? targetY : this.baseY;

            // Physics logic
            let dx = destX - this.x;
            let dy = destY - this.y;
            
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // Return to target speed
            let force = distance / 10;
            if (force < 0.1) force = 0.1;

            this.x += forceDirectionX * force * 1.5;
            this.y += forceDirectionY * force * 1.5;

            // Mouse interaction (Repell)
            if (mouse.x !== null && mouse.y !== null) {
                let mDx = mouse.x - this.x;
                let mDy = mouse.y - this.y;
                let mDistance = Math.sqrt(mDx * mDx + mDy * mDy);

                if (mDistance < mouse.radius) {
                    let mForce = (mouse.radius - mDistance) / mouse.radius;
                    let mDirectionX = mDx / mDistance;
                    let mDirectionY = mDy / mDistance;
                    
                    // Disperse particles away from mouse
                    this.x -= mDirectionX * mForce * this.density;
                    this.y -= mDirectionY * mForce * this.density;
                }
            }
        }
    }

    let particles = [];
    
    // 3D Shape Projection System
    // We will render rotating 3D wireframe cubes in the background
    let angleX = 0.005;
    let angleY = 0.005;
    let angleZ = 0.002;

    // Define 3D Cubes
    class Cube3D {
        constructor(centerX, centerY, size) {
            this.centerX = centerX;
            this.centerY = centerY;
            this.size = size;
            
            // Cube vertices in 3D
            this.vertices = [
                {x: -1, y: -1, z: -1},
                {x: 1, y: -1, z: -1},
                {x: 1, y: 1, z: -1},
                {x: -1, y: 1, z: -1},
                {x: -1, y: -1, z: 1},
                {x: 1, y: -1, z: 1},
                {x: 1, y: 1, z: 1},
                {x: -1, y: 1, z: 1}
            ];

            // Define points on edges to make the shapes look solid with particles
            this.edgePoints = [];
            this.generateEdgePoints();
        }

        generateEdgePoints() {
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 0], // back face
                [4, 5], [5, 6], [6, 7], [7, 4], // front face
                [0, 4], [1, 5], [2, 6], [3, 7]  // links
            ];

            connections.forEach(([p1Idx, p2Idx]) => {
                const p1 = this.vertices[p1Idx];
                const p2 = this.vertices[p2Idx];
                
                // Add points along the line
                const steps = 15;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    this.edgePoints.push({
                        x: p1.x + (p2.x - p1.x) * t,
                        y: p1.y + (p2.y - p1.y) * t,
                        z: p1.z + (p2.z - p1.z) * t
                    });
                }
            });
        }

        rotateX(angle) {
            const rad = angle;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            this.edgePoints.forEach(p => {
                const y = p.y * cos - p.z * sin;
                const z = p.z * cos + p.y * sin;
                p.y = y;
                p.z = z;
            });
        }

        rotateY(angle) {
            const rad = angle;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            this.edgePoints.forEach(p => {
                const x = p.x * cos - p.z * sin;
                const z = p.z * cos + p.x * sin;
                p.x = x;
                p.z = z;
            });
        }

        rotateZ(angle) {
            const rad = angle;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            this.edgePoints.forEach(p => {
                const x = p.x * cos - p.y * sin;
                const y = p.y * cos + p.x * sin;
                p.x = x;
                p.y = y;
            });
        }

        getProjectedPoints() {
            // Project 3D points to 2D
            const fov = 350; // Field of view
            const distance = 3; // Distance from camera

            return this.edgePoints.map(p => {
                // Projection calculation
                const scale = fov / (distance + p.z);
                return {
                    x: this.centerX + p.x * this.size * scale,
                    y: this.centerY + p.y * this.size * scale,
                    z: p.z // maintain depth info
                };
            });
        }
    }

    let cubes = [];

    function initParticles() {
        particles = [];
        cubes = [];
        
        const isMobile = width < 768;
        if (isMobile) {
            // On mobile, only render one floating cube in the background to save performance and avoid visual clutter
            cubes.push(new Cube3D(width * 0.5, height * 0.4, 0.35));
        } else {
            // Place 3D cubes around the screen (Left side of hero, right side of page details)
            cubes.push(new Cube3D(width * 0.15, height * 0.35, 0.4));
            cubes.push(new Cube3D(width * 0.85, height * 0.65, 0.5));
            cubes.push(new Cube3D(width * 0.5, height * 0.15, 0.3));
        }

        // Background digital grid layout targets
        const gridSpacing = isMobile ? 60 : 40;
        let pIndex = 0;
        
        // Colors palette
        const colors = [
            'rgba(0, 242, 254, 0.65)', // neon cyan
            'rgba(157, 78, 221, 0.65)', // electric purple
            'rgba(255, 0, 127, 0.5)',   // magenta
            'rgba(0, 119, 182, 0.45)'   // deep blue
        ];

        // Gather all projected 3D coordinates
        let shapesPoints = [];
        cubes.forEach((cube, cIdx) => {
            const points = cube.getProjectedPoints();
            points.forEach((p, pIdx) => {
                shapesPoints.push({
                    x: p.x,
                    y: p.y,
                    color: cIdx % 2 === 0 ? colors[0] : colors[1]
                });
            });
        });

        // Initialize particles
        // Create fewer particles on mobile to improve frame rates and battery life
        const totalParticles = isMobile ? Math.max(200, shapesPoints.length + 30) : Math.max(800, shapesPoints.length + 150);

        for (let i = 0; i < totalParticles; i++) {
            let targetX, targetY, color;

            if (i < shapesPoints.length) {
                targetX = shapesPoints[i].x;
                targetY = shapesPoints[i].y;
                color = shapesPoints[i].color;
            } else {
                // Background scattered grids
                const col = (i - shapesPoints.length) % Math.floor(width / gridSpacing);
                const row = Math.floor((i - shapesPoints.length) / Math.floor(width / gridSpacing));
                targetX = (col * gridSpacing) + (gridSpacing / 2) + (Math.random() * 6 - 3);
                targetY = (row * gridSpacing) + (gridSpacing / 2) + (Math.random() * 6 - 3);
                color = colors[2]; // magenta / blue grid dots
                if (Math.random() > 0.5) color = colors[3];
            }

            particles.push(new Particle(targetX, targetY, targetX, targetY, color));
        }
    }

    initParticles();

    // Loop and animate
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // 1. Rotate the 3D Cubes
        cubes.forEach(cube => {
            cube.rotateX(angleX);
            cube.rotateY(angleY);
            cube.rotateZ(angleZ);
        });

        // 2. Refresh coordinates for active shape points
        let shapeIndex = 0;
        cubes.forEach(cube => {
            const projected = cube.getProjectedPoints();
            projected.forEach(p => {
                if (particles[shapeIndex]) {
                    // Update target coordinates to match rotating 3D cube projection
                    particles[shapeIndex].update(p.x, p.y);
                    particles[shapeIndex].draw();
                    shapeIndex++;
                }
            });
        });

        // 3. Update the rest of the particles (acting as digital nodes)
        for (let i = shapeIndex; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Draw connections for the rotating cubes to make wireframes obvious (Desktop only)
        const isMobile = width < 768;
        if (!isMobile) {
            let lineIndex = 0;
            cubes.forEach(cube => {
                const points = cube.getProjectedPoints();
                
                // Draw connections between points along edges to give structural visibility
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
                ctx.lineWidth = 0.5;
                
                // Draw connections for specific nodes that outline the cube edges
                // We connect vertices
                const fov = 350;
                const distance = 3;
                const vertices2D = cube.vertices.map(v => {
                    const scale = fov / (distance + v.z);
                    return {
                        x: cube.centerX + v.x * cube.size * scale,
                        y: cube.centerY + v.y * cube.size * scale
                    };
                });

                const edges = [
                    [0, 1], [1, 2], [2, 3], [3, 0],
                    [4, 5], [5, 6], [6, 7], [7, 4],
                    [0, 4], [1, 5], [2, 6], [3, 7]
                ];

                ctx.beginPath();
                edges.forEach(([p1, p2]) => {
                    ctx.moveTo(vertices2D[p1].x, vertices2D[p1].y);
                    ctx.lineTo(vertices2D[p2].x, vertices2D[p2].y);
                });
                ctx.stroke();
            });
        }

        requestAnimationFrame(animate);
    }

    animate();
}
