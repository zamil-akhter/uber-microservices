require("dotenv").config();
const amqp = require("amqplib");

const rabbitmqUrl = process.env.RABBITMQ_URL;
if (!rabbitmqUrl) {
  throw new Error("[Captains Service] Missing RABBITMQ_URL environment variable");
}

let connection, channel;

async function connectRabbitMq() {
  if (channel) {
    return channel;
  }

  if (!connection) {
    connection = await amqp.connect(rabbitmqUrl);
    connection.on("error", (err) => {
      console.error("[Captains Service] RabbitMQ connection error:", err);
      connection = null;
      channel = null;
    });
    connection.on("close", () => {
      console.warn("[Captains Service] RabbitMQ connection closed");
      connection = null;
      channel = null;
    });
  }

  channel = await connection.createChannel();
  console.log("[Captains Service] Connected to RabbitMQ at", rabbitmqUrl);
  return channel;
}

async function subscribeToQueue(queueName, callback) {
  if (!queueName) {
    throw new Error("subscribeToQueue requires a queueName");
  }
  if (typeof callback !== "function") {
    throw new Error("subscribeToQueue requires a callback function");
  }

  const channel = await connectRabbitMq();
  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(queueName, (message) => {
    if (!message) {
      return;
    }

    callback(message.content.toString());
    channel.ack(message);
  });
}

async function publishToQueue(queueName, data) {
  if (!queueName) {
    throw new Error("publishToQueue requires a queueName");
  }

  const channel = await connectRabbitMq();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
  subscribeToQueue,
  publishToQueue,
  connectRabbitMq,
};
