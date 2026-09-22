(() => {
  "use strict";
  const TOKEN = "clubbar_portal_lead_token";
  const ACTIVITY = "clubbar_portal_lead_activity";
  const LIMIT = 30 * 60 * 1000;
  const loginUrl = new URL("../portal-lead.html", document.currentScript.src).href;
  let ending = false;
  function end() {
    if (ending) return;
    ending = true;
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(ACTIVITY);
    location.replace(loginUrl);
  }
  function check() {
    const token = sessionStorage.getItem(TOKEN);
    if (!token) return false;
    const last = Number(sessionStorage.getItem(ACTIVITY));
    if (!last || Date.now() - last >= LIMIT) { end(); return false; }
    return true;
  }
  function start(token) {
    sessionStorage.setItem(ACTIVITY, String(Date.now()));
    sessionStorage.setItem(TOKEN, token);
  }
  window.ClubbarSession = { start, end };
  // Existing sessions receive an initial activity time once during migration.
  if (sessionStorage.getItem(TOKEN) && !sessionStorage.getItem(ACTIVITY)) {
    sessionStorage.setItem(ACTIVITY, String(Date.now()));
  }
  check();
  function activity() {
    if (!check()) return;
    if (Date.now() - Number(sessionStorage.getItem(ACTIVITY)) >= 1000) {
      sessionStorage.setItem(ACTIVITY, String(Date.now()));
    }
  }
  ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"].forEach(event =>
    document.addEventListener(event, activity, { passive: true, capture: true }));
  window.addEventListener("focus", check);
  window.addEventListener("pageshow", check);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("storage", event => {
    if ((event.key === TOKEN || event.key === null) && !sessionStorage.getItem(TOKEN)) end();
    else check();
  });
  setInterval(check, 1000);
})();
