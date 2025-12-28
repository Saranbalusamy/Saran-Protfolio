// Some browser extensions inject challenges that call solveSimpleChallenge().
// Define a harmless fallback so the portfolio doesn't error in the console.
window.solveSimpleChallenge = window.solveSimpleChallenge || function () { return true; };

// Copy Protection: Block keyboard shortcuts
document.addEventListener('keydown', function (e) {
  // Block Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12
  if (
    (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
    return false;
  }
});

// Navbar scroll spy: update active link based on visible section
function initScrollSpy() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar nav a');

  function updateActiveLink() {
    var scrollY = window.scrollY + 100; // offset for navbar height

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - 100;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run once on load
}

// Mobile hamburger menu toggle
function initHamburgerMenu() {
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('nav-menu');
  
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });

  // Close menu when a nav link is clicked
  var navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Initialize scroll spy and hamburger when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initScrollSpy();
    initHamburgerMenu();
  });
} else {
  initScrollSpy();
  initHamburgerMenu();
}

(function () {
  function initQuoteRotator() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var quoteEl = document.querySelector('.hero-quote');
    if (!quoteEl) return;

    var quoteBox = quoteEl.closest('.quotes-container');

    var quotes = [
      'Success is not luck, it\'s consistency.',
      'Build first. Perfect later.',
      'Every day is a second chance.',
      'Books give theory, projects give confidence.',
      'Great things never come from comfort zones.',
      'Small steps today create massive impact tomorrow.'
    ];

    var quoteIndex = 0;

    function animateWords(text) {
      var words = text.split(' ');

      // Fade out existing words first
      var existingWords = quoteEl.querySelectorAll('.quote-word');
      var fadeOutMs = existingWords.length > 0 ? (existingWords.length * 50 + 300) : 0;
      var fadeInMs = words.length * 120 + 500;

      if (existingWords.length > 0) {
        existingWords.forEach(function (span, index) {
          span.style.animation = 'none';
          span.offsetHeight;
          span.style.animation = 'wordFadeOut 0.3s ease-out forwards';
          span.style.animationDelay = (index * 0.05) + 's';
        });

        // Wait for fade out, then show new words
        setTimeout(function () {
          showNewWords(words);
        }, fadeOutMs);
      } else {
        showNewWords(words);
      }

      // Total estimated animation time so we can schedule the next quote correctly
      return fadeOutMs + fadeInMs;
    }

    function showNewWords(words) {
      quoteEl.textContent = '';

      words.forEach(function (word, index) {
        var span = document.createElement('span');
        span.className = 'quote-word';
        span.textContent = word;
        quoteEl.appendChild(span);

        // Animate in (doesn't depend on CSS animations being enabled)
        if (!reduceMotion && typeof span.animate === 'function') {
          span.animate(
            [
              { opacity: 0, transform: 'translateY(15px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            {
              duration: 500,
              easing: 'ease-out',
              fill: 'both',
              delay: index * 120
            }
          );
        }
      });

      // Add floating effect after words appear
      var totalDelay = words.length * 120 + 500;
      setTimeout(function () {
        var wordSpans = quoteEl.querySelectorAll('.quote-word');
        wordSpans.forEach(function (span, index) {
          span.classList.add('floating');
          span.style.animationDelay = (index * 0.15) + 's';
        });
      }, totalDelay);
    }

    function showQuoteAt(nextIndex) {
      quoteIndex = (nextIndex + quotes.length) % quotes.length;
      animateWords(quotes[quoteIndex]);
    }

    // Auto-advance timer (10 seconds of no interaction)
    var autoTimer = 0;
    var autoDelayMs = 5000;

    function resetAutoTimer() {
      if (autoTimer) clearTimeout(autoTimer);
      autoTimer = setTimeout(function () {
        showNextQuote();
      }, autoDelayMs);
    }

    function showNextQuote() {
      showQuoteAt(quoteIndex + 1);
      resetAutoTimer();
    }

    // Bind once to avoid double-advancing.
    if (quoteBox && quoteBox.dataset && quoteBox.dataset.quoteControlsBound === 'true') return;
    if (quoteBox && quoteBox.dataset) quoteBox.dataset.quoteControlsBound = 'true';

    // Start the auto-advance timer on page load
    resetAutoTimer();
  }

  function initTypewriter() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var el = document.querySelector('.typing-text');
    if (!el) return;

    var roles = [
      'Backend Development',
      'Full Stack Development',
      'Machine Learning'
    ];

    if (reduceMotion) {
      el.textContent = roles[0];
      return;
    }

    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          return setTimeout(tick, 900);
        }
        return setTimeout(tick, 70);
      }

      charIndex--;
      el.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 260);
      }
      return setTimeout(tick, 45);
    }

    tick();
  }

  function initHeroNetwork() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    var canvas = hero.querySelector('.hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var raf = 0;
    var nodes = [];
    var sparks = [];

    var mouseX = 0;
    var mouseY = 0;
    var mouseActive = false;
    var lastMoveT = 0;


    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function spawnSpark(x, y, count) {
      for (var i = 0; i < count; i++) {
        sparks.push({
          x: x,
          y: y,
          vx: rand(-0.9, 0.9),
          vy: rand(-0.9, 0.9),
          r: rand(1.2, 2.4),
          life: rand(22, 44),
          maxLife: 44,
          accent: Math.random() > 0.65
        });
      }

      // cap spark count
      if (sparks.length > 260) sparks.splice(0, sparks.length - 260);
    }



    function resize() {
      var rect = hero.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // reseed on resize for consistent density
      var target = Math.max(30, Math.min(75, Math.floor((width * height) / 18000)));
      nodes = [];
      for (var i = 0; i < target; i++) {
        nodes.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.22, 0.22),
          vy: rand(-0.18, 0.18),
          r: rand(2.0, 3.5),
          accent: Math.random() > 0.82,
          label: ''
        });
      }

      // clear sparks on resize to avoid weird scaling
      sparks = [];
    }

    function step() {
      raf = 0;
      ctx.clearRect(0, 0, width, height);

      // soft vignette to keep content readable
      var grad = ctx.createRadialGradient(width * 0.55, height * 0.45, 40, width * 0.55, height * 0.45, Math.max(width, height));
      grad.addColorStop(0, 'rgba(246,248,255,0.0)');
      grad.addColorStop(1, 'rgba(246,248,255,0.72)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // update
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];

        // cursor interaction: particle-style force field within radius
        if (mouseActive) {
          var mdx = mouseX - n.x;
          var mdy = mouseY - n.y;
          var md2 = mdx * mdx + mdy * mdy;
          var radius = 220;
          var r2 = radius * radius;
          if (md2 < r2 && md2 > 0.0001) {
            var dist = Math.sqrt(md2);
            var t = 1 - dist / radius;
            // repel close, attract further out
            var repel = dist < 55 ? -1 : 1;
            var strength = (0.12 + (t * 0.9)) * repel;
            n.vx += (mdx / dist) * strength * 0.02;
            n.vy += (mdy / dist) * strength * 0.02;
          }
        }

        // friction + speed cap
        n.vx *= 0.988;
        n.vy *= 0.988;
        var sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > 0.85) {
          n.vx = (n.vx / sp) * 0.85;
          n.vy = (n.vy / sp) * 0.85;
        }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      // update sparks (cursor particles)
      for (var s = sparks.length - 1; s >= 0; s--) {
        var p = sparks[s];
        // slight attraction to cursor
        if (mouseActive) {
          var sdx = mouseX - p.x;
          var sdy = mouseY - p.y;
          var sd2 = sdx * sdx + sdy * sdy;
          if (sd2 > 0.0001) {
            var sd = Math.sqrt(sd2);
            var pull = Math.min(1, 140 / sd);
            p.vx += (sdx / sd) * pull * 0.02;
            p.vy += (sdy / sd) * pull * 0.02;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0 || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
          sparks.splice(s, 1);
        }
      }

      // links
      var maxDist = Math.min(190, Math.max(130, Math.floor(Math.min(width, height) * 0.28)));
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var na = nodes[a];
          var nb = nodes[b];
          var dx = na.x - nb.x;
          var dy = na.y - nb.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxDist) continue;

          var alpha = (1 - dist / maxDist);

          // boost links near cursor
          if (mouseActive) {
            var cdxA = na.x - mouseX;
            var cdyA = na.y - mouseY;
            var cdxB = nb.x - mouseX;
            var cdyB = nb.y - mouseY;
            var da = Math.sqrt(cdxA * cdxA + cdyA * cdyA);
            var db = Math.sqrt(cdxB * cdxB + cdyB * cdyB);
            var near = Math.min(da, db);
            if (near < 160) alpha = Math.min(1, alpha + (1 - near / 160) * 0.55);
          }

          ctx.strokeStyle = na.accent || nb.accent
            ? 'rgba(255,122,0,' + (alpha * 0.40).toFixed(3) + ')'
            : 'rgba(108,43,217,' + (alpha * 0.30).toFixed(3) + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      // cursor halo
      if (mouseActive) {
        var halo = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
        halo.addColorStop(0, 'rgba(108,43,217,0.12)');
        halo.addColorStop(0.55, 'rgba(255,122,0,0.06)');
        halo.addColorStop(1, 'rgba(255,122,0,0.0)');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      // spark rendering + links to nearby nodes (additive look)
      if (sparks.length) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (var k = 0; k < sparks.length; k++) {
          var spk = sparks[k];
          var lifeT = Math.max(0, Math.min(1, spk.life / spk.maxLife));
          var a1 = 0.55 * lifeT;

          // draw spark
          ctx.beginPath();
          ctx.fillStyle = spk.accent ? 'rgba(255,122,0,' + a1.toFixed(3) + ')' : 'rgba(108,43,217,' + a1.toFixed(3) + ')';
          ctx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
          ctx.fill();

          // connect spark to closest nodes
          var connectDist = 130;
          for (var nn = 0; nn < nodes.length; nn++) {
            var nd = nodes[nn];
            var dx2 = spk.x - nd.x;
            var dy2 = spk.y - nd.y;
            var dd = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (dd > connectDist) continue;
            var la = (1 - dd / connectDist) * 0.22 * lifeT;
            ctx.strokeStyle = spk.accent
              ? 'rgba(255,122,0,' + la.toFixed(3) + ')'
              : 'rgba(108,43,217,' + la.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(spk.x, spk.y);
            ctx.lineTo(nd.x, nd.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // nodes + labels
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        ctx.beginPath();
        ctx.fillStyle = node.accent ? 'rgba(255,122,0,0.85)' : 'rgba(108,43,217,0.85)';
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        if (node.label) {
          ctx.font = '600 12px Poppins, Segoe UI, sans-serif';
          ctx.fillStyle = 'rgba(11,27,58,0.78)';
          ctx.fillText(node.label, node.x + 8, node.y - 8);
        }
      }

      raf = window.requestAnimationFrame(step);
    }

    function start() {
      if (raf) return;
      resize();
      raf = window.requestAnimationFrame(step);
    }

    function stop() {
      if (!raf) return;
      window.cancelAnimationFrame(raf);
      raf = 0;
    }

    var ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(function () {
        resize();
      });
      ro.observe(hero);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    // cursor tracking for interaction
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;

      // particle trail while moving (rate-limited)
      var now = performance.now();
      if (now - lastMoveT > 18) {
        lastMoveT = now;
        spawnSpark(mouseX, mouseY, 2);
      }
    }, { passive: true });

    hero.addEventListener('mouseleave', function () {
      mouseActive = false;
    }, { passive: true });

    hero.addEventListener('click', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      spawnSpark(x, y, 28);
    }, { passive: true });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTypewriter();
      initHeroNetwork();
      initQuoteRotator();

      // Initialize EmailJS
      if (typeof emailjs !== 'undefined') {
        emailjs.init("4_JWDAL9HAEIwE6XD");
      }

      // Contact Form Handling (EmailJS)
      var contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var btn = contactForm.querySelector('button');
          var originalText = btn.innerHTML;
          btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

          emailjs.sendForm(
            "service_1ymnpon",
            "template_sahn2pu",
            contactForm
          ).then(
            function () {
              alert('Message sent successfully!');
              contactForm.reset();
              btn.innerHTML = originalText;
            },
            function (error) {
              alert('Failed to send message. Please try again.');
              console.log(error);
              btn.innerHTML = originalText;
            }
          );
        });
      }

      // View All Projects Toggle
      var viewAllBtn = document.getElementById('viewAllBtn');
      if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function () {
          var hiddenProjects = document.querySelectorAll('.project-hidden');
          var btnText = this.querySelector('.btn-text');
          var arrowDown = this.querySelector('.arrow-down');
          var arrowUp = this.querySelector('.arrow-up');

          if (hiddenProjects.length === 0) return;

          var isExpanded = hiddenProjects[0].classList.contains('show');

          if (isExpanded) {
            // Collapse - hide projects
            hiddenProjects.forEach(function (project) {
              project.classList.remove('show');
            });
            btnText.textContent = 'View All Projects';
            arrowDown.style.display = 'block';
            arrowUp.style.display = 'none';

            // Smooth scroll to projects section
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Expand - show projects
            hiddenProjects.forEach(function (project) {
              project.classList.add('show');
            });
            btnText.textContent = 'Show Less';
            arrowDown.style.display = 'none';
            arrowUp.style.display = 'block';
          }
        });
      }
    });
  } else {
    initTypewriter();
    initHeroNetwork();
    initQuoteRotator();

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init("4_JWDAL9HAEIwE6XD");
    }

    // Contact Form Handling (EmailJS)
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = contactForm.querySelector('button');
        var originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        emailjs.sendForm(
          "service_1ymnpon",
          "template_sahn2pu",
          contactForm
        ).then(
          function () {
            alert('Message sent successfully!');
            contactForm.reset();
            btn.innerHTML = originalText;
          },
          function (error) {
            alert('Failed to send message. Please try again.');
            console.log(error);
            btn.innerHTML = originalText;
          }
        );
      });
    }

    // View All Projects Toggle (also needed here for defer script)
    var viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', function () {
        var hiddenProjects = document.querySelectorAll('.project-hidden');
        var btnText = this.querySelector('.btn-text');
        var arrowDown = this.querySelector('.arrow-down');
        var arrowUp = this.querySelector('.arrow-up');

        if (hiddenProjects.length === 0) return;

        var isExpanded = hiddenProjects[0].classList.contains('show');

        if (isExpanded) {
          // Collapse - hide projects
          hiddenProjects.forEach(function (project) {
            project.classList.remove('show');
          });
          btnText.textContent = 'View All Projects';
          arrowDown.style.display = 'block';
          arrowUp.style.display = 'none';

          // Smooth scroll to projects section
          document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Expand - show projects
          hiddenProjects.forEach(function (project) {
            project.classList.add('show');
          });
          btnText.textContent = 'Show Less';
          arrowDown.style.display = 'none';
          arrowUp.style.display = 'block';
        }
      });
    }
  }
})();
