import { truncateSubject, formatReceived } from './utils';

/**
 * Виджет таблицы непрочитанных сообщений.
 * Новые сообщения добавляются сверху, предыдущие не удаляются.
 */
export default class MessagesWidget {
  constructor(container) {
    this.container = container;
    this.tbody = container.querySelector('[data-messages]');
    this.emptyEl = container.querySelector('[data-empty]');
    this.statusEl = container.querySelector('[data-status]');
  }

  /**
   * Добавляет пачку новых сообщений в начало таблицы (в исходном порядке).
   * @param {Array} messages — массив сообщений с сервера
   */
  addMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return;

    const fragment = document.createDocumentFragment();
    for (const message of messages) {
      fragment.appendChild(MessagesWidget.createRow(message));
    }
    // вставляем всю пачку перед первой строкой — новые сверху
    this.tbody.insertBefore(fragment, this.tbody.firstChild);

    this.emptyEl.classList.add('hidden');
  }

  static createRow({ id, from, subject, received }) {
    const row = document.createElement('tr');
    row.className = 'message-row';
    row.dataset.id = id;

    const fromCell = document.createElement('td');
    fromCell.className = 'col-from';
    fromCell.textContent = from;

    const subjectCell = document.createElement('td');
    subjectCell.className = 'col-subject';
    subjectCell.textContent = truncateSubject(subject);
    subjectCell.title = subject; // полный текст — во всплывающей подсказке

    const receivedCell = document.createElement('td');
    receivedCell.className = 'col-received';
    receivedCell.textContent = formatReceived(received);

    row.append(fromCell, subjectCell, receivedCell);
    return row;
  }

  /** Обновляет индикатор состояния связи с сервером. */
  setStatus(status) {
    this.statusEl.textContent = status;
    this.statusEl.dataset.state = status === 'online' ? 'online' : 'offline';
  }
}
