const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

// הגדרת שמירת session עם LocalAuth
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one", // ניתן להשתמש ב-ID ייחודי לכל session במידה ויש צורך בתמיכה בריבוי משתמשים
  }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan the QR code above to log in.");
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

/**
 * פונקציה לשליחת הודעה
 * @param {string} phoneNumber מספר הטלפון של הנמען
 * @param {string} message תוכן ההודעה
 */
const sendMessage = async (phoneNumber, message) => {
  const formattedNumber = `972${phoneNumber.slice(1)}@c.us`; // פורמט המספר ל-WhatsApp
  try {
    await client.sendMessage(formattedNumber, message);
    console.log(`Message sent to ${phoneNumber}`);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

// אתחול הלקוח
client.initialize();

module.exports = sendMessage;
