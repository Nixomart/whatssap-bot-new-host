import seeKindOfPayments from "./seeKindOfPayments.js";
import isAgreeToPaySwitchMethod from "./isAgreeToPaySwitchMethod.js";
import {v4 as uuidv4} from "uuid"
import dayjs from "dayjs";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_PAYMENTMETHOD")).addAction(
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    const medicData = state.getMyState().medic;
    const customer = state.getMyState().patientFound
    const paymentMethods = state.getMyState().paymentMethod
    const paymentChoosen = medicData.paymentMethods[ctx.body];
     if (paymentChoosen === undefined) {
        return gotoFlow(seeKindOfPayments)
    }else{
        await state.update({ paymentChooseBeforeSave: [paymentMethods[ctx.body]] });
        await state.update({
          turnoNew: {
            id: uuidv4(),
            customer: {
              id: customer.id,
              name: customer.name,
              lastname: customer.lastname,
              dni: customer.dni,
              phone: ctx.from,
            },
            start: medicData.hourChoosenTofirebase,
            end: dayjs(medicData.hourChoosenTofirebase)
              .add(medicData.minutes, "minute")
              .format("YYYY-MM-DDTHH:mm:ss"),
            paymentMethod: [paymentMethods[ctx.body].type],
            imageConfirmation: null,
            fixed: false,
            confirmed: false,
            send:true,
          },
        });
        await flowDynamic(
          `💡 Seguro que quieren elegir el método: ${
            paymentMethods[ctx.body].type === "os" ? "Obra Social" :
            paymentMethods[ctx.body].type === "transfer" ? "Transferencia" :
            paymentMethods[ctx.body].type === "presential" ? "Presencial" : ""
          } ?\n\n` +
          `Escribe *estoy seguro* para avanzar.\n` +
          `Escribe *pagar* para elegir un nuevo método.`
        )     
        return gotoFlow(isAgreeToPaySwitchMethod)
    }
  }
);
