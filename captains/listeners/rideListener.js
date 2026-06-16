const { connectRabbitMQ } = require('../services/rabbit');

const NEW_RIDE_QUEUE = 'new_ride';
const BUFFER_CAPACITY = 10;

// in-memory store of waiting long-poll responses
const waitingCaptains = new Map();
const rideBuffer = [];

const startRideListener = async () => {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(NEW_RIDE_QUEUE, { durable: true });

    // only fetch 1 message at a time
    channel.prefetch(1);

    channel.consume(NEW_RIDE_QUEUE, (msg) => {
        if (!msg) return;

        const ride = JSON.parse(msg.content.toString());
        console.log('New ride received from queue:', ride._id);

        // resolve any captain waiting on long poll
        const entry = waitingCaptains.entries().next().value;
        if (entry) {
            const [captainId, { res, timeout }] = entry;
            waitingCaptains.delete(captainId);
            clearTimeout(timeout);
            if (!res.headersSent && !res.writableEnded) {
                return res.status(200).json({ success: true, message: 'New ride available', data: ride });
            }
        }

        // buffer the ride if no captain was waiting
        rideBuffer.push(ride);
        if (rideBuffer.length > BUFFER_CAPACITY) {
            rideBuffer.shift();
        }

        // acknowledge — tell RabbitMQ we processed it
        channel.ack(msg);
    });

    console.log('Listening for new rides...');
};

module.exports = { startRideListener, waitingCaptains, rideBuffer };