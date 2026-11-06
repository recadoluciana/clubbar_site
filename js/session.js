(() => {
  "use strict";
  const TOKEN = "clubbar_portal_lead_token";
  const EXPIRY = "clubbar_portal_lead_expiry";
  const OLD_ACTIVITY = "clubbar_portal_lead_activity";
  const DURATION = 30 * 24 * 60 * 60 * 1000;
  const loginUrl = new URL("../portal-lead.html", document.currentScript.src).href;
  let ending = false;

  function clear() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRY);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(OLD_ACTIVITY);
  }
  function end() {
    if (ending) return;
    ending = true;
    clear();
    location.replace(loginUrl);
  }
  function start(token) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(EXPIRY, String(Date.now() + DURATION));
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(OLD_ACTIVITY);
  }
  // Preserva o acesso aberto antes da atualização; o servidor verifica sua validade.
  const oldToken = sessionStorage.getItem(TOKEN);
  if (oldToken && !localStorage.getItem(TOKEN)) start(oldToken);
  function get() {
    const token = localStorage.getItem(TOKEN);
    const expires = Number(localStorage.getItem(EXPIRY));
    if (!token) return null;
    if (!expires || Date.now() >= expires) { clear(); return null; }
    return token;
  }
  async function signOut() {
    const token = get();
    try {
      if (token) await window.fetch(`${CLUBBAR_CONFIG.API_BASE_URL}/portal-parceiro/sair`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {
      // A limpeza local ainda é necessária se a rede estiver indisponível.
    } finally { end(); }
  }
  window.ClubbarSession = { start, get, clear, end, signOut };

  // Uma sessão revogada ou expirada deve voltar ao acesso por código.
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (resource, options) => {
    const response = await originalFetch(resource, options);
    const headers = new Headers(options?.headers || (resource instanceof Request ? resource.headers : undefined));
    const token = localStorage.getItem(TOKEN);
    if (response.status === 401 && token && headers.get("Authorization") === `Bearer ${token}`) end();
    return response;
  };
  window.addEventListener("storage", event => {
    if (event.key === TOKEN || event.key === null) {
      if (!get()) end();
      else if (event.key === TOKEN && event.oldValue !== event.newValue) location.reload();
    }
  });
})();
