/* سبد خرید سرچین — مشترک بین صفحه اصلی و صفحه محصول */
(function(){
const MAX=9;
const prods={};(window.SARCHIN_PRODUCTS||[]).forEach(p=>prods[p.id]=p);
const fa=n=>(+n).toLocaleString('fa-IR');
const fmt=n=>fa(n)+' تومان';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toEn=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
let cart={},view='cart',lastOrder=null,disc=false,ck={name:'',phone:'',code:''};
const CODE='S1212',RATE=0.1;
function sums(){const {t}=totals();const d=disc?Math.round(t*RATE):0;return{t:t,d:d,f:t-d}}
function keep(){const a=root.querySelector('#ckName'),b=root.querySelector('#ckPhone');if(a)ck.name=a.value;if(b)ck.phone=b.value;const c=root.querySelector('#ckCode');if(c&&!disc)ck.code=c.value}
try{const s=JSON.parse(localStorage.getItem('sarchin_cart')||'{}');Object.keys(s).forEach(k=>{const q=s[k]|0;if(prods[k]&&q>0)cart[k]=Math.min(MAX,q)})}catch(e){}
function save(){try{localStorage.setItem('sarchin_cart',JSON.stringify(cart))}catch(e){}}

const root=document.createElement('div');
root.className='cart-overlay';root.id='cartOverlay';
root.innerHTML='<aside class="cart-panel" role="dialog" aria-label="سبد خرید"><div class="cart-head"><h3 id="cartTitle">سبد خرید</h3><button type="button" data-act="close" aria-label="بستن">×</button></div><div class="cart-body" id="cartBody"></div><div class="cart-foot" id="cartFoot"></div></aside>';
document.body.appendChild(root);
const body=root.querySelector('#cartBody'),foot=root.querySelector('#cartFoot'),title=root.querySelector('#cartTitle');

function totals(){let n=0,t=0;Object.keys(cart).forEach(id=>{n+=cart[id];t+=cart[id]*prods[id].price});return{n,t}}
function badge(){const {n}=totals();document.querySelectorAll('#cartCount').forEach(b=>{b.hidden=!n;b.textContent=fa(n)})}

function itemHTML(id){
  const p=prods[id],q=cart[id],href='product.html?id='+encodeURIComponent(id);
  return '<div class="cart-item"><a class="ci-img" href="'+href+'"><img src="'+esc(p.images[0])+'" alt=""></a>'+
  '<div class="ci-t"><a href="'+href+'"><b>'+esc(p.name)+'</b></a><span>'+fmt(p.price*q)+'</span>'+(q>=MAX?'<small>حداکثر '+fa(MAX)+' عدد</small>':'')+'</div>'+
  '<div class="ci-q"><button type="button" data-act="inc" data-id="'+id+'" aria-label="افزودن"'+(q>=MAX?' disabled':'')+'>+</button><span>'+fa(q)+'</span><button type="button" data-act="dec" data-id="'+id+'" aria-label="کم کردن">−</button></div></div>';
}
function render(){
  const ids=Object.keys(cart),{t}=totals();badge();
  if(view==='checkout'&&!ids.length)view='cart';
  if(view==='cart'){
    title.textContent='سبد خرید';
    body.innerHTML=ids.length?ids.map(itemHTML).join(''):'<p class="cart-empty">سبد خرید شما خالی است.</p>';
    foot.hidden=!ids.length;
    foot.innerHTML='<div class="cart-total"><span>جمع کل</span><b>'+fmt(t)+'</b></div><button type="button" class="cart-order" data-act="checkout">ثبت سفارش</button><button type="button" class="cart-clear" data-act="clear">خالی کردن سبد</button>';
  }else if(view==='checkout'){
    title.textContent='ثبت سفارش';
    let nm=ck.name;if(!nm){try{nm=(window.getUser&&window.getUser())||localStorage.getItem('sarchin_user')||''}catch(e){}}
    const S=sums();
    body.innerHTML='<div class="ck-sum">'+ids.map(id=>'<div><span>'+esc(prods[id].name)+' × '+fa(cart[id])+'</span><b>'+fmt(prods[id].price*cart[id])+'</b></div>').join('')+
    (disc?'<div class="ck-d"><span>تخفیف ۱۰٪ (کد '+CODE+')</span><b>−'+fmt(S.d)+'</b></div>':'')+
    '<div class="ck-t"><span>'+(disc?'مبلغ قابل پرداخت':'جمع کل')+'</span><b>'+fmt(S.f)+'</b></div></div>'+
    '<label class="ck-f">نام و نام خانوادگی<input id="ckName" type="text" autocomplete="name" value="'+esc(nm)+'"></label>'+
    '<label class="ck-f">شماره موبایل<input id="ckPhone" type="tel" inputmode="numeric" maxlength="11" dir="ltr" placeholder="09123456789" autocomplete="tel" value="'+esc(ck.phone)+'"></label>'+
    '<div class="ck-f">کد تخفیف<div class="ck-code"><input id="ckCode" type="text" dir="ltr" autocomplete="off" autocapitalize="characters" placeholder="کد تخفیف را وارد کنید" value="'+esc(disc?CODE:ck.code)+'"'+(disc?' readonly':'')+'><button type="button" data-act="applycode">'+(disc?'حذف':'اعمال')+'</button></div></div>'+
    '<p class="ck-ok" id="ckOk">'+(disc?'کد تخفیف اعمال شد ✓':'')+'</p>'+
    '<p class="ck-err" id="ckErr"></p>';
    foot.hidden=false;
    foot.innerHTML='<button type="button" class="cart-order" data-act="submit">ارسال و ثبت سفارش</button><button type="button" class="cart-clear" data-act="back">بازگشت به سبد</button>';
  }else{
    title.textContent='سفارش ثبت شد';
    body.innerHTML='<div class="cart-done"><div class="ok">✓</div><b>سفارش شما ثبت شد</b><p>شماره سفارش: <b dir="ltr">'+esc(lastOrder.id)+'</b><br>مبلغ سفارش: <b>'+fmt(lastOrder.total)+'</b><br>همکاران ما برای هماهنگی با شماره‌ی <b dir="ltr">'+esc(lastOrder.phone)+'</b> تماس می‌گیرند.</p></div>';
    foot.hidden=false;
    foot.innerHTML='<button type="button" class="cart-order" data-act="close">بستن</button>';
  }
}
function add(id,q){
  if(!prods[id])return{added:0,atMax:false};
  const cur=cart[id]||0,ok=Math.max(0,Math.min(q,MAX-cur));
  if(ok){cart[id]=cur+ok;save()}
  if(view==='done')view='cart';
  render();
  if(ok)open(true);
  return{added:ok,atMax:(cart[id]||0)>=MAX};
}
function change(id,d){
  if(!cart[id])return;
  cart[id]=Math.max(0,Math.min(MAX,cart[id]+d));
  if(!cart[id])delete cart[id];
  save();render();
}
function open(v){
  if(v&&view==='done')view='cart';
  root.classList.toggle('open',v);
  document.body.style.overflow=v?'hidden':'';
  if(v)render();
}
function submit(){
  const name=root.querySelector('#ckName').value.trim();
  const phone=toEn(root.querySelector('#ckPhone').value).replace(/\D/g,'');
  const err=root.querySelector('#ckErr');
  if(name.length<2){err.textContent='لطفاً نام خود را وارد کنید.';return}
  if(!/^09\d{9}$/.test(phone)){err.textContent='شماره موبایل معتبر نیست (مثال: 09123456789).';return}
  keep();
  if(!disc){
    const code=toEn((root.querySelector('#ckCode')||{value:''}).value).trim().toUpperCase();
    if(code){if(code===CODE){disc=true}else{err.textContent='کد تخفیف اشتباه است.';return}}
  }
  const S=sums(),t=S.f;
  const order={id:'SR'+Date.now().toString().slice(-7),name:name,phone:phone,total:t,subtotal:S.t,discount:S.d,code:disc?CODE:'',date:new Date().toISOString(),
    items:Object.keys(cart).map(id=>({id:id,name:prods[id].name,qty:cart[id],price:prods[id].price}))};
  /* TODO: ارسال order به سرور. فعلاً فقط در مرورگر ذخیره می‌شود. */
  try{const L=JSON.parse(localStorage.getItem('sarchin_orders')||'[]');L.push(order);localStorage.setItem('sarchin_orders',JSON.stringify(L))}catch(e){}
  try{window.onSarchinOrder&&window.onSarchinOrder(order)}catch(e){}
  lastOrder=order;cart={};disc=false;ck.code='';save();view='done';render();
}
root.addEventListener('click',e=>{
  if(e.target===root){open(false);return}
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,id=b.dataset.id;
  if(a==='close')open(false);
  else if(a==='inc')change(id,1);
  else if(a==='dec')change(id,-1);
  else if(a==='clear'){cart={};disc=false;ck.code='';save();render()}
  else if(a==='applycode'){
    keep();
    if(disc){disc=false;ck.code='';render();return}
    const code=toEn(root.querySelector('#ckCode').value).trim().toUpperCase(),err=root.querySelector('#ckErr');
    if(!code){err.textContent='کد تخفیف را وارد کنید.';return}
    if(code===CODE){disc=true;ck.code=CODE;render()}else err.textContent='کد تخفیف اشتباه است.';
  }
  else if(a==='checkout'){view='checkout';render()}
  else if(a==='back'){view='cart';render()}
  else if(a==='submit')submit();
});
root.addEventListener('input',e=>{if(e.target.id==='ckPhone')e.target.value=toEn(e.target.value).replace(/\D/g,'')});
document.addEventListener('click',e=>{
  if(e.target.closest('#cartFab')){open(true);return}
  const b=e.target.closest('[data-add]');
  if(!b)return;
  e.preventDefault();
  const r=add(b.dataset.add,1);
  if(!b.dataset.t)b.dataset.t=b.textContent;
  b.textContent=r.added?'به سبد اضافه شد ✓':'حداکثر '+fa(MAX)+' عدد در سبد';
  clearTimeout(b._t);b._t=setTimeout(()=>{b.textContent=b.dataset.t},1300);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
window.SarchinCart={add:add,open:open,max:MAX,count:id=>cart[id]||0};
render();
})();
