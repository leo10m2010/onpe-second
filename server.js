const express = require('express');
const path = require('path');
const { fetchOnpe, endpoints } = require('./proxy-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Proxy local activo', keys: Object.keys(endpoints) });
});

app.get('/api/onpe', async (req, res) => {
  try {
    const result = await fetchOnpe(req.query);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (result.target) res.setHeader('X-Proxy-Target', result.target);
    return res.status(result.status || 200).json(result.body);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Error interno del proxy' });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await fetchOnpe({ key: 'resumenTotales' });
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(result.status || 200).json(result.body);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Error interno del proxy' });
  }
});

app.get('/api/debug', async (req, res) => {
  try {
    const result = await fetchOnpe({ url: req.query.url });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (result.target) res.setHeader('X-Proxy-Target', result.target);
    return res.status(result.status || 200).json(result.body);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Error interno del proxy' });
  }
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dashboard ONPE: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Prueba proxy: http://localhost:${PORT}/api/test`);
});
