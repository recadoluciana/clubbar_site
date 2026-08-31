const CLUBBAR_HOSTNAME = window.location.hostname.toLowerCase();
const CLUBBAR_EM_DESENVOLVIMENTO =
  !CLUBBAR_HOSTNAME ||
  CLUBBAR_HOSTNAME === 'localhost' ||
  CLUBBAR_HOSTNAME === '127.0.0.1' ||
  CLUBBAR_HOSTNAME.includes('desenvolvimento');

const CLUBBAR_CONFIG = CLUBBAR_EM_DESENVOLVIMENTO
  ? {
      API_BASE_URL: 'https://apiclubbar-desenvolvimento.up.railway.app',
      ADMIN_URL: 'https://clubbaradmin-desenvolvimento.up.railway.app',
      PARTNER_URL: 'https://clubbarpartner-desenvolvimento.up.railway.app',
      CLIENTE_URL: 'https://clubbarcliente-desenvolvimento.up.railway.app',
      AMBIENTE: 'DESENVOLVIMENTO',
    }
  : {
      API_BASE_URL: 'https://apiclubbar-production.up.railway.app',
      ADMIN_URL: 'https://admin.clubbar.com.br',
      PARTNER_URL: 'https://parceiro.clubbar.com.br',
      CLIENTE_URL: 'https://app.clubbar.com.br',
      AMBIENTE: 'PRODUCAO',
    };
