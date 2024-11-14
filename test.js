require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sendMessage = require("./whatsapp"); // ייבוא הפונקציה לשליחת הודעה ב-WhatsApp
const Groq = require("groq-sdk");

const app = express();
const port = 3001;

// הגדרת מפתח ה-Groq API ישירות בקוד או באמצעות משתנה סביבתי
const groqApiKey = "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";
const groq = new Groq({ apiKey: groqApiKey });



app.use(cors());
app.use(express.json());

// מסלול API לשליחת הודעה ב-WhatsApp
app.post("/send-whatsapp", async (req, res) => {
  const { phoneNumber, employeeName, hours, date } = req.body;

  const message = `שלום ${employeeName},\nאושרו לך ${hours} שעות נוספות לתאריך ${date}`;

  try {
    await sendMessage(phoneNumber, message); // קריאה לפונקציה לשליחת ההודעה
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
});

// מסלול API ליצירת הערכת איכות עם Groq API
app.post("/generate-ai-comment", async (req, res) => {
  const { employeeName, totalHours, averageHours, highestHoursDay } = req.body;

  const prompt = `נתח את ביצועי השעות הנוספות של העובד והצע הערכת איכות בעברית:
    שם העובד: ${employeeName},
    סך כל השעות הנוספות: ${totalHours},
    ממוצע שעות ליום: ${averageHours},
    כמות השעות הגבוהה ביותר ביום: ${highestHoursDay.hours} בתאריך ${highestHoursDay.date}.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    // השגת ההערה שנוצרה מהמודל
    const aiComment = chatCompletion.choices[0]?.message?.content || "לא התקבלה הערכה";
    res.json({ comment: aiComment });
  } catch (error) {
    console.error("Error generating AI comment:", error);
    res.status(500).json({ error: "Failed to generate AI comment" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
