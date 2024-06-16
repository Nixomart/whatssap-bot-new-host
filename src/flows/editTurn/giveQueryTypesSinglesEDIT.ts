import giveDaysWhenMedicWorkSingle from "../singleFlows/giveDaysWhenMedicWorkSingle.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("GIVE_QUERYTPYESSINGLES_EDIT"))
  .addAnswer(
    "Vamos a editar el turno! Elige un nuevo dia",
    null,
  )
  .addAction(async (ctx, { gotoFlow, state }) => {
    const turnChoosenToEDIT = state.getMyState().medic.turnChoosenToEDIT
    console.log("index reservaciones del turnchosen: ", state.getMyState().medic.reservaciones.map((re, index)=>{ 
      if (re.id === turnChoosenToEDIT.idReserva){
      return index  
      } return null
    }).filter((cho)=>cho != null)[0]
  
  );
    const chosenDurationReserva = state.getMyState().medic.reservaciones.map((re, index)=>{ 
      if (re.id === turnChoosenToEDIT.idReserva){
      return index
      } return null
    })
    await state.update({
      medic: {
        ...state.getMyState().medic,
        chosenDuration: chosenDurationReserva.filter((cho)=>cho != null)[0],
      },
    });
    return gotoFlow(giveDaysWhenMedicWorkSingle);
  });
