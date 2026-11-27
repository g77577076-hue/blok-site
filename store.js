(function(){
var C=window.BLOK_CFG,FB=C.firebase,CK='blok_rc_v1',NT=0;try{NT=localStorage.getItem('blok_nt')}catch(e){}
window.STATIC_CODES=(window.PRODUCTS||[]).map(function(p){return p.code}).concat(['BLOK-60','BLOK-67']);
function dec(v){if(!v)return null;if('stringValue'in v)return v.stringValue;if('integerValue'in v)return+v.integerValue;if('doubleValue'in v)return v.doubleValue;if('booleanValue'in v)return v.booleanValue;if('mapValue'in v){var o={},f=v.mapValue.fields||{};for(var k in f)o[k]=dec(f[k]);return o}if('arrayValue'in v)return(v.arrayValue.values||[]).map(dec);return null}
window.BLOKdec=dec;
try{var rm=location.search.match(/[?&]ref=([A-Za-z0-9]{3,20})(?:&|$)/);if(rm)localStorage.setItem('blok_ref',JSON.stringify({c:rm[1].toUpperCase(),t:Date.now()}))}catch(e){}
function col(n){return fetch('https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/'+n+'?pageSize=300&key='+FB.apiKey).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){return(j.documents||[]).map(function(d){var o={};for(var k in d.fields)o[k]=dec(d.fields[k]);return o})})}
function endMs(o){var e=o&&o.ends;if(!e)return 0;e=String(e);if(e.length===10)e+='T23:59:59';var m=+new Date(e);return isNaN(m)?0:m}
function startMs(o){var e=o&&o.starts;if(!e)return 0;e=String(e);if(e.length===10)e+='T00:00:00';var m=+new Date(e);return isNaN(m)?0:m}
function prep(ps,os){var now=Date.now();os=(os||[]).map(function(o){try{return JSON.parse(o.data)}catch(e){return null}}).filter(Boolean);
 return ps.map(function(r){var p;if(r.data){try{p=JSON.parse(r.data)}catch(e){return null}p.code=r.code;p.stock=r.stock||{};p.track=!!r.track;p.active=r.active!==false;p.remote=1;p.imgs=[r.thumb||(p.imgs&&p.imgs[0])||'1-logo-s.webp']}else{p=r;p.stock=p.stock||{};p.track=false;p.active=true}
  p.sizes=p.sizes||[];p.base=+p.price||0;p.price=p.base;
  var best=0,bo=null,cdt=0;os.forEach(function(o){if(!o.active)return;var sm=startMs(o);if(sm&&now<sm)return;var em=endMs(o);if(em&&now>em)return;var m=o.scope==='all'||(o.scope==='cat'&&o.target===p.cat)||(o.scope==='code'&&o.target===p.code);if(m&&+o.pct>best){best=+o.pct;bo=o}});
  var op=best&&p.base?Math.round(p.base*(100-best)/100):0,sp=(p.salePrice&&+p.salePrice<p.base&&+p.salePrice>0)?+p.salePrice:0;
  if(sp&&(!op||sp<=op)){p.price=sp;p.was=p.base;p.off=Math.round((1-p.price/p.base)*100);if(op&&bo&&bo.cd&&endMs(bo)>now)p.cd=endMs(bo)}
  else if(op){p.price=op;p.was=p.base;p.off=best;if(bo&&bo.cd&&endMs(bo)>now)p.cd=endMs(bo)}
  var t=0;for(var k in p.stock)t+=+p.stock[k]||0;p.total=t;p.soldout=p.track&&t<=0;p.lowstock=p.track&&t>0&&t<=(+p.lowAt||3);return p}).filter(function(p){return p&&p.active}).sort(function(a,b){return(a.ord||0)-(b.ord||0)})}
var done=0;function go(ps,os){if(done)return;done=1;if(ps&&ps.length)window.PRODUCTS=prep(ps,os);else window.PRODUCTS=prep(window.PRODUCTS||[],[]);main()}
function rc(){try{return JSON.parse(localStorage.getItem(CK))}catch(e){return null}}
if(!FB){go()}else{var c=rc(),fresh=c&&Date.now()-c.t<600000;
 var fx=Promise.all([col('products'),col('offers')]).then(function(r){try{localStorage.setItem(CK,JSON.stringify({t:Date.now(),ps:r[0],os:r[1]}))}catch(e){}return r});
 if(fresh){go(c.ps,c.os);fx.catch(function(){})}
 else{fx.then(function(r){go(r[0],r[1])}).catch(function(){go(c&&c.ps,c&&c.os)});setTimeout(function(){go(c&&c.ps,c&&c.os)},1800)}}
