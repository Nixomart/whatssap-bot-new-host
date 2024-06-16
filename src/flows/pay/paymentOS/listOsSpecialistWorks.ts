import dayjs from "dayjs";
import chooseOsToPay from "./chooseOsToPay.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
dayjs.extend(isSameOrAfter);
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("LISTOS_SPECIALISTWORKS")).addAction(
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const medicData = state.getMyState().medic;
    const listPaymentMedicWorks = medicData.paymentMethods.find(
      (pay) => pay.id === "3"
    );
    await state.update({ listOss: listPaymentMedicWorks.oss });
await      flowDynamic(
        `🛡️ *Elige una obra social de la siguiente lista con el numero correspondiente* 🔢: \n\n${listPaymentMedicWorks.oss.map(
          (os, index) => `*${index}. ${os}*\n`
        )}\n\nSi quieres elegir otro método de pago, escribe *pagar*`
      )
return      gotoFlow(chooseOsToPay)
  }
);