(() => {
  "use strict";
  function mount() {
    if (document.getElementById("clubbar-whatsapp")) return;
    const style = document.createElement("style");
    style.textContent = `
      #clubbar-whatsapp {
        position:fixed;right:16px;bottom:max(16px, env(safe-area-inset-bottom));z-index:100;
        display:flex;align-items:center;gap:9px;max-width:calc(100vw - 32px);
        box-sizing:border-box;padding:12px 18px;border-radius:28px;
        background:#146c43;color:#fff;text-decoration:none;
        font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 3px 12px #0003;
      }
      #clubbar-whatsapp:hover { background:#0f5132; }
      #clubbar-whatsapp:focus-visible { outline:3px solid #ffc342;outline-offset:3px; }
      body::after { content:"";display:block;height:76px; }
      @media print { #clubbar-whatsapp { display:none; } body::after { display:none; } }
    `;
    document.head.appendChild(style);
    const link = document.createElement("a");
    link.id = "clubbar-whatsapp";
    link.href = "https://wa.me/5535999811045";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Fale conosco pelo WhatsApp";
    link.setAttribute("aria-label", "Fale conosco pelo WhatsApp: (35) 99981-1045 (abre em nova aba)");
    document.body.appendChild(link);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
