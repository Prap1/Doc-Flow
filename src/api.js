/**
 * DocFlow Pro — API client helpers
 * All requests go through Vite proxy → FastAPI at /api/*
 */

const BASE = '/api';

// ── Generic helpers ──────────────────────────────────────────

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res;
}

// ── Health ───────────────────────────────────────────────────
export async function checkHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}

// ── PDF ──────────────────────────────────────────────────────
export async function pdfAnnotate(file, annotationText, page = 0, x = 50, y = 50, fontSize = 14) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('annotation_text', annotationText);
  fd.append('page', page);
  fd.append('x', x);
  fd.append('y', y);
  fd.append('font_size', fontSize);
  const res = await handleResponse(await fetch(`${BASE}/pdf/annotate`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function pdfMerge(files) {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  const res = await handleResponse(await fetch(`${BASE}/pdf/merge`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function pdfSplit(file, pages = '') {
  const fd = new FormData();
  fd.append('file', file);
  if (pages) fd.append('pages', pages);
  const res = await handleResponse(await fetch(`${BASE}/pdf/split`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function pdfInfo(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await handleResponse(await fetch(`${BASE}/pdf/info`, { method: 'POST', body: fd }));
  return res.json();
}

// ── Word ─────────────────────────────────────────────────────
export async function wordMerge(files) {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  const res = await handleResponse(await fetch(`${BASE}/word/merge`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function wordSplit(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await handleResponse(await fetch(`${BASE}/word/split`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function wordToHtml(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await handleResponse(await fetch(`${BASE}/word/convert/html`, { method: 'POST', body: fd }));
  return res.json(); // { html, filename }
}

export async function htmlToDocx(htmlContent, title = 'Document') {
  const fd = new FormData();
  fd.append('html_content', htmlContent);
  fd.append('title', title);
  const res = await handleResponse(await fetch(`${BASE}/word/convert/docx`, { method: 'POST', body: fd }));
  return res.blob();
}

// ── Excel ────────────────────────────────────────────────────
export async function excelMerge(files) {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  const res = await handleResponse(await fetch(`${BASE}/excel/merge`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function excelSplit(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await handleResponse(await fetch(`${BASE}/excel/split`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function excelToJson(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await handleResponse(await fetch(`${BASE}/excel/to-json`, { method: 'POST', body: fd }));
  return res.json(); // { filename, sheets: { SheetName: [[...]] } }
}

export async function jsonToExcel(data, sheetName = 'Sheet1') {
  const res = await handleResponse(await fetch(`${BASE}/excel/from-json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, sheet_name: sheetName }),
  }));
  return res.blob();
}

// ── Image ────────────────────────────────────────────────────
export async function imageEdit(file, params = {}) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  const res = await handleResponse(await fetch(`${BASE}/image/edit`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function imageMerge(files, direction = 'horizontal') {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  fd.append('direction', direction);
  const res = await handleResponse(await fetch(`${BASE}/image/merge`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function imageSplit(file, parts = 2, direction = 'horizontal') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('parts', parts);
  fd.append('direction', direction);
  const res = await handleResponse(await fetch(`${BASE}/image/split`, { method: 'POST', body: fd }));
  return res.blob();
}

export async function imageCompress(file, quality = 75, maxWidth = 1920) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('quality', quality);
  fd.append('max_width', maxWidth);
  const res = await handleResponse(await fetch(`${BASE}/image/compress`, { method: 'POST', body: fd }));
  return res.blob();
}

// ── Posts / Chat Studio ──────────────────────────────────────
export async function listPosts() {
  const res = await handleResponse(await fetch(`${BASE}/posts`));
  return res.json();
}

export async function createPost(postData) {
  const res = await handleResponse(await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  }));
  return res.json();
}

export async function getPost(id) {
  const res = await handleResponse(await fetch(`${BASE}/posts/${id}`));
  return res.json();
}

export async function updatePost(id, data) {
  const res = await handleResponse(await fetch(`${BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
  return res.json();
}

export async function deletePost(id) {
  await handleResponse(await fetch(`${BASE}/posts/${id}`, { method: 'DELETE' }));
}

export async function reactToPost(id, key) {
  const res = await handleResponse(await fetch(`${BASE}/posts/${id}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  }));
  return res.json();
}

export async function uploadVoice(postId, audioBlob) {
  const fd = new FormData();
  fd.append('voice', audioBlob, 'voice.webm');
  const res = await handleResponse(await fetch(`${BASE}/posts/${postId}/voice`, {
    method: 'POST',
    body: fd,
  }));
  return res.json();
}

export function getVoiceUrl(postId) {
  return `${BASE}/posts/${postId}/voice`;
}

// ── WhatsApp Export ──────────────────────────────────────────
export async function uploadWhatsAppChat(formData) {
  const res = await handleResponse(await fetch(`${BASE}/wa/upload`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData,
  }));
  return res.json();
}

// ── Utility: download blob ────────────────────────────────────
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
