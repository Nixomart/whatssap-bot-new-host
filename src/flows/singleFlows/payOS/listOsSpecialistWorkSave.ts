import dayjs from "dayjs";
import chooseOsToPaySave from "./chooseOsToPaySave.js"
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("LIST_OSSPECIALIST_WORKS_SAVE")).addAction(
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const medicData = state.getMyState().medic;
    const turno = state.getMyState().turnoNew
    const listPaymentMedicWorks = medicData.paymentMethods.find(
      (pay) => pay.id === "3"
    );
    await state.update({ listOss: listPaymentMedicWorks.oss });
      await flowDynamic(
        `🛡️ *Elige una obra social de la siguiente lista con el numero correspondiente* 🔢: \n\n${listPaymentMedicWorks.oss.map(
          (os, index) => `*${index}. ${os}*\n`
        )}\n\nSi quieres elegir otro método de pago, escribe *pagar*`
      )
      return gotoFlow(chooseOsToPaySave)
  }
);
