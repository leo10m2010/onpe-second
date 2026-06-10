const { endpoints } = require('../proxy-core');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    ok: true,
    message: 'Proxy Vercel activo',
    keys: Object.keys(endpoints)
  });
};