function main(){
var C=window.BLOK_CFG,P=window.PRODUCTS,D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var ROOT=D.body.getAttribute('data-root')||'',PAGE=D.body.getAttribute('data-page');
var fmt=function(n){return Number(n).toLocaleString('en-US')};
var IM=function(u){return /^(data:|https?:)/.test(u)?u:ROOT+u};
function plink(p){return window.STATIC_CODES.indexOf(p.code)>-1?ROOT+p.code+'.html':ROOT+'product.html?c='+encodeURIComponent(p.code)}
function ph(p){return p.was?'<s class="was">'+fmt(p.was)+'</s> '+fmt(p.price)+' <small>ج.م</small>':fmt(p.price)+' <small>ج.م</small>'}
var esc=function(s){var d=D.createElement('div');d.textContent=s==null?'':s;return d.innerHTML.replace(/"/g,'&quot;').replace(/'/g,'&#39;')};
var by=function(c){return P.filter(function(p){return p.code===c})[0]};
var LS={g:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},s:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var wa=function(t){return'https://wa.me/'+C.wa+'?text='+encodeURIComponent(t)};
/* ---------- analytics (GA4 ecommerce funnel + Clarity) ---------- */
var item=function(p,q,sz){return{item_id:p.code,item_name:p.name,item_category:p.cat,price:p.price,quantity:q||1,item_variant:sz||undefined,currency:'EGP'}};
var SID='';try{SID=sessionStorage.getItem('blok_sid');if(!SID){SID=(Date.now().toString(36)+Math.random().toString(36).slice(2,8));sessionStorage.setItem('blok_sid',SID)}}catch(e){SID=Date.now().toString(36)+'x'}
var LGM={view_item:1,select_size:1,add_to_cart:1,begin_checkout:1,order_press:1,purchase:1,checkout_abandon:1,checkout_error:1,whatsapp_click:1,survey:1,visit:1};
function lg(n,d){if(!LGM[n]||!FB||!SID)return;var p=d.code||(d.items&&d.items[0]&&d.items[0].item_id)||d.transaction_id||d.page||'',x=n=='select_size'?d.size:n=='purchase'?d.payment_type:n=='checkout_abandon'?d.last_field:n=='survey'?d.reason:n=='checkout_error'?d.count:n=='visit'?d.src:'';
var f={sid:{stringValue:SID},e:{stringValue:n},t:{timestampValue:new Date().toISOString()}};if(p)f.p={stringValue:String(p).slice(0,39)};if(x!=null&&x!=='')f.d={stringValue:String(x).slice(0,59)};
try{fetch('https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/ev?key='+FB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f}),keepalive:true}).catch(function(){})}catch(e){}}
function track(n,d){if(NT)return;d=d||{};try{window.gtag&&gtag('event',n,d)}catch(e){}try{window.clarity&&clarity('event',n)}catch(e){}lg(n,d);try{if(n=='view_item'||n=='add_to_cart'||n=='begin_checkout')sessionStorage.setItem('blok_vp','1');if(n=='purchase'||n=='order_press')sessionStorage.setItem('blok_done','1')}catch(e){}}
window.BLOKtrack=track;
/* lazy third parties: load after the page is interactive (first touch/scroll or 3.5s after load) so they never compete with first paint */
(function(){var done=0;function go(){if(done)return;done=1;if(NT)return;
if(C.ga){var g=D.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id='+C.ga;D.head.appendChild(g)}
if(C.clarity){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,D,'clarity','script',C.clarity)}}
['touchstart','scroll','keydown','pointerdown'].forEach(function(e){addEventListener(e,go,{once:true,passive:true})});
function arm(){setTimeout(function(){(window.requestIdleCallback||function(f){f()})(go)},3500)}
if(D.readyState==='complete')arm();else addEventListener('load',arm)})();
/* scroll depth */
var sd={};addEventListener('scroll',function(){var h=D.documentElement.scrollHeight-innerHeight;if(h<=0)return;var p=scrollY/h*100;[25,50,75,100].forEach(function(m){if(p>=m-1&&!sd[m]){sd[m]=1;track('scroll_depth',{percent:m,page:PAGE})}})},{passive:true});
/* ---------- cart ---------- */
var cart=LS.g('blok_cart',[]),wish=LS.g('blok_wish',[]);
function save(){LS.s('blok_cart',cart);badge()}
function count(){return cart.reduce(function(a,i){return a+i.qty},0)}
function sub(){return cart.reduce(function(a,i){var p=by(i.code);return a+(p&&p.price?p.price*i.qty:0)},0)}
function badge(){$$('.bd').forEach(function(b){var n=count();b.textContent=n;b.classList.toggle('z',!n)})}
function toast(m){var t=$('.toast');if(!t){t=D.createElement('div');t.className='toast';D.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},2200)}
function add(code,size,qty,from){var p=by(code);if(!p)return;qty=qty||1;var ex=cart.filter(function(i){return i.code===code&&i.size===size})[0];if(ex)ex.qty+=qty;else cart.push({code:code,size:size||'',qty:qty});save();
 track('add_to_cart',{currency:'EGP',value:p.price*qty,items:[item(p,qty,size)]});
 $$('.bd').forEach(function(b){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')});
 if(from){var im=from.querySelector('img')||from,r=im.getBoundingClientRect(),cb=$('.cartbtn').getBoundingClientRect(),f=D.createElement('img');f.src=IM(p.imgs[0]);f.className='fly';f.style.cssText='left:'+r.left+'px;top:'+r.top+'px;width:'+Math.min(r.width,90)+'px;height:'+Math.min(r.height,110)+'px';D.body.appendChild(f);requestAnimationFrame(function(){f.style.left=cb.left+'px';f.style.top=cb.top+'px';f.style.width='20px';f.style.height='26px';f.style.opacity='.3'});setTimeout(function(){f.remove()},750)}
 toast('اتضافت للسلة');renderDrawer()}
function setQty(i,d){var it=cart[i];if(!it)return;it.qty+=d;if(it.qty<1){rm(i);return}save();renderDrawer();if(PAGE==='checkout')renderSummary()}
function rm(i){var it=cart[i],p=it&&by(it.code);cart.splice(i,1);save();if(p)track('remove_from_cart',{currency:'EGP',value:p.price*it.qty,items:[item(p,it.qty,it.size)]});renderDrawer();if(PAGE==='checkout')renderSummary()}
/* drawer */
var ov=D.createElement('div');ov.className='ov';var dr=D.createElement('aside');dr.className='dr';dr.setAttribute('aria-label','السلة');
D.body.appendChild(ov);D.body.appendChild(dr);
function renderDrawer(){var h='<header><h3>سلتك</h3><button class="icb" id="dx" aria-label="اقفل">✕</button></header><div class="its">';
 if(!cart.length)h+='<div class="empty">السلة فاضية.<br>اختار قطعة وابدأ.</div>';
 cart.forEach(function(it,i){var p=by(it.code);if(!p)return;h+='<div class="ci"><img src="'+IM(p.imgs[0])+'" alt="'+esc(p.code)+'"><div><div class="t">'+esc(p.name)+'</div><div class="s"><bdi>'+p.code+'</bdi>'+(it.size?' · '+esc(it.size):'')+'</div><div class="qty"><button data-q="'+i+'" data-d="-1" aria-label="أقل">−</button><span>'+it.qty+'</span><button data-q="'+i+'" data-d="1" aria-label="أكتر">+</button></div></div><div style="text-align:end"><div class="price">'+fmt(p.price*it.qty)+'<small> ج.م</small></div><button class="x" data-r="'+i+'">شيل</button></div></div>'});
 h+='</div><footer><div class="tot"><span>الإجمالي</span><span>'+fmt(sub())+' ج.م</span></div><div class="note">الشحن منفصل حسب المحافظة 🚚</div><a class="btn blk '+(cart.length?'':'off')+'" '+(cart.length?'href="'+ROOT+'checkout.html"':'')+' id="goc">كمّل الطلب</a></footer>';
 dr.innerHTML=h}
function open(){renderDrawer();dr.classList.add('on');ov.classList.add('on');track('view_cart',{currency:'EGP',value:sub(),items:cart.map(function(i){return item(by(i.code),i.qty,i.size)})})}
function close(){dr.classList.remove('on');ov.classList.remove('on')}
ov.addEventListener('click',close);addEventListener('keydown',function(e){if(e.key==='Escape')close()});
dr.addEventListener('click',function(e){var t=e.target;if(t.id==='dx')close();var q=t.getAttribute('data-q');if(q!==null)setQty(+q,+t.getAttribute('data-d'));var r=t.getAttribute('data-r');if(r!==null)rm(+r);if(t.id==='goc'&&!cart.length)e.preventDefault()});
$$('.cartbtn').forEach(function(b){b.addEventListener('click',open)});badge();
/* generic */
$$('[data-wa]').forEach(function(a){a.href=wa(a.getAttribute('data-wa'));a.target='_blank';a.rel='noopener'});
$$('a[href*="wa.me"]').forEach(function(a){a.addEventListener('click',function(){track('whatsapp_click',{page:PAGE})})});
$$('a[data-social]').forEach(function(a){a.addEventListener('click',function(){track('social_click',{network:a.getAttribute('data-social')})})});
var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1}):null;
function reveal(r){$$('.rv',r).forEach(function(el){if(io)io.observe(el);else el.classList.add('in')})}reveal();
setTimeout(function(){$$('.rv:not(.in)').forEach(function(el){if(el.getBoundingClientRect().top<innerHeight*1.2)el.classList.add('in')})},500);
var root=D.documentElement,tick=false,tp=$('.top');
function sc(){var y=scrollY,h=root.scrollHeight-innerHeight;root.style.setProperty('--sy',y);root.style.setProperty('--p',h>0?y/h:0);if(tp)tp.classList.toggle('sm',y>40);tick=false}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(sc)}},{passive:true});sc();
/* tilt */
function tilt(el){if(matchMedia('(hover:none)').matches)return;el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ry',(x*-7)+'deg');el.style.setProperty('--rx',(y*7)+'deg')});el.addEventListener('pointerleave',function(){el.style.setProperty('--ry','0deg');el.style.setProperty('--rx','0deg')})}
$$('.hv').forEach(tilt);
/* prefetch on hover */
var pf={};function prefetch(u){if(pf[u])return;pf[u]=1;var l=D.createElement('link');l.rel='prefetch';l.href=u;D.head.appendChild(l)}
D.addEventListener('pointerover',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&a.host===location.host&&/\.html$|\/$/.test(a.pathname))prefetch(a.href)},{passive:true});
/* wishlist */
function heart(code){var i=wish.indexOf(code);if(i>-1)wish.splice(i,1);else{wish.push(code);track('add_to_wishlist',{items:[item(by(code))]})}LS.s('blok_wish',wish)}
/* product card */
function card(p,i){var h='<article class="card rv'+(p.soldout?' so':'')+'" style="--d:'+Math.min(i,8)*.06+'s"><button class="heart '+(wish.indexOf(p.code)>-1?'on':'')+'" data-h="'+p.code+'" aria-label="المفضلة"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.6-9.3 9-9.3 9z"/></svg></button>'+'<a href="'+plink(p)+'" data-p="'+p.code+'"><div class="im"><img src="'+IM(p.imgs[0])+'" alt="'+esc(p.name)+' '+p.code+'" loading="lazy" width="460" height="575">'+(p.imgs[1]?'<img class="sec2" src="'+IM(p.imgs[1])+'" alt="" loading="lazy">':'')+'</div></a><div class="inf"><div class="cd">'+p.code+'</div><div class="nm">'+esc(p.name)+'</div><div class="price">'+(p.price?ph(p):'<small>السعر على واتساب</small>')+'</div>'+(function(){var t=(p.soldout?'<span class="bg2 sob">خلص</span>':p.off?'<span class="bg2 offb">خصم '+p.off+'%</span>':p.badge?'<span class="bg2">'+esc(p.badge)+'</span>':'')+(p.lowstock?'<span class="lowtag">باقي '+p.total+' بس</span>':'')+(p.cd?'<span class="cdc" data-cd="'+p.cd+'"></span>':'');return t?'<div class="cchips">'+t+'</div>':''})()+(p.price&&!p.soldout?'<button class="add" data-a="'+p.code+'">'+(p.sizes.length?'اختار المقاس':'أضف للسلة')+'</button>':'')+'</div></article>';return h}
/* shop */
var G=$('#grid');
$$('.tabs [data-t]').forEach(function(a){var t=a.getAttribute('data-t'),on=(PAGE==='home'&&t==='home'&&!/wish=1/.test(location.search))||(PAGE==='home'&&t==='wish'&&/wish=1/.test(location.search))||(PAGE==='track'&&t==='user');if(on)a.classList.add('on')});
if(G){var cat='الكل',q='',so='';var cats=['الكل','جواكت','هوديز','سويت شيرت','قمصان','بناطيل جينز','أحذية'];
 var CH=$('#chips');function chips(){CH.innerHTML=cats.map(function(c){return'<button type="button" class="'+(c===cat?'on':'')+'" data-c="'+esc(c)+'">'+esc(c)+(c!=='الكل'?' <small>('+P.filter(function(p){return p.cat===c}).length+')</small>':'')+'</button>'}).join('')}
 function list(){var WL=/[?&]wish=1/.test(location.search),t=q.toUpperCase().replace(/\s+/g,''),l=P.filter(function(p){return(!WL||wish.indexOf(p.code)>-1)&&(cat==='الكل'||p.cat===cat)&&(!q||p.name.indexOf(q)>-1||p.code.indexOf(t)>-1)});
  if(so==='lo')l.sort(function(a,b){return a.price-b.price});if(so==='hi')l.sort(function(a,b){return b.price-a.price});
  G.innerHTML=l.map(card).join('')+(l.length&&!q?'<div class="soon rv"><div><b>DROP 01</b>قطع جديدة بتتنزل هنا أول بأول بكودها وصورها.</div></div>':'')||'<div class="empty" style="grid-column:1/-1">'+(q?'مفيش نتيجة.':'قسم '+cat+' لسه بيتجهز، قطع جديدة قريب.')+' <a style="color:var(--cu)" target="_blank" href="'+wa('بدور على: '+(q||cat))+'">اسألنا على واتساب</a></div>';
  reveal(G);$$('.card',G).forEach(tilt);track('view_item_list',{item_list_name:cat,items:l.map(function(p,i){var o=item(p);o.index=i;return o})})}
 chips();list();
 CH.addEventListener('click',function(e){var c=e.target.getAttribute('data-c');if(c){cat=c;chips();list()}});
 $('#sq').addEventListener('input',function(e){q=e.target.value.trim();list()});$('#so').addEventListener('change',function(e){so=e.target.value;list()});
 var cn=$('#cnt');if(cn)cn.textContent=P.length+' قطعة. كل قطعة ليها كود.'}
