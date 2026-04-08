import express from 'express';
import cors from 'cors';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const excelPath = path.join(__dirname, 'onpe.xlsx');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureExcel() {
  if (!fs.existsSync(excelPath)) {
    const ws = XLSX.utils.aoa_to_sheet([['dni','nombre','miembro de mesa','ubicación','direccion']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ONPE');
    XLSX.writeFile(wb, excelPath);
  }
}

function saveOrUpdateRow(data) {
  ensureExcel();
  const wb = XLSX.readFile(excelPath);
  const ws = wb.Sheets['ONPE'];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const idx = rows.findIndex((r, i) => i > 0 && String(r[0] || '') === String(data.dni));
  const newRow = [data.dni, data.nombre, data.miembroMesa, data.ubicacion, data.direccion];
  if (idx >= 0) rows[idx] = newRow; else rows.push(newRow);
  wb.Sheets['ONPE'] = XLSX.utils.aoa_to_sheet(rows);
  XLSX.writeFile(wb, excelPath);
}

async function consultarOnpe(dni) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://consultaelectoral.onpe.gob.pe/inicio', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('input', { timeout: 30000 });
    await page.evaluate(() => {
      const input = document.querySelector('input');
      if (input) input.value = '';
    });
    await page.type('input', dni, { delay: 70 });

    const before = await page.content();
    const btns = await page.$$('button');
    if (btns.length > 0) {
      await btns[0].click();
    } else {
      throw new Error('No se encontró botón consultar');
    }

    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());

    const result = {
      dni,
      nombre: 'No identificado',
      miembroMesa: /miembro de mesa/i.test(text) ? 'Sí' : 'No',
      ubicacion: 'Revisar texto capturado',
      direccion: 'Revisar texto capturado',
      rawText: text
    };

    const nombreMatch = text.match(/(?:nombre|elector|ciudadano)[:\s]+([A-ZÁÉÍÓÚÑ ]{6,})/i);
    if (nombreMatch) result.nombre = nombreMatch[1].trim();

    const dirMatch = text.match(/(?:dirección|direccion)[:\s]+([^\|]+?)(?:local|miembro|mesa|$)/i);
    if (dirMatch) result.direccion = dirMatch[1].trim();

    const ubiMatch = text.match(/(?:local de votación|local de votacion|ubicación|ubicacion)[:\s]+([^\|]+?)(?:dirección|direccion|miembro|mesa|$)/i);
    if (ubiMatch) result.ubicacion = ubiMatch[1].trim();

    return result;
  } finally {
    await browser.close();
  }
}

app.post('/api/consultar', async (req, res) => {
  try {
    const { dni } = req.body;
    if (!dni || !/^\d{8}$/.test(dni)) return res.status(400).json({ error: 'DNI inválido' });
    const data = await consultarOnpe(dni);
    saveOrUpdateRow(data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'No se pudo consultar ONPE', detail: e.message });
  }
});

app.get('/api/excel', (req, res) => {
  ensureExcel();
  res.download(excelPath, 'onpe.xlsx');
});

app.listen(PORT, () => console.log(`Servidor ONPE en puerto ${PORT}`));