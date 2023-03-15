const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Kafka } = require('kafkajs');

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  clientTracking: true,
  perMessageDeflate: false,
  verifyClient: (info, done) => {
    // Check if the request comes from an allowed origin
    const allowedOrigins = ["https://consumer.erdenayat.es"];
    const origin = info.origin || info.req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
      done(false, 403, "Forbidden");
      return;
    }

    // Check if the request comes from an authorized user
    const authorizedUsers = ["user1", "user2"];
    const username = info.req.headers["x-username"];
    if (!authorizedUsers.includes(username)) {
      done(false, 401, "Unauthorized");
      return;
    }

    done(true);
  },
  secure: true
});

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['b-2.eamskcluster.92wrgm.c13.kafka.us-east-1.amazonaws.com:9092', 'b-1.eamskcluster.92wrgm.c13.kafka.us-east-1.amazonaws.com:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'msk-topic', fromBeginning: true });

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
