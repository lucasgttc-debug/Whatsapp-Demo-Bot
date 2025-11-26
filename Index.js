import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "EAAhkFIOiHCwBQMWakrHuFJLJ4CQ6H1wP4p4qCxICZAM60ZC1Nn4DZC4I4e4QJMu5ZBZCkl1f3vE4jduZAR0DopVi8hFbqCbliZB6tzNovwmCke62ZA3avGEoGGKKz1LU1ElZC7qYnDrexd7v9ZBay7YvejZBtKy25CdBChcV7wIpVFM2EBAhZBG9ZARtQ1D8l9kLkLI3ZBL0SCAZADmjY9PxtXFJqoO7Lt5jR7i3BOu";

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

app.post("/webhook", (req, res) => {
  console.log("WEBHOOK MESSAGE:", JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (entry && entry.type === "text") {
      const from = entry.from;
      const message = entry.text.body;

      console.log("Mensaje recibido:", message);
    }
  } catch (err) {
    console.log("ERROR procesando mensaje:", err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot corriendo en puerto 3000");
});
