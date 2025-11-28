import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "lucasbot25";
const ACCESS_TOKEN = "EAAhkFIOiHCwBQB8EeTE4zUfZA9DHZCpE3G5gbXLV9cX52WORBcMgnt85me3nT6Y1zih9AQA7xvlMEASC5f47MyebvE6lMvk0bLVu9RipresUAt2ApwobbTLO74fKyjSc9hz0MH4X33O76vjnKvupZBHuS4nynSzhj0NmtZB9qx8UgnzAvgu16EJ3G5vZCpwiNBqbQXA06Xri6nxZCfpyZB7ckUECFPLSS6C4uxA8t9wdPNZBZCpuQ0QZDZD";
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

  const entry = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (entry && entry.type === "text") {
    const from = entry.from;
    const message = entry.text.body;

    console.log("Mensaje recibido:", message);

    await fetch(
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
          text: { body: "Mensaje recibido: " + message }
        }),
      }
    );
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot corriendo en puerto 3000");
});
