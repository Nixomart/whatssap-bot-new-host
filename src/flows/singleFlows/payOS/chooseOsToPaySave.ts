import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import listOsSpecialistWorkSave from "./listOsSpecialistWorkSave.js";
import seeKindOfPayments from "../seeKindOfPayments.js";
import getInformationOsSave from "./getInformationOsSave.js";
dayjs.extend(isSameOrAfter);
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_OSTOPAY_SAVE")).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const turno = state.getMyState().turnoNew
    const medicData2 = state.getMyState().medic
        const osList = state.getMyState().listOss;
    if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(seeKindOfPayments);
    }
    if (osList[ctx.body] === undefined) {
      return gotoFlow(listOsSpecialistWorkSave);
    } else {
      await state.update({turnoNew: {...turno, os_name: osList[ctx.body] }})
      return gotoFlow(getInformationOsSave);
    }
  }
);