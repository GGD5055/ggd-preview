/**
 * GRowGLowDesign - Main JavaScript
 */
(function () {
    'use strict';

    /* ─────────────────────────────────────
       ヘッダー: スクロール時クラス付与
    ───────────────────────────────────── */
    const header = document.getElementById('masthead');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ─────────────────────────────────────
       ハンバーガーメニュー
    ───────────────────────────────────── */
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('is-open');
            navToggle.classList.toggle('is-active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // ナビリンクをクリックしたらメニューを閉じる
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                primaryNav.classList.remove('is-open');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ─────────────────────────────────────
       星空生成（Hero / Page Hero）
    ───────────────────────────────────── */
    function createStars(container, count) {
        if (!container) return;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const star = document.createElement('span');
            const size = Math.random() * 2.5 + 0.5;
            const x    = Math.random() * 100;
            const y    = Math.random() * 100;
            const dur  = Math.random() * 4 + 2;
            const del  = Math.random() * 5;

            star.style.cssText = [
                'position:absolute',
                `left:${x}%`,
                `top:${y}%`,
                `width:${size}px`,
                `height:${size}px`,
                'border-radius:50%',
                'background:#ffffff',
                `opacity:${Math.random() * 0.6 + 0.2}`,
                `animation:twinkle ${dur}s ${del}s ease-in-out infinite`,
            ].join(';');

            fragment.appendChild(star);
        }

        container.appendChild(fragment);
    }

    function createShootingStars(container) {
        function shoot() {
            const s = document.createElement('span');
            const x = Math.random() * 40 + 50;
            const y = Math.random() * 30;

            s.style.cssText = [
                'position:absolute',
                `left:${x}%`,
                `top:${y}%`,
                'width:100px',
                'height:1px',
                'background:linear-gradient(90deg, rgba(255,255,255,0.8), transparent)',
                'transform:rotate(-45deg)',
                'transform-origin:center center',
                `animation:starFall ${Math.random() * 0.6 + 0.4}s linear forwards`,
            ].join(';');

            container.appendChild(s);
            setTimeout(() => s.remove(), 1000);

            const next = Math.random() * 6000 + 3000;
            setTimeout(shoot, next);
        }
        setTimeout(shoot, Math.random() * 3000 + 1000);
    }

    // Hero
    const heroStars = document.getElementById('hero-stars');
    if (heroStars) createStars(heroStars, 150);

    // 流れ星（ロゴの前面に流す）
    const shootingFg = document.getElementById('hero-shooting-foreground');
    if (shootingFg) createShootingStars(shootingFg);

    // ロゴ内のランダム瞬きパーティクル
    const logoParticles = document.getElementById('hero-logo-particles');
    if (logoParticles) {
        const colors = ['#ffffff', '#fff6c0', '#ffd862', '#ff9ec7', '#b8e6ff'];
        const count = 18;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            const size = Math.random() * 2 + 1.2;
            const cx = 50, cy = 50;
            const r = Math.sqrt(Math.random()) * 40;
            const theta = Math.random() * Math.PI * 2;
            const x = cx + Math.cos(theta) * r;
            const y = cy + Math.sin(theta) * r;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const dur = Math.random() * 2.5 + 1.8;
            const delay = Math.random() * 4;
            p.style.cssText = [
                `left:${x}%`,
                `top:${y}%`,
                `width:${size}px`,
                `height:${size}px`,
                `background:${color}`,
                `box-shadow:0 0 6px ${color}`,
                `--dur:${dur}s`,
                `--delay:-${delay}s`,
            ].join(';');
            frag.appendChild(p);
        }
        logoParticles.appendChild(frag);
    }

    /* ─────────────────────────────────────
       ストリングイルミネーション生成
    ───────────────────────────────────── */
    function buildStringIllumi() {
        const stringContainer = document.getElementById('hero-string-illumi');
        if (!stringContainer) return;

        // 既存の要素をクリア
        stringContainer.innerHTML = '';

        const w = stringContainer.offsetWidth || window.innerWidth;
        const h = 60;
        const colors = ['gold', 'pink', 'blue', 'gold', 'gold', 'pink', 'blue', 'gold'];
        const bulbCount = Math.floor(w / 60);
        const amplitude = 18;

        // SVGワイヤー（カテナリー曲線）
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'string-wire');
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'none');

        let pathD = `M0,8`;
        const points = [];
        for (let i = 0; i <= bulbCount; i++) {
            const x = (i / bulbCount) * w;
            const progress = i / bulbCount;
            const sag = Math.sin(progress * Math.PI) * amplitude;
            const y = 8 + sag;
            pathD += ` Q${x - w / bulbCount / 2},${y + 5} ${x},${y}`;
            if (i > 0 && i < bulbCount) points.push({ x, y });
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        svg.appendChild(path);
        stringContainer.appendChild(svg);

        // 電球を配置
        points.forEach((pt, i) => {
            const bulb = document.createElement('span');
            const colorClass = colors[i % colors.length];
            bulb.className = `string-bulb string-bulb--${colorClass}`;
            bulb.style.left = `${pt.x - 6}px`;
            bulb.style.top = `${pt.y - 10}px`;
            stringContainer.appendChild(bulb);

            // ピンク電球の下に小さな星を吊り下げ
            if (colorClass === 'pink' && Math.random() > 0.4) {
                const star = document.createElement('span');
                star.className = 'string-star';
                star.textContent = '✦';
                star.style.left = `${pt.x - 3}px`;
                star.style.top = `${pt.y + 20}px`;
                star.style.fontSize = `${Math.random() * 6 + 8}px`;
                stringContainer.appendChild(star);
            }
        });
    }

    buildStringIllumi();

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildStringIllumi, 200);
    });

    // Page hero
    const pageHeroStars = document.getElementById('page-hero-stars');
    if (pageHeroStars) createStars(pageHeroStars, 80);

    /* ─────────────────────────────────────
       スクロール連動フェードイン
    ───────────────────────────────────── */
    const fadeEls = document.querySelectorAll(
        '.service-card, .works-card, .section-header, .about-content, .cta-inner'
    );

    if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
        // クラスを付与してCSS側で制御
        fadeEls.forEach(el => el.classList.add('fade-in-up'));

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        fadeEls.forEach(el => io.observe(el));
    }

    /* ─────────────────────────────────────
       ライトストリング: ランダム点滅演出
    ───────────────────────────────────── */
    const bulbs = document.querySelectorAll('.bulb');
    bulbs.forEach((bulb, i) => {
        // 各電球に微妙に異なるアニメーション遅延を設定
        bulb.style.animationDelay = `${(i * 0.15) % 3}s`;
        bulb.style.animationDuration = `${Math.random() * 2 + 2}s`;
    });

    /* ─────────────────────────────────────
       スムーズスクロール（アンカーリンク）
    ───────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80; // ヘッダー高さ分
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ─────────────────────────────────────
       ロゴ画像: グロウアニメーション
    ───────────────────────────────────── */
    const heroLogo = document.querySelector('.hero-logo img');
    if (heroLogo) {
        let glowPhase = 0;
        setInterval(() => {
            glowPhase = (glowPhase + 1) % 3;
            const glows = [
                'drop-shadow(0 0 30px rgba(255,208,77,0.5)) drop-shadow(0 0 80px rgba(32,96,208,0.3))',
                'drop-shadow(0 0 40px rgba(255,208,77,0.7)) drop-shadow(0 0 100px rgba(32,96,208,0.4))',
                'drop-shadow(0 0 20px rgba(255,208,77,0.3)) drop-shadow(0 0 60px rgba(224,128,200,0.3))',
            ];
            heroLogo.style.filter = glows[glowPhase];
            heroLogo.style.transition = 'filter 2s ease';
        }, 2500);
    }

})();
