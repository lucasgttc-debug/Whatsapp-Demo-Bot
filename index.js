import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "lucasbot25";
const ACCESS_TOKEN = "EAAhkFIOiHCwBQIQozOExuCALqChrYc7txAV2bA16vPMfkwiRNeZAnERbyWDgZBimkcqgIGtqfRMCqfg64PIG1g8yHZBZAtL0vGeATzZBTOsw6ple2K2IMFaktGTjlobz8qDGdukuPjAhTYZAFGfr5FV9FrOHtEt4HkIse5PlwkGIEomgdPgpf4iXiIkk3x0fBAol0qxmjlV8CmytmlHCbESuBzvzZCTdMW4ViHdCmYy4FcGnwC3eQZDZD";
const PHONE_NUMBER_ID = "860037433865539";

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