D.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-a],[data-h],[data-p]');if(!t)return;
 if(t.hasAttribute('data-a')){var pa=by(t.getAttribute('data-a'));if(pa&&pa.sizes.length){location.href=plink(pa)}else add(t.getAttribute('data-a'),'',1,t.closest('.card'))}
 if(t.hasAttribute('data-h')){e.preventDefault();heart(t.getAttribute('data-h'));t.classList.toggle('on')}
 if(t.hasAttribute('data-p')){var p=by(t.getAttribute('data-p'));track('select_item',{items:[item(p)]})}});
/* offer countdown */
(function(){var st=D.createElement('style');st.textContent='.cdw{margin:14px 0;padding:14px 16px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1px solid rgba(201,138,91,.4);backdrop-filter:blur(8px);animation:cdin .6s ease both}.cdt{display:block;font-size:12px;letter-spacing:.06em;color:#C98A5B;font-weight:800;margin-bottom:10px}.cdb{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;direction:rtl}.cdb div{display:grid;gap:2px;text-align:center;padding:9px 4px 7px;border-radius:12px;background:rgba(20,23,26,.7);border:1px solid rgba(255,255,255,.08)}.cdb b{font-size:24px;font-weight:900;color:#F3EDE3;font-variant-numeric:tabular-nums;line-height:1.1}.cdb small{font-size:10px;color:#8b949b;font-weight:700}.card .inf{display:flex!important;flex-direction:column;align-items:stretch;gap:8px;text-align:right;direction:rtl;padding:12px 10px 10px!important}.card .inf>*{margin:0!important}.card .inf .nm{min-height:3.2em;line-height:1.5}.card .inf .cd{text-align:right}.card .inf .price{text-align:right;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;line-height:1.6;margin:2px 0 6px}.card .inf .price .was{margin:0;white-space:nowrap}.card .inf .price small{white-space:nowrap}.card .cchips{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-start;min-width:0;margin:6px 0 8px}.card .cchips>*{font-size:11px!important;padding:2px 7px!important;white-space:nowrap;min-width:0}.wabtn{transition:opacity .25s,transform .25s}.wabtn.wh{opacity:0;pointer-events:none;transform:scale(.8)}.card .cchips>*{position:static!important;margin:0!important;display:inline-flex;align-items:center;line-height:1.4}.card .cchips .bg2{letter-spacing:.04em}.card .inf .add{width:100%}.cdc{display:inline-block;margin:4px 0;padding:2px 10px;white-space:nowrap;border-radius:99px;background:rgba(201,138,91,.12);border:1px solid rgba(201,138,91,.3);color:#C98A5B;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;direction:rtl}@keyframes cdin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}';D.head.appendChild(st);
function z(n){return n<10?'0'+n:''+n}
function tk(){var els=$$('[data-cd]');if(!els.length)return;var now=Date.now(),ex=0;els.forEach(function(e){var t=+e.getAttribute('data-cd'),d=t-now;if(d<=0){ex=1;e.parentNode&&e.parentNode.removeChild(e);return}var s=Math.floor(d/1000),dd=Math.floor(s/86400),hh=Math.floor(s%86400/3600),mm=Math.floor(s%3600/60),ss=s%60;
 if(e.classList.contains('cdw')){var v={d:dd,h:hh,m:mm,s:ss};$$('[data-u]',e).forEach(function(b){b.textContent=z(v[b.getAttribute('data-u')])})}else e.textContent=(e.closest('.cchips')?'⏱ ':'باقي ')+(dd?dd+'ي ':'')+z(hh)+':'+z(mm)+':'+z(ss)});
 if(ex){try{if(sessionStorage.getItem('blok_cdr')!==String(Math.floor(now/60000))&&PAGE!=='checkout'){sessionStorage.setItem('blok_cdr',String(Math.floor(now/60000)));location.reload()}}catch(e){}}}
tk();setInterval(tk,1000);(function(){var w=$('.wabtn'),f=$('.foot');if(w&&f&&window.IntersectionObserver)new IntersectionObserver(function(en){w.classList.toggle('wh',en[0].isIntersecting)},{threshold:0}).observe(f)})()})();
/* price lookup */
var LF=$('#lf');if(LF)LF.addEventListener('submit',function(e){e.preventDefault();var AR='٠١٢٣٤٥٦٧٨٩',raw=$('#lq').value,t=raw.replace(/[٠-٩]/g,function(d){return AR.indexOf(d)}).toUpperCase().replace(/\s+/g,''),m=t.match(/^(?:BLK-?)?(\d{1,3})$/),code=m?'BLK-'+m[1].padStart(3,'0'):'',p=code&&by(code),a=$('#ans');if(!t)return;
 a.hidden=false;a.innerHTML=p?'<img src="'+IM(p.imgs[0])+'" alt=""><div style="flex:1"><div class="cd" style="color:var(--cu)"><bdi>'+p.code+'</bdi></div><b>'+esc(p.name)+'</b><div class="price">'+fmt(p.price)+' <small>ج.م</small></div></div><a class="btn" href="'+plink(p)+'">افتح القطعة</a>':'<div style="flex:1"><b>'+(code?'مفيش سعر مؤكد عندي للكود ده.':'مش فاهم الكود ده.')+'</b><p class="note">ابعتلنا الكود أو صورة القطعة على واتساب وهنرد بالسعر الصح.</p></div><a class="btn wa" target="_blank" rel="noopener" href="'+wa('عايز أعرف سعر: '+raw)+'">واتساب</a>';
 track('price_lookup',{code:p?p.code:'not-found'})});
