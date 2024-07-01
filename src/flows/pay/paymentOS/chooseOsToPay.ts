import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import listOsSpecialistWorks from "./listOsSpecialistWorks.js";
import GetInformationOS from "./getInformationOS.js";
import listPaymentMethods from "../listPaymentMethods.js";
dayjs.extend(isSameOrAfter);
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_OS_TO_PAY")).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const osList = state.getMyState().listOss;
    if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(listPaymentMethods);
    }
    if (osList[ctx.body] === undefined) {
      return gotoFlow(listOsSpecialistWorks);
    } else {
      await state.update({
        turnoChoosen: {
          ...state.getMyState().turnoChoosen,
          os_name: osList[ctx.body]
        },
      });
      return gotoFlow(GetInformationOS);
    }
  }
);
