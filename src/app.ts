import { createBot,  createFlow } from "@builderbot/bot";
import fs from "fs";
import { MemoryDB as Database } from "@builderbot/bot";
import dayjs from "dayjs";
import "dayjs/locale/es.js";
import provider from "./provider/provider";
import { sendMessage } from "./controller/sendMessage.controller";
import { sendMessageCustomer } from "./controller/sendMessageCustomer";
import { createBotDocker } from "./controller/createBotDocker";
import { getQrDocker } from "./controller/getQrDocker";
import { startContainer } from "./controller/startContainer";
import { sendMessageBotOff } from "./controller/sendMessageBotOff";
import { controlMessageParticular } from "./controller/controlMessageParticular";
import { sendParticularTurnConfirmedCustomer } from "./controller/sendParticularTurnConfirmedCustomer";
import { cancelTurnSendParticular } from "./controller/cancelturn.particular";
import { editTurnParticular } from "./controller/editTurn.particular";
import { sendBotNotWork } from "./controller/sendBotNotWork";
import { sendToCustomerParticular } from "./controller/sendToCustomerParticular";
import { sendTurnCustomerToPay } from "./controller/sendTurnCustomerToPay";
import { cancelTurnSend } from "./controller/cancelTurnSend";
import { editTurnMessage } from "./controller/editTurnMessage";
import cron from "node-cron"
import { cleanFolders } from "./fuctions/cleanFolders";
import { sendMessageCron } from "./controller/sendMessageCron.service";
import indexFlow from "./flows/index.flow";
dayjs.locale("es");
const PORT = process.env.PORT ?? 4000;
const main = async () => {
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    /* flow: createFlow([]), */
    flow: indexFlow,
    provider: provider,
    database: adapterDB,
  });
  cron.schedule("00 17 * * *  ", async () => {
    await sendMessageCron();
  });
  provider.server.post(
    "/send-message-provider",
    handleCtx(async (bot, req, res) => {
      await sendMessage(bot, req, res);
    })
  );
  /* envia ahora mismo, este envia al customer */
  provider.server.post(
    "/send-message-provider-customer",
    handleCtx(async (bot, req, res) => {
      await sendMessageCustomer(bot, req, res);
    })
  );
  provider.server.post(
    "/createBot/:doc",
    handleCtx(async (bot, req, res) => {
      await createBotDocker(bot, req, res);
    })
  );
  provider.server.get(
    "/getqr/:port/:uid",
    handleCtx(async (bot, req, res) => {
      await getQrDocker(bot, req, res);
    })
  );
  provider.server.post(
    "/startContenedor/:idContainer",
    handleCtx(async (bot, req, res) => {
      await startContainer(bot, req, res);
    })
  );
  provider.server.post(
    `/bot-off/:phone`,
    handleCtx(async (bot, req, res) => {
      await sendMessageBotOff(bot, req, res);
    })
  );

  provider.releaseSessionFiles();
  provider.server.get(
    "/getQR",
    handleCtx(async (bot, req, res) => {
      try {
        const qrImagePath = "./bot.qr.png";
        fs.readFile(qrImagePath, (err, data) => {
          if (err) {
            console.log("Error al leer la imagen del código QR:", err);
            res.status(500).send("Error al leer la imagen del código QR");
            return;
          }
          res.writeHead(200, { "Content-Type": "image/png" });
          res.end(data);
        });
      } catch (error) {
        console.log(error);

        res.end(JSON.stringify({ message: "error" }));
      }
    })
  );
  /* *********************PARTICULAR******************************* */
  /* ENVIO MEDIANTE EL DOCKER DEL PARTICULAR */
  provider.server.post(
    "/send-message-provider-customer/:document",
    handleCtx(async (bot, req, res) => {
      await controlMessageParticular(bot, req, res);
    })
  );
  provider.server.post(
    "/send-message-provider-customer/:document/confirmed",
    handleCtx(async (bot, req, res) => {
      await sendParticularTurnConfirmedCustomer(bot, req, res);
    })
  );
  /*  */ provider.server.post(
    "/cancel-turn-message-particular",
    handleCtx(async (bot, req, res) => {
      await cancelTurnSendParticular(bot, req, res);
    })
  );
  /*  */ provider.server.post(
    "/edit-turn-message-particular",
    handleCtx(async (bot, req, res) => {
      await editTurnParticular(bot, req, res);
    })
  );

  /* ENVIO MEDIANTE ESTE DOCKER  */
  provider.server.post(
    "/sendBotNotWork",
    handleCtx(async (bot, req, res) => {
      await sendBotNotWork(bot, req, res);
    })
  );
  provider.server.post(
    "/send-confirmation-vps",
    handleCtx(async (bot, req, res) => {
      await sendToCustomerParticular(bot, req, res);
    })
  );
  provider.server.post(
    "/send-message-customer-to-pay",
    handleCtx(async (bot, req, res) => {
      await sendTurnCustomerToPay(bot, req, res);
    })
  );
  /*  */ provider.server.post(
    "/cancel-turn-message",
    handleCtx(async (bot, req, res) => {
      await cancelTurnSend(bot, req, res);
    })
  );
  /*  */ provider.server.post(
    "/edit-turn-message",
    handleCtx(async (bot, req, res) => {
      await editTurnMessage(bot, req, res);
    })
  );
  httpServer(+PORT);
};

main();
