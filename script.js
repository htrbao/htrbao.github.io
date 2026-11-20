document.body.classList.add('js-loaded');

const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }),
    { threshold: 0.08 }
);

document.querySelectorAll('.section').forEach(el => observer.observe(el));

/* Avatar (click or swipe to change): picks up imgs/TrongBaoHo-0, -1, -2, ... automatically.
   Add a new photo with the next number and it appears; no code change needed. */
(function () {
    const box = document.getElementById('avatar');
    if (!box) return;
    const exts = ['jpg', 'JPG', 'jpeg', 'png', 'webp'];

    const load = src => new Promise(res => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = src;
    });

    async function find(n) {
        for (const e of exts) {
            const im = await load(`imgs/TrongBaoHo-${n}.${e}`);
            if (im) return im;
        }
        return null;
    }

    (async () => {
        const imgs = [];
        for (let n = 0; ; n++) {
            const im = await find(n);
            if (!im) break;
            im.alt = 'Trong-Bao Ho';
            imgs.push(im);
            box.appendChild(im);
        }
        if (!imgs.length) return;
        let cur = imgs.length - 1;   // default: highest-numbered photo
        imgs[cur].classList.add('active');
        if (imgs.length < 2) return;

        box.classList.add('multi');
        const show = i => {
            imgs[cur].classList.remove('active');
            cur = (i + imgs.length) % imgs.length;
            imgs[cur].classList.add('active');
        };

        box.addEventListener('click', () => show(cur + 1));
        let x0 = null;
        box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', e => {
            if (x0 === null) return;
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 30) show(cur + (dx < 0 ? 1 : -1));
            x0 = null;
        });
    })();
})();