/* product page */
var PD=$('#pd');if(PD){var pcode=PD.getAttribute('data-code');if(pcode==='__')pcode=(location.search.match(/[?&]c=([^&]+)/)||[])[1]||'';pcode=decodeURIComponent(pcode).toUpperCase();var p=by(pcode);
 if(!p){PD.innerHTML='<div class="empty" style="grid-column:1/-1">القطعة دي مش موجودة أو اتشالت. <a style="color:var(--cu)" href="'+ROOT+'index.html#shop">ارجع للمتجر</a></div>'}
 else{var imgs=p.imgs.slice(),size='',qn=1,ix=0,sz=function(x){return p.track?(+p.stock[x]||0):99};
 D.title=p.name+' '+p.code+' | BLOK';$('h1',PD).textContent=p.name;$('.tag',PD).textContent=p.code;$('.muted',PD).textContent=p.desc||'';
 (function(){var m=$('.muted',PD),b=D.createElement('button');b.type='button';b.className='btn gh';b.id='cplk';b.style.cssText='margin:8px 0;padding:8px 14px;font-size:13px';b.textContent='🔗 نسخ لينك المنتج';b.addEventListener('click',function(){var u=new URL(plink(p),location.href).href;var ok=function(){toast('اتنسخ لينك المنتج')};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(ok,function(){prompt('انسخ اللينك:',u)})}else{prompt('انسخ اللينك:',u)}});m.parentNode.insertBefore(b,m.nextSibling)})();
 $$('.price',PD).concat($$('.stickybuy .price')).forEach(function(e){e.innerHTML=ph(p)});
 var pe=$('.price',PD);if(pe&&p.lowstock){pe.insertAdjacentHTML('afterend','<div class="lowtag">باقي '+p.total+' قطع بس</div>')}
 if(pe&&p.cd){var an=pe.nextElementSibling&&pe.nextElementSibling.classList.contains('lowtag')?pe.nextElementSibling:pe;an.insertAdjacentHTML('afterend','<div class="cdw" data-cd="'+p.cd+'"><span class="cdt">العرض بينتهي بعد</span><div class="cdb"><div><b data-u="d">00</b><small>يوم</small></div><div><b data-u="h">00</b><small>ساعة</small></div><div><b data-u="m">00</b><small>دقيقة</small></div><div><b data-u="s">00</b><small>ثانية</small></div></div></div>')}
 var ss=p.sizes;var so=$('#sizes');
 if(!ss.length){so.parentNode.hidden=true}else{so.innerHTML=ss.map(function(x){return'<button type="button" data-s="'+esc(x)+'" class="'+(sz(x)<=0?'oos':'')+'" '+(sz(x)<=0?'disabled':'')+'>'+esc(x)+'</button>'}).join('');var f1=ss.filter(function(x){return sz(x)>0})[0];size=f1||'';var b1=$$('#sizes button').filter(function(b){return b.getAttribute('data-s')===size})[0];if(b1)b1.classList.add('on')}
 function gal(){var bi=$('#big img');bi.src=IM(imgs[ix]);bi.alt=p.name;var T=$('#thumbs'),bs=T.querySelectorAll('button[data-i]');if(bs.length!==imgs.length){T.innerHTML=imgs.map(function(im,k){return'<button type="button" class="'+(k===ix?'on':'')+'" data-i="'+k+'" aria-label="صورة '+(k+1)+'"><img src="'+IM(im)+'" alt="" loading="lazy" draggable="false"></button>'}).join('');bs=T.querySelectorAll('button[data-i]')}else{for(var k=0;k<bs.length;k++)bs[k].classList.toggle('on',k===ix)}var cur=bs[ix];if(cur&&T.scrollWidth>T.clientWidth){var tl=cur.offsetLeft-(T.clientWidth-cur.offsetWidth)/2;try{T.scrollTo({left:tl,behavior:'smooth'})}catch(e){T.scrollLeft=tl}}}
(function(){var st=D.createElement('style');st.textContent='.thumbs{display:flex;gap:10px;margin-top:10px;overflow-x:auto;overflow-y:hidden;max-width:100%;-webkit-overflow-scrolling:touch;touch-action:pan-x;scroll-snap-type:x proximity;overscroll-behavior-x:contain;padding-bottom:6px;scrollbar-width:thin}.thumbs button{flex:0 0 72px;scroll-snap-align:center}.thumbs img{-webkit-user-drag:none;user-select:none}.big{touch-action:pan-y}.pd>*{min-width:0}.gal{min-width:0;max-width:100%}.thumbs{width:100%;box-sizing:border-box}';D.head.appendChild(st)})();
 gal();
 if(p.remote){fetch('https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/pimgs/'+encodeURIComponent(p.code)+'?key='+FB.apiKey).then(function(r){return r.ok?r.json():null}).then(function(j){if(!j||!j.fields)return;var a=JSON.parse(dec(j.fields.data)||'[]');if(a.length){imgs=a;ix=0;gal()}}).catch(function(){})}
 track('view_item',{currency:'EGP',value:p.price,items:[item(p)]});
 (function(){var bg=$('#big'),x0=0,y0=0,on=0;bg.addEventListener('touchstart',function(e){var t=e.touches[0];x0=t.clientX;y0=t.clientY;on=1},{passive:true});bg.addEventListener('touchend',function(e){if(!on)return;on=0;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4&&imgs.length>1){ix=(ix+(dx<0?1:-1)+imgs.length)%imgs.length;gal();track('gallery_view',{code:p.code,image:ix+1})}},{passive:true})})();
 $('#thumbs').addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;ix=+b.getAttribute('data-i');gal();track('gallery_view',{code:p.code,image:ix+1})});
 var bg=$('#big');bg.addEventListener('click',function(){bg.classList.toggle('z')});bg.addEventListener('pointermove',function(e){var r=bg.getBoundingClientRect();bg.style.setProperty('--zx',(e.clientX-r.left)/r.width*100+'%');bg.style.setProperty('--zy',(e.clientY-r.top)/r.height*100+'%')});
 so.addEventListener('click',function(e){var b=e.target.closest('button[data-s]');if(!b||b.disabled)return;size=b.getAttribute('data-s');qn=Math.min(qn,sz(size));$('#qn').textContent=qn;$$('#sizes button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');track('select_size',{code:p.code,size:size})});
 $('#qm').addEventListener('click',function(){qn=Math.max(1,qn-1);$('#qn').textContent=qn});$('#qp').addEventListener('click',function(){qn=Math.min(9,qn+1,Math.max(1,sz(size)));$('#qn').textContent=qn});
 function need(){if(p.sizes.length&&!size){toast('اختار المقاس الأول');return 1}return 0}
 if(p.soldout){$$('.addp,.buyp').forEach(function(b){b.disabled=true;b.textContent='خلص'})}
 $$('.addp').forEach(function(b){b.addEventListener('click',function(){if(need())return;add(p.code,size,qn,$('#big'))})});
 $$('.buyp').forEach(function(b){b.addEventListener('click',function(){if(need())return;add(p.code,size,qn,$('#big'));setTimeout(function(){location.href=ROOT+'checkout.html'},350)})});
 var wl=$('#wl');if(wl){wl.classList.toggle('on',wish.indexOf(p.code)>-1);wl.addEventListener('click',function(){heart(p.code);wl.classList.toggle('on')})}
 var rel=$('#rel');if(rel){var o=P.filter(function(x){return x.code!==p.code});if(o.length){rel.innerHTML=o.slice(0,4).map(card).join('');reveal(rel)}else rel.parentNode.hidden=true}}}
