import { interval, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

// SERVER_URL подставляется webpack.DefinePlugin на этапе сборки
// (локально — http://localhost:3000, на GitHub Pages — адрес задеплоенного backend'а)
const UNREAD_URL = `${SERVER_URL}/messages/unread`;

const POLLING_INTERVAL = 3000; // опрос сервера каждые 3 секунды

/**
 * Поток непрочитанных сообщений.
 *
 * - interval + startWith(0) — первый запрос сразу, дальше каждые 3 секунды;
 * - switchMap — если сервер «задумался», предыдущий запрос отменяется,
 *   новый опрос не ждёт старый;
 * - сообщения лежат в свойстве `messages` ответа;
 * - ошибка (сервер недоступен или код ответа не 200) преобразуется
 *   в пустой массив — то есть трактуется как отсутствие новых сообщений,
 *   и поток продолжает опрос дальше.
 */
export function createUnreadStream(onStatusChange = () => {}) {
  return interval(POLLING_INTERVAL).pipe(
    startWith(0),
    switchMap(() => ajax.getJSON(UNREAD_URL).pipe(
      map((response) => {
        onStatusChange('online');
        return Array.isArray(response?.messages) ? response.messages : [];
      }),
      catchError(() => {
        onStatusChange('offline');
        return of([]); // ошибка == нет новых сообщений
      }),
    )),
  );
}
