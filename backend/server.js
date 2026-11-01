import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Генерация случайного «непрочитанного» сообщения
function generateMessage() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: randomUUID(),
    from: `${firstName.toLowerCase()}@${lastName.toLowerCase()}`,
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    // сообщение «получено» в течение последнего часа
    received: Math.floor(Date.now() / 1000) - faker.number.int({ min: 0, max: 3600 }),
  };
}

// GET /messages/unread — список непрочитанных сообщений
app.get('/messages/unread', (req, res) => {
  // примерно в 30% случаев новых сообщений нет
  const hasMessages = faker.number.int({ min: 1, max: 10 }) <= 7;
  const count = hasMessages ? faker.number.int({ min: 1, max: 3 }) : 0;

  const messages = Array.from({ length: count }, generateMessage)
    .sort((a, b) => a.received - b.received);

  res.json({
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages,
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`Try: http://localhost:${port}/messages/unread`);
});
