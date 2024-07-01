/* eslint-disable no-case-declarations */
import listOsSpecialistWorkSave from "./payOS/listOsSpecialistWorkSave.js";
import seeKindOfPayments from "./seeKindOfPayments.js";
import messageConfirmTransferSave from "./payTransfer/messageConfirmTransferSave.js"
import messageconfirmPresentialSave from "./payPresential/messageConfirmPresentialSave.js"
import messageConfirmSave from "./payOS/messageConfirmSave.js";
import getOsNameToSave from "./payOS/getOsNameToSave.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_PAY")).addAction(
  { capture: true },
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
    const paymentChoosen = state.getMyState().paymentChooseBeforeSave;
    const medicData = state.getMyState().medic;

    if (ctx.body.toLowerCase() == "estoy seguro") {
      switch (paymentChoosen[0].type) {
        case "os":
          const patientFound = state.getMyState().patientFound
          const hasOsCsutomer = medicData.customers.find(
            (cus) => cus.phone == ctx.from
          );
          const paymentCC = medicData.paymentMethods.find((pay)=>pay.id == "3")

          if (patientFound.patientFound === false || (hasOsCsutomer !== undefined && hasOsCsutomer.os_name === null)) {
            if (paymentCC.allOs == false) {
              return gotoFlow(listOsSpecialistWorkSave);
            }else{
              return gotoFlow(getOsNameToSave)
            }
          } else {
            await state.update({
              turnoNew: {
                ...state.getMyState().turnoNew,
                os_name: hasOsCsutomer.os_name,
                os_number: hasOsCsutomer.os_number,
              },
            });
           return gotoFlow(messageConfirmSave);
          }
        case "transfer":
          return gotoFlow(messageConfirmTransferSave);
        case "presential":
          return gotoFlow(messageconfirmPresentialSave);
        default:
      }
    } else {
      return gotoFlow(seeKindOfPayments);
    }
  }
);
