import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import menuFlow from "../menu.flow";
import dayjs from "dayjs";
export default addKeyword<Provider, Database>(utils.setEvent("SHOW_TURN"))
  .addAction(null, async (ctx, { state, flowDynamic, endFlow }) => {
    const medicDataa = state.getMyState().medic;
    const days = medicDataa.businessHours.map((item) => `*${dayjs().set("day", item.daysOfWeek[0]).format("dddd")}*` + " Horario: " + item.startTime + " - " + item.endTime);
    /* for (let index = 0; index < medicDataa.businessHours.length; index++) {
        console.log("DIA: ", medicDataa.businessHours[index]);  
        for (let index2 = 0; index < medicDataa.businessHours.length; index++) {
            if (medicDataa.businessHours[index].daysOfWeek[0] === medicDataa.businessHours[index2].daysOfWeek[0]) {
                console.log("DIA IGUAL: ", dayjs().set("day", medicDataa.businessHours[index].daysOfWeek[0]).format("dddd"), medicDataa.businessHours[index].startTime, medicDataa.businessHours[index].endTime);
            }else{
                console.log("DIA DIFERENTE: ", dayjs().set("day", medicDataa.businessHours[index].daysOfWeek[0]).format("dddd"), medicDataa.businessHours[index].startTime, medicDataa.businessHours[index].endTime);
            }
        }
    } */
   console.log("DAYS: ", days);
   
    /* return endFlow() */
    return await flowDynamic(
      `¡Hola! 👋👨‍⚕️ Aquí están tus opciones de días y horarios de atención:\n\n${days
        .map((item) => item)
        .join("\n")}\n\nEscribe *menu* 🏠 para volver al menú.`
    );
  })
  .addAction({ capture: true }, async (ctx, { gotoFlow, state }) => {
    if (ctx.body.toLowerCase() == "menu") {
      console.log("Escogio menu");
      
      return gotoFlow(menuFlow);
    } else {
      console.log("No escogio menu");
      
      return gotoFlow(menuFlow);
    }
  });
