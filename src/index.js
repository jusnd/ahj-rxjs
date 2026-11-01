import './css/style.css';
import MessagesWidget from './js/MessagesWidget';
import { createUnreadStream } from './js/polling';

const widget = new MessagesWidget(document.querySelector('#messages-widget'));

// Подписываемся на обновления: полученные сообщения добавляем в таблицу сверху
const unread$ = createUnreadStream((status) => widget.setStatus(status));

unread$.subscribe((messages) => {
  widget.addMessages(messages);
});