/* checkout */
var GOV=['القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة','الفيوم','الغربية','الإسماعيلية','المنوفية','المنيا','القليوبية','الوادي الجديد','السويس','أسوان','أسيوط','بني سويف','بورسعيد','دمياط','الشرقية','جنوب سيناء','كفر الشيخ','مطروح','الأقصر','قنا','شمال سيناء','سوهاج'];
var SHP={},COUP=null;
function fsGet(p){return fetch('https://firestore.googleapis.com/v1/projects/'+C.firebase.projectId+'/databases/(default)/documents/'+p+'?key='+C.firebase.apiKey).then(function(r){return r.ok?r.json():null}).catch(function(){return null})}
function disc(){return COUP?Math.min(sub()-1,Math.floor(sub()*COUP.pct/100)):0}
function shipTxt(){var g=CF&&CF.elements&&CF.elements.gov?CF.elements.gov.value:'',v=g&&SHP[g];return(v!==undefined&&v!==''&&!isNaN(+v))?fmt(+v)+' ج.م':'بيتحدد حسب المحافظة'}
function renderSummary(){var S=$('#sum');if(!S)return;var h='';cart.forEach(function(it,i){var p=by(it.code);if(!p)return;h+='<div class="ci"><img src="'+IM(p.imgs[0])+'" alt=""><div><div class="t">'+esc(p.name)+'</div><div class="s"><bdi>'+p.code+'</bdi>'+(it.size?' · '+esc(it.size):'')+'</div><div class="qty"><button data-q="'+i+'" data-d="-1" type="button">−</button><span>'+it.qty+'</span><button data-q="'+i+'" data-d="1" type="button">+</button></div></div><div class="price">'+fmt(p.price*it.qty)+'<small> ج.م</small></div></div>'});
 var s0=sub(),dc=disc(),s=s0-dc,dep=0;
 S.innerHTML=(h||'<div class="empty">السلة فاضية. <a style="color:var(--cu)" href="'+ROOT+'index.html#shop">ارجع للمتجر</a></div>')+'<div class="tot"><span>المنتجات</span><span>'+fmt(s0)+' ج.م</span></div>'+(dc?'<div class="tot"><span>كوبون '+esc(COUP.code)+' ('+COUP.pct+'%)</span><span>-'+fmt(dc)+' ج.م</span></div><div class="tot"><span>بعد الخصم</span><span>'+fmt(s)+' ج.م</span></div>':'')+'<div class="tot"><span>الشحن</span><span>'+shipTxt()+'</span></div><div class="tot big"><span>الدفع</span><span id="payv">'+(({cod:'عند الاستلام',card:'فيزا / كارت',vcash:'فودافون كاش'})[(D.querySelector('input[name=pay]:checked')||{}).value]||'عند الاستلام')+'</span></div><p class="note">الشحن منفصل حسب المحافظة.</p>';
 var d=$('#depv');if(d)d.textContent=fmt(dep)+' ج.م'}
