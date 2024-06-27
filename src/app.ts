import path, { join } from "path";
import {
  createBot,
  createProvider,
  createFlow,
} from "@builderbot/bot";
import fs from "fs";

import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import dayjs from "dayjs";
import "dayjs/locale/es.js";
import express from "express";
import cors from "cors";
import provider from "./provider/provider";
import { sendMessage } from "./controller/sendMessage.controller";
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
dayjs.locale("es");
const PORT = process.env.PORT ?? 3008;
const main = async () => {
  const adapterFlow = createFlow([]);
  const adapterProvider = createProvider(Provider);
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    /* flow: indexFlow, */
    flow: createFlow([]),
    provider: provider,
    database: adapterDB,
  });

  adapterProvider.server.post("/send-message-provider", handleCtx(async(bot, req, res) => {
    await sendMessage(bot, req, res)
  }))
  provider.releaseSessionFiles()
  adapterProvider.server.post(
    "/v1/messages",
    handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body;
      await bot.sendMessage(number, message, { media: urlMedia ?? null });
      return res.end("sended");
    })
  );
  adapterProvider.server.get(
    "/",
    handleCtx(async (bot, req, res) => {
      return res.send("Hello world");
    })
  );
  adapterProvider.server.get(
    "/getQR",
    handleCtx(async (bot, req, res, ) => {
      const qrImagePath = path.join(__dirname, 'bot.qr.png');
      fs.readFile(qrImagePath, (err, data) => {
        if (err) {
          console.log("Error al leer la imagen del código QR:", err);
          res.status(500).send("Error al leer la imagen del código QR");
          return;
        }
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=bot.qr.png');
        res.send(data);
        
        res.contentType("image/png");
        res.send(data);
      });
    })
  );
  adapterProvider.server.post(
    "/v1/register",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      
      await bot.dispatch("REGISTER_FLOW", { from: number, name });
      
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/samples",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot.dispatch("SAMPLES", { from: number, name });
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/blacklist",
    handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body;
      if (intent === "remove") bot.blacklist.remove(number);
      if (intent === "add") bot.blacklist.add(number);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    })
  );
  /* app.listen(3000, ()=>console.log(`escuachdno en ${PORT}`)) */
  httpServer(+PORT);
};

main();
