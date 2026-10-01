(function(){
const P=/(profile|product)\.html$/.test(location.pathname)?'index.html':'';
const _m=document.getElementById('hdrMount');
const CART=_m&&_m.dataset.cart?'<button class="hdr-cart" id="cartFab" type="button" aria-label="سبد خرید"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L20 8H6"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span class="cart-count" id="cartCount" hidden>۰</span></button>':'';
const html=`<header class="site-header" id="siteHeader">
  <div class="wrap hdr-in">
    <a class="brand" href="${P}#home"><img class="brand-logo" src="logo-sarchin.png" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='logo.png'}" alt="لوگوی آرایشگاه سرچین"></a>
    <button class="nav-toggle" id="navToggle" type="button" aria-label="منو" aria-expanded="false" aria-controls="mainNav"><i></i><i></i><i></i></button>
    <nav class="main-nav" id="mainNav" aria-label="منوی اصلی">
      <ul class="nav-list">
        <li><a class="nav-link" href="${P}#home">خانه</a></li>
        <li class="has-sub">
          <button class="nav-link sub-toggle" type="button" aria-expanded="false">خدمات ما <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
          <ul class="sub-menu">
            <li><a href="${P}#services">اصلاح موی سر</a></li>
            <li><a href="${P}#services">اصلاح ریش</a></li>
            <li><a href="${P}#services">فر و سشوار</a></li>
            <li><a href="${P}#services">پیرایش داماد</a></li>
            <li><a href="${P}#services">رنگ و لایت</a></li>
          </ul>
        </li>
        <li><a class="nav-link" href="${P}#booking">رزرو نوبت</a></li>
        <li><a class="nav-link" href="${P}#about">درباره ما</a></li>
        <li><a class="nav-link" href="${P}#contact">تماس با ما</a></li>
        <li class="phone-li"><a class="hdr-phone" href="tel:09055023999"><span>رزرو نوبت تلفنی</span><b dir="ltr">۰۹۰۵ ۵۰۲ ۳۹۹۹</b></a></li>
      </ul>
    </nav>
    <div class="hdr-tools">${CART}
    <div class="has-sub acct">
        <button class="acct-btn" id="acctBtn" type="button" aria-expanded="false">
          <span class="acct-av" id="acctAv" hidden></span>
          <span class="acct-label" id="acctLabel">ورود / ثبت‌نام</span>
          <svg class="acct-caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" hidden><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        <ul class="sub-menu" id="acctMenu" hidden>
          <li><a href="${P}#booking">رزرو نوبت جدید</a></li>
          <li><button type="button" id="logoutBtn">خروج از حساب</button></li>
        </ul>
    </div>
    </div>
    <a class="hdr-phone hdr-phone-m" href="tel:09055023999"><span>رزرو نوبت تلفنی</span><b dir="ltr">۰۹۰۵ ۵۰۲ ۳۹۹۹</b></a>
  </div>
</header>
<div class="nav-backdrop" id="navBackdrop"></div>
`;
document.getElementById('hdrMount').outerHTML=html;
/* ---- Header ---- */
var hdr=document.getElementById('siteHeader'),navToggle=document.getElementById('navToggle'),
      navBackdrop=document.getElementById('navBackdrop');
const mobileMQ=window.matchMedia('(max-width:860px)');
function closeSubs(except){document.querySelectorAll('.has-sub').forEach(li=>{if(li!==except){li.classList.remove('open');const b=li.querySelector(':scope>button');if(b)b.setAttribute('aria-expanded','false')}})}
function setNav(open){document.body.classList.toggle('nav-open',open);navToggle.setAttribute('aria-expanded',open);if(!open)closeSubs()}
navToggle.onclick=()=>setNav(!document.body.classList.contains('nav-open'));
navBackdrop.onclick=()=>setNav(false);
document.querySelectorAll('.has-sub>button').forEach(b=>b.addEventListener('click',e=>{
  if(b.id==='acctBtn'&&!getUser()){setNav(false);window.openAuthModal?openAuthModal():location.href='index.html?login=1';return}
  const li=b.parentElement,open=!li.classList.contains('open');
  closeSubs(li);li.classList.toggle('open',open);b.setAttribute('aria-expanded',open);e.stopPropagation();
}));
document.addEventListener('click',()=>closeSubs());
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{closeSubs();setNav(false)}));
mobileMQ.addEventListener('change',()=>setNav(false));
let lastY=scrollY,tick=false;
addEventListener('scroll',()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{
  const y=Math.max(0,scrollY),d=y-lastY;hdr.classList.toggle('scrolled',y>10);
  if(document.body.classList.contains('nav-open')||hdr.querySelector('.has-sub.open')||y<80){hdr.classList.remove('hide');lastY=y}
  else if(Math.abs(d)>6){hdr.classList.toggle('hide',d>0);lastY=y}
  tick=false})},{passive:true});
hdr.addEventListener('focusin',()=>hdr.classList.remove('hide'));

/* ---- Logged-in user ---- */
function getUser(){try{return localStorage.getItem('sarchin_user')||''}catch(e){return ''}}
function setUser(n){try{n?localStorage.setItem('sarchin_user',n):localStorage.removeItem('sarchin_user')}catch(e){}renderUser()}
function getPhoto(){try{return localStorage.getItem('sarchin_photo')||''}catch(e){return ''}}
function renderUser(){
  const n=getUser(),btn=document.getElementById('acctBtn');
  document.getElementById('acctLabel').textContent=n||'ورود / ثبت‌نام';
  const av=document.getElementById('acctAv');const ph='';av.hidden=!n;av.textContent=n&&!ph?[...n][0]:'';av.style.backgroundImage=n&&ph?'url('+ph+')':'';
  document.querySelector('.acct-caret').hidden=!n;
  document.getElementById('acctMenu').hidden=!n;
  btn.classList.toggle('logged',!!n);
  if(!n)document.querySelector('.acct').classList.remove('open');
  const nameInput=document.getElementById('name');if(n&&nameInput&&!nameInput.value)nameInput.value=n;
}
document.getElementById('logoutBtn').onclick=()=>{setUser('');setNav(false);if(window.onLogout)onLogout()};
renderUser();
window.getUser=getUser;window.setUser=setUser;window.renderUser=renderUser;
})();
