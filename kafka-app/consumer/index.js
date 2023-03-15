const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const AWS = require('aws-sdk');

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const acm = new AWS.ACM();

const params = {
  CertificateArn: 'arn:aws:acm:us-east-1:982389650543:certificate/21f2cb60-fb30-4da8-9594-b1d6f2c8c6ff',
};

acm.describeCertificate(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    const options = {
      cert: data.Certificate,
      key: data.PrivateKey,
    };

    const server = https.createServer(options, app);
    server.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  }
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
