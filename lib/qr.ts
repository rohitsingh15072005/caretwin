import QRCode from "qrcode";
import { downloadBlob } from "./download";

export interface QrMatrix {
  size: number;
  isDark: (row: number, col: number) => boolean;
}

/** Throws if the text is too long for a QR code. */
export function makeQr(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size, data } = qr.modules;
  return { size, isDark: (r, c) => data[r * size + c] === 1 };
}

const QUIET = 3;

export function qrPath(m: QrMatrix) {
  let d = "";
  for (let r = 0; r < m.size; r++)
    for (let c = 0; c < m.size; c++) if (m.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return d;
}

export function qrViewBox(m: QrMatrix) {
  return `${-QUIET} ${-QUIET} ${m.size + QUIET * 2} ${m.size + QUIET * 2}`;
}

export function qrSvgString(m: QrMatrix) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${qrViewBox(m)}" width="512" height="512" shape-rendering="crispEdges"><rect x="${-QUIET}" y="${-QUIET}" width="${m.size + QUIET * 2}" height="${m.size + QUIET * 2}" fill="#fff"/><path d="${qrPath(m)}" fill="#111827"/></svg>`;
}

export function downloadQrPng(m: QrMatrix, filename: string) {
  const scale = 12;
  const total = (m.size + QUIET * 2) * scale;
  const canvas = document.createElement("canvas");
  canvas.width = total;
  canvas.height = total;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, total, total);
  ctx.fillStyle = "#111827";
  for (let r = 0; r < m.size; r++)
    for (let c = 0; c < m.size; c++)
      if (m.isDark(r, c)) ctx.fillRect((c + QUIET) * scale, (r + QUIET) * scale, scale, scale);
  canvas.toBlob((b) => b && downloadBlob(filename, b), "image/png");
}

export function downloadQrSvg(m: QrMatrix, filename: string) {
  downloadBlob(filename, new Blob([qrSvgString(m)], { type: "image/svg+xml" }));
}
