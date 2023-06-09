const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Kafka } = require('kafkajs');

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['34.71.246.184:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key ? message.key.toString() : null;
      const value = message.value ? message.value.toString() : null;
      console.log({
        partition,
        offset: message.offset,
        value,
        key,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            topic,
            partition,
            offset: message.offset,
            key,
            value,
          }));
        }
      });
    },
  });
}

run().catch(console.error);

server.listen(3000, () => {
  console.log('Server started on port 3000');
});