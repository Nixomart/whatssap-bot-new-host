import saveTurnToFirebase from "./saveTurnToFirebase.js";
import dayjs from "dayjs";
import { verifyTurns } from "../../fuctions/verifyTurns.js";
import choosePaymentMethod from "./choosePaymentMethod.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import dayOfBirth from "./dateOfBirth/dayOfBirth.js";
export default addKeyword<Provider, Database>(utils.setEvent("SEEKIND_PAYMENTS")).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    const medicData = state.getMyState().medic;
    const medicData2 = await state.getMyState().medic;
    const isAvailable = verifyTurns(
      medicData2.hourChoosenTofirebase,
      dayjs(medicData2.hourChoosenTofirebase)
        .add(medicData2.minutes, "minute")
        .format("YYYY-MM-DDTHH:mm:ss"),
      medicData2.uid
    );
    if (ctx.body.toLowerCase() == "fecha") {
      return gotoFlow(dayOfBirth);
    }

    if (state.getMyState().action === 1) {
        await flowDynamic(
          `¡Genial elección! 🌟 \nPara confirmar, ¿quieres *EDITAR* tu turno con el Profesional *${
            medicData.name
          }* para el *${dayjs(medicData.hourChoosenTofirebase).format(
            "dddd D, MMMM HH:mm a"
          )}*? \n\nRevisemos juntos los detalles:\nDirección: *qwoenqowe*\nProfesional: *${
            medicData.name
          }*\nFecha original: *${dayjs(
            medicData.turnChoosenToEDIT.start
          ).format("dddd D, MMMM HH:mm a")}*\nNueva fecha: *${dayjs(
            medicData.hourChoosenTofirebase
          ).format("dddd D, MMMM HH:mm a")}*\nNombre: *${
            medicData.turnChoosenToEDIT.customer.name
          }*\nDNI: *${
            medicData.turnChoosenToEDIT.customer.dni
          }*\n\nEscribe *estoy seguro* ✅ para confirmar la edición. \n\nEscribe *otros* ⏪ para elegir otro día.\n\nEscribe *menu* 🏠 para volver al menú.`
        )
        return gotoFlow(saveTurnToFirebase)
    } else {
      
      await state.update({ paymentMethod: medicData.paymentMethods, save: true });
        await flowDynamic(
          `*Elige un método de pago*, escribiendo el numero correspondiente 🔢:\n\n` +
          `${medicData.paymentMethods.map(
            (pay, index) => `*${index}*. ${
              pay.type === "os" ? "Obra Social" :
              pay.type === "transfer" ? "Transferencia" :
              pay.type === "presential" ? "Presencial" : ""
            }`
          ).join("\n")}`
        )
        return gotoFlow(choosePaymentMethod)
    }
  }
);