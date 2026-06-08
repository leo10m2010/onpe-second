const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TARGET = process.argv[2] || 'https://resultados.onpe.gob.pe/EG2026/ResumenGeneral/10/T';
const PORT = Number(process.env.ONPE_CDP_PORT || 9333);
const WAIT_MS = Number(process.env.ONPE_DISCOVER_WAIT || 120000);

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

function findBrowser() {
  return chromeCandidates.find(candidate => candidate && fs.existsSync(candidate));
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForCdp() {
  const url = `http://127.0.0.1:${PORT}/json/version`;
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // Chrome is still starting.
    }
    await wait(500);
  }
  throw new Error('No se pudo conectar con Chrome DevTools Protocol');
}

function connectToPage(wsUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const records = new Map();

    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const messageId = ++id;
        pending.set(messageId, { res, rej });
        socket.send(JSON.stringify({ id: messageId, method, params }));
      });
    }

    function remember(url, data) {
      if (!url) return;
      const interesting = /onpe|amazonaws|s3|result|acta|json|csv|api|backend|resumen|total|mesa|eleccion/i.test(url);
      if (!interesting) return;
      records.set(url, { url, ...records.get(url), ...data });
    }

    socket.onopen = async () => {
      await send('Network.enable');
      await send('Page.enable');
      await send('Page.navigate', { url: TARGET });
      console.log(`Chrome abierto en: ${TARGET}`);
      console.log('Si aparece Cloudflare/Turnstile, resuélvelo en la ventana de Chrome. Esperando captura...');
      setTimeout(() => {
        socket.close();
        resolve([...records.values()]);
      }, WAIT_MS);
    };

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        pending.get(message.id).res(message.result);
        pending.delete(message.id);
        return;
      }

      if (message.method === 'Network.requestWillBeSent') {
        const request = message.params.request;
        remember(request.url, { method: request.method });
      }

      if (message.method === 'Network.responseReceived') {
        const response = message.params.response;
        remember(response.url, {
          status: response.status,
          mimeType: response.mimeType,
          contentType: response.headers['content-type'] || response.headers['Content-Type'] || ''
        });
      }
    };

    socket.onerror = reject;
  });
}

async function main() {
  const browser = findBrowser();
  if (!browser) throw new Error('No encontré Chrome o Edge instalado');

  const profileDir = path.join(os.tmpdir(), 'onpe-discover-profile');
  const args = [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--new-window',
    TARGET
  ];

  const child = spawn(browser, args, { stdio: 'ignore', detached: true });
  child.unref();

  await waitForCdp();
  const page = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(TARGET)}`, { method: 'PUT' }).then(response => response.json());
  const records = await connectToPage(page.webSocketDebuggerUrl);
  const output = {
    target: TARGET,
    capturedAt: new Date().toISOString(),
    records: records.sort((a, b) => a.url.localeCompare(b.url))
  };

  const outputFile = path.join(process.cwd(), 'onpe-discovered.json');
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

  console.log(`\nCaptura guardada en ${outputFile}`);
  output.records.forEach(record => {
    console.log(`${record.status || '---'} ${record.mimeType || ''} ${record.url}`);
  });
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
