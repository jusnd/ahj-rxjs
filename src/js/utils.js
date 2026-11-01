// Утилиты форматирования для виджета сообщений

const SUBJECT_MAX_LENGTH = 15;

/**
 * Сокращает subject до 15 символов.
 * Если длина больше 15 — обрезает до 15 символов и добавляет многоточие.
 */
export function truncateSubject(subject) {
  if (typeof subject !== 'string') return '';
  if (subject.length <= SUBJECT_MAX_LENGTH) return subject;
  return `${subject.slice(0, SUBJECT_MAX_LENGTH)}…`;
}

/**
 * Переводит unix-timestamp (секунды) в формат ЧЧ:ММ ДД.ММ.ГГГГ.
 */
export function formatReceived(timestamp) {
  const date = new Date(timestamp * 1000);
  const pad = (n) => String(n).padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}
