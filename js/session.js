(() => {
  "use strict";
  const TOKEN = "clubbar_portal_lead_token";
  const ACTIVITY = "clubbar_portal_lead_activity";
  const LIMIT = 30 * 60 * 1000;
  const loginUrl = new URL("../portal-lead.html", document.currentScript.src).href;
  let ending = false;
  let button;
  function end() {
    if (ending) return;
    ending = true;
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ACTIVITY);
    location.replace(loginUrl);
  }
  function check() {
    const token = localStorage.getItem(TOKEN);
    if (button) button.hidden = !token;
    if (!token) return false;
    const last = Number(localStorage.getItem(ACTIVITY));
    if (!last || Date.now() - last >= LIMIT) { end(); return false; }
    return true;
  }
  function start(token) {
    localStorage.setItem(ACTIVITY, String(Date.now()));
    localStorage.setItem(TOKEN, token);
    if (button) button.hidden = false;
  }
  window.ClubbarSession = { start, end };
  // Existing sessions receive an initial activity time once during migration.
  if (localStorage.getItem(TOKEN) && !localStorage.getItem(ACTIVITY)) {
    localStorage.setItem(ACTIVITY, String(Date.now()));
  }
  check();
  function mount() {
    const style = document.createElement("style");
    style.textContent = "#logoutLead[hidden], [data-session-exit][hidden] { display: none !important; }";
    document.head.appendChild(style);
    button = document.getElementById("logoutLead");
    if (!button) {
      const bar = document.createElement("div");
      bar.style.cssText = "display:flex;justify-content:flex-end;padding:8px 20px;background:#f5f7fa;position:relative;z-index:10";
      button = document.createElement("button");
      button.type = "button";
      button.style.cssText = "border:1px solid #19324a;border-radius:8px;padding:9px 16px;background:white;color:#19324a;cursor:pointer;font:600 14px system-ui";
      bar.appendChild(button);
      document.body.prepend(bar);
    }
    button.setAttribute("data-session-exit", "");
    button.textContent = "Sair";
    button.classList.add("show");
    button.hidden = !localStorage.getItem(TOKEN);
    button.addEventListener("click", end);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  function activity() {
    if (!check()) return;
    if (Date.now() - Number(localStorage.getItem(ACTIVITY)) >= 1000) {
      localStorage.setItem(ACTIVITY, String(Date.now()));
    }
  }
  ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"].forEach(event =>
    document.addEventListener(event, activity, { passive: true, capture: true }));
  window.addEventListener("focus", check);
  window.addEventListener("pageshow", check);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("storage", event => {
    if ((event.key === TOKEN || event.key === null) && !localStorage.getItem(TOKEN)) end();
    else check();
  });
  setInterval(check, 1000);
})();
