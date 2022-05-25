import { TermColors, SHELL_PROMPT } from './constants.js';

const downloadElement = document.getElementById('download');

export function downloadFile(file, name) {
  downloadElement.setAttribute('href', file);
  downloadElement.setAttribute('download', name);
  downloadElement.click();
}

export function colorize(color, text) {
  return `${color}${text}${TermColors.Reset}`;
}

export function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function getSpacing(spacing, spacer = ' ') {
  const ret = [];
  let i = spacing;

  while (i > 0) {
    ret.push(spacer);
    i -= 1;
  }
  return ret.join('');
}

