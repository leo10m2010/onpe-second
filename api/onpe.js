const { fetchOnpe } = require('../proxy-core');

module.exports = async function handler(req, res) {
  try {
    const result = await fetchOnpe(req.query || {});
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (result.target) res.setHeader('X-Proxy-Target', result.target);
    return res.status(result.status || 200).json(result.body);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Error interno del proxy' });
  }
};
