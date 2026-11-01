import { truncateSubject, formatReceived } from '../utils';

describe('truncateSubject', () => {
  test('не трогает короткие темы (до 15 символов)', () => {
    expect(truncateSubject('Hello')).toBe('Hello');
    expect(truncateSubject('123456789012345')).toBe('123456789012345');
  });

  test('сокращает длинные темы до 15 символов + многоточие', () => {
    expect(truncateSubject('Hello from Alex Petrov!')).toBe('Hello from Alex…');
  });

  test('корректно обрабатывает нестроковые значения', () => {
    expect(truncateSubject(undefined)).toBe('');
    expect(truncateSubject(null)).toBe('');
  });
});

describe('formatReceived', () => {
  test('переводит timestamp в формат ЧЧ:ММ ДД.ММ.ГГГГ', () => {
    // проверяем только формат, т.к. значение зависит от локальной таймзоны
    const result = formatReceived(1553108200);
    expect(result).toMatch(/^\d{2}:\d{2} \d{2}\.\d{2}\.\d{4}$/);
  });

  test('дополняет часы, минуты, день и месяц ведущими нулями', () => {
    // 01.01.2024 00:05:00 UTC — в любой таймзоне часть времени
    // и даты должна быть с ведущими нулями
    const result = formatReceived(1704067500);
    const [time, date] = result.split(' ');
    expect(time).toMatch(/^[0-2]\d:[0-5]\d$/);
    expect(date).toMatch(/^[0-3]\d\.[0-1]\d\.\d{4}$/);
  });
});
