import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import listPaymentMethods from "./listPaymentMethods.js";
dayjs.extend(isSameOrAfter);
import isAgreeToPay from "./isAgreeToPay.js";
import seeKindOfPayments from "../singleFlows/seeKindOfPayments.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_PAY")).addAction(
  { capture: true },
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
    const paymentMethods = state.getMyState().paymentMethod;
    console.log("PAGO ELIGIDO: ", paymentMethods[ctx.body]);
    if (paymentMethods[ctx.body] === undefined) {
      return gotoFlow(listPaymentMethods);
    } else {
      await state.update({
        paymentChooseBeforeSave: [paymentMethods[ctx.body]],
      });
      await flowDynamic(
        `💡 Seguro que quieren elegir el método: ${
          paymentMethods[ctx.body].type === "os"
            ? "*Obra Social*"
            : paymentMethods[ctx.body].type === "transfer"
            ? "*Transferencia*"
            : paymentMethods[ctx.body].type === "presential"
            ? "*Presencial*"
            : ""
        } ?\n\n` +
          `Escribe *estoy seguro* para avanzar.\n` +
          `Escribe *pagar* para elegir un nuevo método.`
      );
      return gotoFlow(isAgreeToPay);
    }
  }
);
