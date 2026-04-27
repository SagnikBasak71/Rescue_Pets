const admin = require("../firebase");

async function sendNotificationToAll() {

    const message = {
        data: {
            title: "New Rescue Request 🐾",
            body: "A pet needs help nearby"
        },
        topic: "volunteers"
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("✅ Notification sent to topic:", response);
    } catch (error) {
        console.log("❌ Error:", error);
    }
}

module.exports = sendNotificationToAll;