var CF=$('#cf');
if(CF){var PV={cod:'عند الاستلام',card:'فيزا / كارت',vcash:'فودافون كاش'};CF.addEventListener('change',function(e){if(e.target&&e.target.id==='shot'){var fl=e.target.files[0],pv=$('#shotprev'),er=$('#shoter');er.textContent='';if(fl&&/^image\//.test(fl.type)){pv.src=URL.createObjectURL(fl);pv.hidden=false;$('#shotlbl').firstChild.textContent='✅ '+fl.name.slice(0,28)+' (دوس لتغيير الصورة)'}else{pv.hidden=true;e.target.value='';er.textContent='اختار صورة (لقطة شاشة) بس'}}if(e.target&&e.target.name==='pay'){var sb=$('#shotbox');if(sb)sb.hidden=e.target.value!=='vcash';var v=$('#payv');if(v)v.textContent=PV[e.target.value]||''}});var u=LS.g('blok_user',{});$('#gov').innerHTML='<option value="">اختار المحافظة</option>'+GOV.map(function(g){return'<option>'+g+'</option>'}).join('');
 ['name','phone','gov','address'].forEach(function(k){if(u[k])CF.elements[k].value=u[k]});
 renderSummary();
 fsGet('shipping/rates').then(function(d){try{SHP=JSON.parse(d.fields.rates.stringValue)||{};renderSummary()}catch(e){}});
 if(CF.elements.gov)CF.elements.gov.addEventListener('change',renderSummary);
 (function(){var sbt=$('.btn.blk[type=submit]',CF);if(!sbt)return;var cw=document.createElement('div');cw.id='cpw';cw.style.cssText='display:grid;gap:6px';cw.innerHTML='<div style="display:flex;gap:8px"><input id="cpi" type="text" autocomplete="off" autocapitalize="characters" dir="ltr" maxlength="20" placeholder="كود الخصم (لو عندك)" aria-label="كود الخصم" style="flex:1;min-width:0"><button type="button" class="btn gh" id="cpa">تطبيق</button></div><div id="cpm" class="note" style="margin:0"></div>';sbt.parentNode.insertBefore(cw,sbt);
  var ci=$('#cpi'),cm=$('#cpm');
  function ap(){var c=(ci.value||'').trim().toUpperCase();if(COUP&&!c){COUP=null;cm.textContent='';renderSummary();return}if(!/^[A-Z0-9]{3,20}$/.test(c)){cm.textContent='الكود غير صحيح';return}cm.textContent='بنتحقق...';fsGet('coupons/'+c).then(function(d){var f=d&&d.fields,pct=f&&f.pct?+(f.pct.integerValue||f.pct.doubleValue):0,on=f&&f.active&&f.active.booleanValue===false?false:!!f,en=f&&f.ends&&f.ends.stringValue;var mkf=!!(f&&f.mk);if(!f||!on||!(mkf?(pct>=0&&pct<=90):(pct>=1&&pct<=90))||(en&&en<new Date().toISOString().slice(0,10))){COUP=null;cm.textContent='الكود غير صحيح أو انتهى';renderSummary();return}COUP={code:c,pct:pct,mk:mkf};cm.textContent=pct?'✅ اتطبق خصم '+pct+'%':'✅ الكود اتسجل';renderSummary()})}
  $('#cpa').addEventListener('click',ap);try{var rf=JSON.parse(localStorage.getItem('blok_ref')||'null');if(rf&&rf.c&&Date.now()-rf.t<2592e6){ci.value=rf.c;ap();setTimeout(function(){if(!COUP){ci.value='';cm.textContent='';try{localStorage.removeItem('blok_ref')}catch(e){}}},6000)}}catch(e){}ci.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();ap()}})})();
 track('begin_checkout',{currency:'EGP',value:sub(),items:cart.map(function(i){return item(by(i.code),i.qty,i.size)})});
 var seen={};$$('input,select,textarea',CF).forEach(function(el){el.addEventListener('focus',function(){var n=el.name||el.getAttribute('data-n');if(n&&!seen[n]){seen[n]=1;track('checkout_field',{field:n})}})});
 $$('input[name=pay]',CF).forEach(function(r){r.addEventListener('change',function(){track('add_payment_info',{currency:'EGP',value:sub(),payment_type:r.value})})});
 var ab=function(){if(cart.length&&!CF._done&&Object.keys(seen).length)track('checkout_abandon',{last_field:Object.keys(seen).pop()})};addEventListener('pagehide',ab);
function shrink(file){return new Promise(function(res,rej){var im=new Image(),u=URL.createObjectURL(file);im.onload=function(){var m=1000,w=im.width,h=im.height,k=Math.min(1,m/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);var q=.72,d=c.toDataURL('image/jpeg',q);while(d.length>420000&&q>.3){q-=.1;d=c.toDataURL('image/jpeg',q)}if(d.length>700000)rej(new Error('big'));else res(d)};im.onerror=function(){rej(new Error('bad'))};im.src=u})}
 CF.addEventListener('submit',function(e){e.preventDefault();var f=CF.elements,er=0;
  function bad(n,m){var el=f[n];el.setAttribute('aria-invalid','true');var x=el.parentNode.querySelector('.er');if(x)x.textContent=m;er++}
  $$('.er',CF).forEach(function(x){x.textContent=''});
  if(!cart.length){toast('السلة فاضية');return}
  if(f.name.value.trim().length<3)bad('name','اكتب اسمك');
  var ph=f.phone.value.replace(/[٠-٩]/g,function(d){return'٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[\s-]/g,'');if(!/^(\+?20|0)?1[0125]\d{8}$/.test(ph))bad('phone','رقم موبايل مصري صحيح (مثال 01012345678)');
  if(!f.gov.value)bad('gov','اختار المحافظة');if(f.address.value.trim().length<8)bad('address','اكتب العنوان بالتفصيل');
  var shf=f.pay&&f.pay.value==='vcash'?($('#shot').files[0]||null):null;if(f.pay&&f.pay.value==='vcash'&&!shf){$('#shoter').textContent='لازم ترفع صورة التحويل (إجباري)';er++;var sbx=$('#shotbox');if(sbx&&!$('[aria-invalid=true]',CF))sbx.scrollIntoView({behavior:'smooth',block:'center'})}
  if(f._honey.value)return;track('order_press',{});try{var H=JSON.parse(localStorage.getItem('blok_ot')||'[]').filter(function(x){return Date.now()-x<3600000});if(H.length&&Date.now()-H[H.length-1]<20000||H.length>=6){alert('استنى شوية وجرّب تاني (طلبات كتير ورا بعض).');return}}catch(e){}if(er){track('checkout_error',{count:er});var fe=$('[aria-invalid=true]',CF);if(fe)fe.focus();return}
  var bad2=cart.filter(function(i){var p=by(i.code);if(!p)return true;if(!p.track)return false;var a=i.size?(+p.stock[i.size]||0):p.total;return i.qty>a});
  if(bad2.length){toast('في قطعة في السلة خلصت أو الكمية أكبر من المتاح. راجع السلة.');return}
  var s=sub()-disc(),dep=0,id='BLK-'+Date.now().toString(36).toUpperCase().slice(-6),method=(f.pay&&f.pay.value)||'cod';
  var fin=function(){
  var lines=cart.map(function(i){var p=by(i.code);return p.code+' | '+p.name+(i.size?' | '+i.size:'')+' | x'+i.qty+' | '+fmt(p.price*i.qty)+' ج.م'});if(COUP&&disc()>0)lines.push('كوبون '+COUP.code+' | خصم '+COUP.pct+'% | -'+disc()+' ج.م');else if(COUP&&COUP.mk)lines.push('🤝 كود مسوّق '+COUP.code+' | بدون خصم | 0 ج.م');
  var o={id:id,name:f.name.value.trim(),phone:ph,gov:f.gov.value,address:f.address.value.trim(),notes:f.notes.value.trim(),items:cart.slice(),lines:lines,subtotal:s,deposit:dep,pay:method,ts:new Date().toISOString(),status:method==='cod'?'بانتظار تأكيد الواتساب':method==='card'?'بانتظار لينك الدفع بالكارت':'بانتظار تحويل فودافون كاش'};
  LS.s('blok_user',{name:o.name,phone:o.phone,gov:o.gov,address:o.address});var os=LS.g('blok_orders',[]);os.unshift(o);LS.s('blok_orders',os.slice(0,30));
  CF._done=1;submit(o);
  track('purchase',{transaction_id:id,currency:'EGP',value:s,shipping:0,payment_type:method,items:cart.map(function(i){return item(by(i.code),i.qty,i.size)})});
  done(o);cart=[];save()
  };
  if(method==='vcash'){var btn=$('.btn.blk[type=submit]',CF);if(btn){btn.disabled=true;btn.textContent='بنرفع صورة التحويل...'}shrink(shf).then(function(img){return fetch('https://firestore.googleapis.com/v1/projects/'+C.firebase.projectId+'/databases/(default)/documents/shots?documentId='+id+'&key='+C.firebase.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{id:{stringValue:id},img:{stringValue:img},createdAt:{timestampValue:new Date().toISOString()}}})}).then(function(r){if(!r.ok)throw new Error('up')})}).then(fin).catch(function(){if(btn){btn.disabled=false;btn.textContent='أكّد الطلب'}$('#shoter').textContent='معرفناش نرفع الصورة. جرّب صورة تانية أو تأكد من النت.';toast('فشل رفع الصورة')})}else fin()})}
function submit(o){var txt='['+o.id+'] '+o.lines.join(' ; ')+' | محافظة: '+o.gov+' | عنوان: '+o.address+' | إجمالي: '+o.subtotal+' | دفع: '+o.pay+(o.notes?' | ملاحظات: '+o.notes:'');
 if(C.firebase){try{fetch('https://firestore.googleapis.com/v1/projects/'+C.firebase.projectId+'/databases/(default)/documents/orders?documentId='+o.id+'&key='+C.firebase.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{id:{stringValue:o.id},name:{stringValue:o.name},phone:{stringValue:o.phone},gov:{stringValue:o.gov},address:{stringValue:o.address},notes:{stringValue:o.notes},items:{stringValue:o.lines.join('\n')},subtotal:{integerValue:String(o.subtotal)},deposit:{integerValue:String(o.deposit)},pay:{stringValue:o.pay},cart:{stringValue:JSON.stringify(o.items)},status:{stringValue:'new'},createdAt:{timestampValue:o.ts}}}),keepalive:true})}catch(e){}}
 var b=new URLSearchParams();b.append('entry.2117167215',o.name);b.append('entry.157568974',o.phone);b.append('entry.707650105','[طلب متجر] '+txt);try{fetch(C.form,{method:'POST',mode:'no-cors',body:b,keepalive:true})}catch(e){}}
