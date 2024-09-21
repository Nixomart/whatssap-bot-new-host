import askDeleteTurn from "./askDeleteTurn.js";
import dayjs from "dayjs";
import menuFlow from "../menu.flow.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js"
import { addKeyword, utils } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
dayjs.extend(isSameOrBefore)
export default addKeyword<Provider, Database>(utils.setEvent("CANCEL_TURN_WELCOME")).addAnswer(
  "Lamentamos que canceles el turno!. \n\nEscribe tu DNI sin puntos ni espacios.",
  { capture: true },
  async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
    const medicData = await state.getMyState().medic;
    const turns = medicData.turns.filter(
      (turn) =>
        turn.customer.phone == ctx.from && dayjs().isSameOrBefore(dayjs(turn.start), "h") && turn.fixed === false
    );
    const turnsIndex = medicData.turns
      .filter(
        (turn) =>
          turn.customer.phone == ctx.from && dayjs().isSameOrBefore(dayjs(turn.start), "h") && turn.fixed === false
      )
      .map((turn, index) => index);

    if (turns.length === 0) {
        await flowDynamic("Turno no encontrado, Escriba el dni correcto por favor")
        return fallBack()
    }
    const tiempoParaCancelar = dayjs(turns[0].start).subtract(
      medicData.cancelTurns.quantity,
      medicData.cancelTurns.time
    );
   
    if (!dayjs().isBefore(tiempoParaCancelar)) {
        await flowDynamic(
          "No se puede cancelar el turno. El Profesional ha puesto una tolerancia para cancelar o editar el turno. 🛑🔄"
        )
        return gotoFlow(menuFlow)
    }
    /* if (turns[0].confirmed === false && turns[0].hasOwnProperty("me")) {
      return endFlow(
        `¡Ya tienes un turno registrado para el día!\n${dayjs(
          turns[0].start
        ).format(
          "dddd D, MMMM HH:mm a"
        )}\n\n*Confirma el turno, pagandolo para poder cancelarlo*`
      );
    }
    if (turns[0].confirmed === false && !turns[0].hasOwnProperty("me")) {
      return endFlow(
        `¡Ya tienes un turno registrado para el día!\n${dayjs(
          turns[0].start
        ).format(
          "dddd D, MMMM HH:mm a"
        )}\n\n*Espera a que el Profesional lo confirme para poder cancelarlo*`
      );
    } */

    await state.update({
      medic: { ...medicData, turnFound: turns, turnsIndexToDelete: turnsIndex },
    });
    return gotoFlow(askDeleteTurn);
  }
);
