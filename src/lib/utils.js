import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getReadableChar(char) {
  const specialChars = {
    ' ': 'Espaço',
    '\n': '↵ Nova linha',
    '\t': 'Tab',
    '.': 'Ponto',
    ',': 'Vírgula',
    ':': 'Dois pontos',
    ';': 'Ponto e vírgula',
    "'": 'Aspa simples',
    '"': 'Aspas duplas',
    '>': '>',
    '<': '<',
    '{': '{',
    '}': '}',
    '|': '|'
  };

  return specialChars[char] || char;
}


