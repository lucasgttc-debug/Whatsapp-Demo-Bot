import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// ⬇️ REEMPLAZAR ESTOS VALORES
const VERIFY_TOKEN = "lucasbot25";
const ACCESS_TOKEN = "EAAhkFIOiHCwBQLPQ5vDu9C7qbWrl4dbvN6w0Ry5o5b0GjdAvV5dWxfn17wz684QCP5RiccquzLPK7fpCZAbBD03hZCWPDLzfS4Ts7d3E3xZCZC2k3csRo7rePb4UZC2izHB5ZBYZBZBj030HBlSNILwJd7umRiJbnDknEU8cdq0xvmlBDVGidchfUw40Mp5dlsNq0tz7HCnhcZClwfL09EMuw8TqBqj5ZAIX44QMd35rcLzMyMmFeSfAZDZD";
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
  try {
    const entry =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (entry && entry.type === "text") {
      const from = entry.from;
      const message = entry.text.body;

      console.log("Mensaje recibido:", message);

      await fetch(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
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
          })
        }
      );
    }
  } catch (err) {
    console.log("ERROR:", err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot corriendo en puerto 3000");
});