var PAYL={cod:'عند الاستلام',card:'فيزا / كارت (لينك دفع على واتساب)',vcash:'فودافون كاش'};
function done(o){try{var H=JSON.parse(localStorage.getItem('blok_ot')||'[]').filter(function(x){return Date.now()-x<3600000});H.push(Date.now());localStorage.setItem('blok_ot',JSON.stringify(H))}catch(e){}var VC=C.show||'01023279424',tot=fmt(o.subtotal),pm=o.pay;
 var msg='طلب جديد من متجر BLOK\nرقم الطلب: '+o.id+'\nالاسم: '+o.name+'\nالموبايل: '+o.phone+'\nالمحافظة: '+o.gov+'\nالعنوان: '+o.address+'\n'+o.lines.join('\n')+'\nالإجمالي: '+tot+' ج.م\nالدفع: '+(PAYL[pm]||pm)+(o.notes?'\nملاحظات: '+o.notes:'');
 var pay='';
 if(pm==='cod')pay='<div>الإجمالي <b>'+tot+' ج.م</b> (من غير الشحن)، والدفع <b>كاش عند الاستلام</b>.</div><div class="note">ابعت تفاصيل الطلب على واتساب وبنأكد معاك المقاس والشحن قبل ما نشحن.</div>';
 else if(pm==='card')pay='<div>الإجمالي <b>'+tot+' ج.م</b> (من غير الشحن)، والدفع <b>بالفيزا / الكارت</b>.</div><div class="note">ابعت الطلب على واتساب وهنبعتلك لينك دفع آمن بالمبلغ النهائي بعد تأكيد المقاس والشحن.</div>';
 else pay='<div class="vc"><div>حوّل <b>'+tot+' ج.م</b> (قيمة القطع) على محفظة فودافون كاش:</div><div class="vn" dir="ltr">'+VC+'</div><div class="row2"><button type="button" class="btn gh" id="cpn">انسخ الرقم</button><a class="btn gh" id="vapp" href="tel:*9%23" data-intent="intent://#Intent;package=com.emeint.android.myservices;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.emeint.android.myservices;end">افتح تطبيق أنا فودافون</a></div><div class="note">من تطبيق «أنا فودافون» أو الكود *9# اختار تحويل أموال وحوّل على الرقم ده. الشحن منفصل. بعد التحويل دوس الزرار تحت.</div></div>';
 var vmsg=msg+'\nحوّلت '+tot+' ج.م على فودافون كاش '+VC+'. مرفق لقطة شاشة التحويل.';
 var btn=pm==='vcash'?'<a class="btn wa blk" target="_blank" rel="noopener" href="'+wa(vmsg)+'" id="sendwa">حوّلت وابعت التأكيد على واتساب</a>':'<a class="btn wa blk" target="_blank" rel="noopener" href="'+wa(msg)+'" id="sendwa">ابعت تفاصيل الطلب على واتساب</a>';
 $('#ckw').innerHTML='<div class="box okb"><h2>تمام يا '+esc(o.name.split(' ')[0])+'، طلبك اتسجل ✅</h2><div>رقم الطلب: <b dir="ltr">'+esc(o.id)+'</b></div>'+pay+btn+'<a class="btn gh blk" href="'+ROOT+'track.html">متابعة الطلب</a></div>';
 var cp=$('#cpn');if(cp)cp.addEventListener('click',function(){var done2=function(){toast('اتنسخ الرقم ✅')};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(VC).then(done2,function(){toast(VC)});else toast(VC)});
 scrollTo({top:0,behavior:'smooth'})}
/* track / account */
var OL=$('#ol');if(OL){var os=LS.g('blok_orders',[]);var u2=LS.g('blok_user',{});var hid=LS.g('blok_hidden',[]);
 var drawOL=function(showAll){var vis=os.filter(function(o){return showAll||hid.indexOf(o.id)<0}),nh=os.length-os.filter(function(o){return hid.indexOf(o.id)<0}).length;
  var h=vis.length?vis.map(function(o){var isH=hid.indexOf(o.id)>-1;return'<div class="od"><div><b>'+esc(o.id)+'</b> · '+new Date(o.ts).toLocaleDateString('ar-EG')+'</div><div class="note">'+o.lines.map(esc).join('<br>')+'</div><div>الإجمالي '+fmt(o.subtotal)+' ج.م · '+(PAYL[o.pay]||'عند الاستلام')+'</div><div style="color:var(--cu)">'+esc(o.status)+'</div><div class="oact"><a class="btn wa" target="_blank" rel="noopener" href="'+wa('عايز أتابع طلبي رقم '+o.id)+'">اسأل عن الطلب</a><button type="button" class="btn gh" data-oh="'+esc(o.id)+'" data-on="'+(isH?0:1)+'">'+(isH?'رجّعه للقايمة':'إخفاء من قائمتي')+'</button></div></div>'}).join(''):'<div class="empty">'+(os.length?'كل الطلبات مخفية من القايمة دي.':'مفيش طلبات على الجهاز ده لسه.')+'</div>';
  if(nh&&!showAll)h+='<button type="button" class="btn gh ohall" data-oall="1">إظهار الطلبات المخفية ('+nh+')</button>';
  if(showAll&&nh)h+='<button type="button" class="btn gh ohall" data-oall="0">إخفاء المخفية تاني</button>';
  OL.innerHTML=h};
 var showA=false;drawOL(false);
 OL.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-oall')){showA=b.getAttribute('data-oall')==='1';drawOL(showA);return}
  if(b.hasAttribute('data-oh')){var id=b.getAttribute('data-oh'),on=b.getAttribute('data-on')==='1';
   if(on&&!confirm('هتخفي الطلب ده من القايمة على الجهاز ده بس. الطلب نفسه مش هيتلغي ولا هيتمسح، ولو عايز تلغيه كلمنا على واتساب.'))return;
   hid=hid.filter(function(x){return x!==id});if(on)hid.push(id);LS.s('blok_hidden',hid);drawOL(showA)}});
 var TF=$('#tf');if(TF)TF.addEventListener('submit',function(e){e.preventDefault();var v=$('#tq').value.trim();track('track_order',{});location.href=wa('عايز أتابع طلبي رقم '+v)})}
D.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#sum [data-q]');if(t)setQty(+t.getAttribute('data-q'),+t.getAttribute('data-d'))});
/* hidden owner entry: 5 quick taps on the footer copyright line */
(function(){var n=0,t0=0;D.addEventListener('click',function(e){var f=e.target.closest&&e.target.closest('.foot p');if(!f)return;var now=Date.now();if(now-t0>3000)n=0;if(!n)t0=now;n++;if(n>=5){n=0;location.href=ROOT+'admin.html'}})})();
/* sw */
if('serviceWorker' in navigator&&location.protocol==='https:'){addEventListener('load',function(){navigator.serviceWorker.register(ROOT+'sw.js').catch(function(){})})}
}
})();

document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("#vapp");if(a&&/Android/i.test(navigator.userAgent)){e.preventDefault();location.href=a.getAttribute("data-intent")}});

