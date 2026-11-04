/* Portfolio interactions: menu, active link, reveal, back-to-top, form */
document.documentElement.classList.add('js');

const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');
const topBtn = document.getElementById('top');
const links = document.querySelectorAll('.menu a');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu: toggle, and close on link click or Escape
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
links.forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Nav border and back-to-top visibility on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  topBtn.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Scroll reveal
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Active nav highlighting
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObs.observe(s));

// Contact form: validation, then opens the visitor's email app.
// For real delivery, set FORM_ENDPOINT to a service URL (e.g. Formspree).
const FORM_ENDPOINT = '';
const form = document.getElementById('form');
const status = document.getElementById('status');

function check(id, test, msg) {
  const field = document.getElementById(id);
  const ok = test(field.value.trim());
  document.getElementById('e-' + id).textContent = ok ? '' : msg;
  field.classList.toggle('invalid', !ok);
  field.setAttribute('aria-invalid', String(!ok));
  return ok;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  status.textContent = '';
  const results = [
    check('name', v => v.length >= 2, 'Enter your name.'),
    check('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.'),
    check('subject', v => v.length >= 3, 'Enter a subject.'),
    check('message', v => v.length >= 10, 'Write a message of at least 10 characters.')
  ];
  if (results.includes(false)) { form.querySelector('.invalid').focus(); return; }

  const data = Object.fromEntries(new FormData(form));
  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      status.textContent = 'Message sent. Thank you!';
      form.reset();
    } catch { status.textContent = 'Could not send. Please email me directly.'; status.style.color = '#ff8a9b'; }
  } else {
    const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`);
    window.location.href = `mailto:srirambharath44@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
    status.textContent = 'Opening your email app with your message.';
  }
});
