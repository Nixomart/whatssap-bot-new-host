/* eslint-disable no-case-declarations */

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import listPaymentMethods from "./listPaymentMethods.js";
import listOsSpecialistWorks from "./paymentOS/listOsSpecialistWorks.js";
import confirmPresentialCome from "./payPresential/confirmPresential.come.js";
import messageConfirm from "./paymentOS/messageConfirm.js";
import getOsNameToSaveCOME from "./paymentOS/getOsNameToSaveCOME.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import confirmTransferSaveCome from "./payTransfer/confirmTransferSave.come.js";
dayjs.extend(isSameOrAfter);

export default addKeyword<Provider, Database>(utils.setEvent("IS_AGREE_TO_PAY")).addAction(
  { capture: true },
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
    const paymentChoosen = state.getMyState().paymentChooseBeforeSave;
    const medicData = state.getMyState().medic;

    if (ctx.body.toLowerCase() == "estoy seguro") {
      switch (paymentChoosen[0]) {
        case "os":
          const hasOsCsutomer = medicData.customers.find(
            (cus:any) => cus.phone == ctx.from
          );
          const paymentCC = medicData.paymentMethods.find(
            (pay) => pay.id == "3"
          );

          if (hasOsCsutomer.os_name === null) {
            await state.update({
              turnoChoosen: {
                ...state.getMyState().turnoChoosen,
              },
            });
            if (paymentCC.allOs == false) {
              return gotoFlow(listOsSpecialistWorks);
            } else {
              return gotoFlow(getOsNameToSaveCOME);
            }
          } else {
            await state.update({
              turnoChoosen: {
                ...state.getMyState().turnoChoosen,
                os_name: hasOsCsutomer.os_name,
                os_number: hasOsCsutomer.os_number,
              },
            });
            return gotoFlow(messageConfirm);
          }
        case "transfer":
          return gotoFlow(confirmTransferSaveCome);
        case "presential":
          return gotoFlow(confirmPresentialCome);
        default:
          break;
      }
    } else {
      return gotoFlow(listPaymentMethods);
    }
  }
);
