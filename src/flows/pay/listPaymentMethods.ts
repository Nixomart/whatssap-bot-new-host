import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import choosePay from "./choosePay.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
dayjs.extend(isSameOrAfter);

export default addKeyword<Provider, Database>(
  utils.setEvent("LIST_PAYMENT_METHODS")
).addAction(async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
  const turno = state.getMyState().turnoChoosen;
  const paymentMethods = state.getMyState().paymentMethod;
  const medicData = state.getMyState().medic;

  await flowDynamic(
    `💢💢🟢 Tienes turno con: *${medicData.name}* \n📅 El día: *${dayjs(
      turno.start
    ).format("dddd D, MMMM HH:mm a")}* \n📍 Lugar: *${
      medicData.name
    }* \n🏣 Dirección: *${
      medicData.profile.address
    }* \n\n*Elige un método de pago:* \n${paymentMethods.map(
      (pay, index) =>
        `*${index}*. ${
          pay === "os"
            ? "Obra Social"
            : pay === "transfer"
            ? "Transferencia"
            : pay === "presential"
            ? "Presencial"
            : ""
        }\n`
    )}`
  );
  return gotoFlow(choosePay);
});
