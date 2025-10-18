
(function(){
  const docEl = document.documentElement;
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const progress = document.querySelector('.reading-progress span');

  // Theme
  const savedTheme = localStorage.getItem('neoaus-theme');
  if(savedTheme){ docEl.setAttribute('data-theme', savedTheme); }
  themeToggle?.addEventListener('click', () => {
    const next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    docEl.setAttribute('data-theme', next);
    localStorage.setItem('neoaus-theme', next);
  });

  // Nav
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('show');
  });

  // Build TOC if container exists
  const toc = document.querySelector('.toc ul');
  const headings = document.querySelectorAll('.prose h2, .prose h3');
  if(toc && headings.length){
    headings.forEach((h,i) => {
      if(!h.id){ h.id = 'h-' + (i+1); }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#'+h.id;
      a.textContent = h.textContent;
      if(h.tagName === 'H3'){ a.style.marginLeft = '10px'; }
      li.appendChild(a); toc.appendChild(li);
    });

    // ScrollSpy
    const links = toc.querySelectorAll('a');
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        const id = e.target.id;
        const link = toc.querySelector(`a[href="#${id}"]`);
        if(link){
          if(e.isIntersecting){
            links.forEach(l=>l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: [0,1]});
    headings.forEach(h=>obs.observe(h));
  }

  // Reading progress
  const onScroll = () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    const p = Math.max(0, Math.min(1, scrollTop / (scrollHeight || 1)));
    progress && (progress.style.width = (p*100).toFixed(2)+'%');
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();


// Scroll reveal animations
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el => io.observe(el));
})();
