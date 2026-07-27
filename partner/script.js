const slides = document.getElementById('slides');
const items = [...document.querySelectorAll('.slide')];
const counter = document.getElementById('counter');
const dots = document.getElementById('dots');
let current = 0;

items.forEach((_, i) => {
  const b = document.createElement('button');
  b.className = 'dot' + (i === 0 ? ' active' : '');
  b.setAttribute('aria-label', `Ir para tela ${i+1}`);
  b.onclick = () => go(i);
  dots.appendChild(b);
});

function go(i){
  current = Math.max(0, Math.min(items.length-1, i));
  slides.scrollTo({left: current * slides.clientWidth, behavior:'smooth'});
  update();
}
function update(){
  counter.textContent = `${current+1} / ${items.length}`;
  [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===current));
}
document.getElementById('prev').onclick=()=>go(current-1);
document.getElementById('next').onclick=()=>go(current+1);
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' ') go(current+1);
  if(e.key==='ArrowLeft') go(current-1);
});
let timer;
slides.addEventListener('scroll',()=>{
  clearTimeout(timer);
  timer=setTimeout(()=>{
    current=Math.round(slides.scrollLeft/slides.clientWidth);
    update();
  },80);
});
window.addEventListener('resize',()=>go(current));
document.getElementById('fullscreen').onclick=()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
};
update();
