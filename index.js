import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "ighacibot25";
const ACCESS_TOKEN = "EAAxeKR5KKpgBQHoqZCZAQsLfZAkwZAfTqVY83bMZAWpfMB5rYeaHJrkYv1UsqhZAGMP0tv7UPEENz1fthHqZB5PudBBele0gYAe9OPWEPeVPf116trJUxvby7iYB4SfWgNOCFpcZCTfUSHcplcblS92LmmvHhOaR7g0TOqjhZAzOrTbisJCS51w7IVLmQvC0g9HYAC48ZB5qPTmqRffEtpZBpT7W6pIKYIdL1bYoALq9lMqKYcZCUdkb9wZDZD";
const PHONE_NUMBER_ID = "809394832267163";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  console.log("WEBHOOK BODY COMPLETO:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (entry && entry.type === "text") {
      const from = entry.from;
      const message = entry.text.body;

      console.log("Mensaje recibido:", message);

      const response = await fetch(
        `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: "Mensaje recibido: " + message,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("RESPUESTA DE META:", data);
    }
  } catch (err) {
    console.log("ERROR:", err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot corriendo en puerto 3000");
});
