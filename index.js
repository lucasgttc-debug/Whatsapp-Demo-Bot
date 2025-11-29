import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "ighacibot25";
const ACCESS_TOKEN = "EAAxeKR5KKpgBQM0PAlevT8uKXdmJ2vXJ1CkGZCYR5xflcXvQD49heO8SspAbi3yVykvZC7DvRCqZC4ZC6ycU2vHDyAgxZAll85bMtRT9Yk58CjlZCpgdXsLFxDlKh74e1ZCLifZBAQpdE07M9WJY2rAICMfUw3AHcjl1cXaahkSlZCwd7jRyZCPHLrSrHfFkGZCmO3bo2JxeNoCwkopwlcp07h50zscieoh4AceIbg9k1l6ZBrntwBLFEwZDZD";
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