/* BLOK background recitation: Surat At-Tahrim 66 full surah (recitation by Islam Sobhi), streamed from cdn.mp3quran.net (mp3quran.net, free use per its copyright note), not copied into the repo; nothing loads before first touch; position resumes across pages. Starts on first touch/click/key; header button mutes, choice is remembered. */
(function(){
var a=null,pl=false,btn=null,fade=null,VOL=0.16,KEY='blok_snd',PK='blok_snd_pos66',lastSv=0,ctx=null,fxd=0;
function fx(){if(fxd||!a)return;fxd=1;try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();var src=ctx.createMediaElementSource(a),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;var dl=ctx.createDelay(1);dl.delayTime.value=0.24;var fb=ctx.createGain();fb.gain.value=0.38;var dw=ctx.createGain();dw.gain.value=0.3;src.connect(ctx.destination);src.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(dw);dw.connect(ctx.destination)}catch(e){fxd=2}}
function rs(){if(ctx&&ctx.state==='suspended')ctx.resume().catch(function(){})}
function ld(){try{return JSON.parse(localStorage.getItem(PK))||{}}catch(e){return{}}}
function sv(force){if(!a)return;var n=Date.now();if(!force&&n-lastSv<1000)return;lastSv=n;try{localStorage.setItem(PK,JSON.stringify({t:a.currentTime||0,at:n,p:pl?1:0}))}catch(e){}}
function pref(){try{return localStorage.getItem(KEY)!=='off'}catch(e){return true}}
function setPref(v){try{localStorage.setItem(KEY,v?'on':'off')}catch(e){}}
function ico(on){return on?'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>':'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'}
function paint(){if(!btn)return;btn.innerHTML=ico(pl);btn.classList.toggle('on',pl);btn.setAttribute('aria-pressed',pl?'true':'false');var l=pl?'كتم الموسيقى':'شغّل الموسيقى';btn.setAttribute('aria-label',l);btn.title=l}
function mk(){if(a)return a;a=new Audio();a.preload='auto';a.crossOrigin='anonymous';a.addEventListener('error',function(){if(a.crossOrigin){var t=a.currentTime;a.removeAttribute('crossorigin');a.crossOrigin=null;fxd=2;a.src=a.src;if(pl)a.play().catch(function(){})}});a.src='https://cdn.mp3quran.net/audio/islam-sobhi/r1/066.mp3';a.volume=0;var S=ld();if(S.t>0){a.addEventListener('loadedmetadata',function(){var t=S.t;if(S.p&&Date.now()-S.at<20000)t+=(Date.now()-S.at)/1000;if(!isFinite(a.duration)||t>=a.duration-1)t=0;try{a.currentTime=t}catch(e){}},{once:true})}a.addEventListener('timeupdate',function(){sv()});var stT=0;function unst(){clearTimeout(stT)}a.addEventListener('playing',unst);a.addEventListener('pause',unst);a.addEventListener('stalled',function(){if(!pl)return;clearTimeout(stT);stT=setTimeout(function(){if(pl&&a.readyState<3){var t=a.currentTime;a.load();a.addEventListener('loadedmetadata',function(){try{a.currentTime=t}catch(e){}a.play().catch(function(){})},{once:true})}},4000)});a.addEventListener('playing',function(){if(a.crossOrigin){fx();rs()}});a.addEventListener('ended',function(){try{localStorage.setItem(PK,JSON.stringify({t:0,at:Date.now(),p:pl?1:0}))}catch(e){}if(!pl)return;setTimeout(function(){if(pl){a.currentTime=0;a.volume=0;a.play().then(fadeIn).catch(function(){})}},5000)});return a}
function fadeIn(){clearInterval(fade);var v=a.volume||0;fade=setInterval(function(){v+=0.01;if(v>=VOL){v=VOL;clearInterval(fade)}a.volume=v},120)}
function play(){var x=mk();var p=x.play();if(p&&p.then){p.then(function(){pl=true;fadeIn();paint()}).catch(function(){pl=false;paint()})}else{pl=true;fadeIn();paint()}}
function stop(){clearInterval(fade);if(a)a.pause();pl=false;paint();sv(true)}
function ui(){var nav=document.querySelector('nav.top');if(!nav||document.getElementById('blokSnd'))return;
var s=document.createElement('style');s.textContent='#blokSnd.on svg{stroke:var(--cu)}#blokSnd.on{border-color:var(--cu)}';document.head.appendChild(s);
btn=document.createElement('button');btn.id='blokSnd';btn.type='button';btn.className='icb';nav.appendChild(btn);paint();
btn.addEventListener('click',function(e){e.stopPropagation();if(pl){setPref(false);stop()}else{setPref(true);play()}})}
var evs=['touchend','pointerup','click','keydown','scroll','wheel','touchmove'];
function un(){evs.forEach(function(n){removeEventListener(n,go,true)})}
function go(e){if(pl||!pref()){return}if(e&&e.target&&e.target.closest&&e.target.closest('#blokSnd'))return;var x=mk();var p=x.play();if(p&&p.then){p.then(function(){pl=true;fadeIn();paint();un()}).catch(function(){})}else{pl=true;fadeIn();paint();un()}}
function arm(){if(pref())evs.forEach(function(n){addEventListener(n,go,{capture:true,passive:true})})}
document.addEventListener('visibilitychange',function(){if(!a||!pl)return;if(document.hidden){sv(true);a.pause()}else{rs();a.play().catch(function(){})}});
addEventListener('pagehide',function(){sv(true)});
function init(){ui();arm()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* ---------- visit source + exit-intent micro survey ---------- */
(function(){var C=window.BLOK_CFG,NT=0;try{NT=localStorage.getItem('blok_nt')}catch(e){}if(NT||!window.BLOKtrack)return;
var D=document,P=(location.pathname.split('/').pop()||'index').replace('.html','')||'index';
if(P==='admin'||P==='404')return;
try{if(!sessionStorage.getItem('blok_v1')){sessionStorage.setItem('blok_v1','1');var u=new URLSearchParams(location.search),src=u.get('utm_source')||'';if(!src&&D.referrer){try{var h=new URL(D.referrer).hostname.replace(/^www\./,'');src=h===location.hostname?'':h}catch(e){}}src=(src||'direct')+'|'+(/Mobi|Android|iPhone/i.test(navigator.userAgent)?'m':'d');window.BLOKtrack('visit',{src:src,page:P})}}catch(e){}
var shown=0;function ok(){try{if(shown||sessionStorage.getItem('blok_done')||!sessionStorage.getItem('blok_vp')||sessionStorage.getItem('blok_sv'))return false;var t=+localStorage.getItem('blok_sv_t')||0;if(Date.now()-t<6048e5)return false}catch(e){return false}return P!=='track'}
var R=[['price','السعر'],['size','المقاس'],['shipping','الشحن'],['trust','مش واثق']];
function show(){if(!ok())return;shown=1;try{sessionStorage.setItem('blok_sv','1')}catch(e){}
var st=D.createElement('style');st.textContent='.xq{position:fixed;inset:auto 0 0 0;z-index:99999;display:flex;justify-content:center;padding:0 12px max(12px,env(safe-area-inset-bottom));pointer-events:none;direction:rtl;font-family:Cairo,system-ui,sans-serif}.xq>div{pointer-events:auto;width:100%;max-width:440px;background:rgba(20,23,26,.82);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);border:1px solid rgba(201,138,91,.35);border-radius:22px;padding:16px;color:#F4EFE6;box-shadow:0 18px 50px rgba(0,0,0,.5);animation:xqi .35s ease}.xq h4{margin:0 0 4px;font-size:17px;font-weight:800}.xq p{margin:0 0 12px;font-size:12.5px;opacity:.7}.xq .g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.xq button{font:inherit;font-weight:700;font-size:14px;color:#F4EFE6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 8px;cursor:pointer}.xq button:active{background:#C98A5B;color:#14171A}.xq .x{position:absolute;top:8px;left:18px;background:none;border:0;font-size:22px;padding:4px 8px;opacity:.6}@keyframes xqi{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}';
var w=D.createElement('div');w.className='xq';w.setAttribute('role','dialog');w.innerHTML='<div style="position:relative"><button class="x" aria-label="إغلاق">×</button><h4>ليه مطلبتش؟</h4><p>ضغطة واحدة بتساعدنا نظبط المتجر ليك</p><div class="g">'+R.map(function(r){return'<button data-r="'+r[0]+'">'+r[1]+'</button>'}).join('')+'</div></div>';
D.head.appendChild(st);D.body.appendChild(w);
function done(){try{localStorage.setItem('blok_sv_t',String(Date.now()))}catch(e){}}
w.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.className==='x'){done();w.remove();return}var r=b.getAttribute('data-r');if(!r)return;done();window.BLOKtrack('survey',{reason:r});try{window.gtag&&gtag('event','exit_survey',{reason:r,page:P})}catch(x){}try{window.clarity&&(clarity('set','exit_reason',r),clarity('event','exit_survey'))}catch(x){}w.firstChild.innerHTML='<h4 style="text-align:center;margin:8px 0">شكراً يا بطل 🙏</h4>';setTimeout(function(){w.remove()},1400)})}
D.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<=0&&!(navigator.maxTouchPoints>0))setTimeout(show,150)});
var idle=0,rs=function(){clearTimeout(idle);if(!(navigator.maxTouchPoints>0))return;idle=setTimeout(function(){if(D.visibilityState==='visible')show()},35000)};
['touchstart','scroll','click','keydown'].forEach(function(ev){addEventListener(ev,rs,{passive:true})});rs();
})();
