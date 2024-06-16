/* eslint-disable no-prototype-builtins */
import askEditTurn from "./askEditTurn.js";
import dayjs from "dayjs";
import menuFlow from "../menu.flow.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("EDIT_TURN_WELCOME")).addAnswer(
  "Escribe tu DNI sin puntos ni espacios .",
  { capture: true },
  async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
    const medicData = await state.getMyState().medic;
    const turns = medicData.turns.filter(
      (turn) =>
        (turn.customer.phone == ctx.from && dayjs().isBefore(dayjs(turn.start)) && turn.fixed == false)
    ).sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
    const turnIndex = medicData.turns
      .filter(
        (turn) =>
          turn.dni === ctx.body ||
          (turn.from == ctx.from && dayjs().isBefore(dayjs(turn.start))) && turn.fixed == false
      )
      .map((turn, index) => index);
      
    if (turns.length === 0) {
        await flowDynamic("Turno no encontrado, Escriba uno correcto por favor")
        return fallBack()
    }
    const tiempoParaCancelar = dayjs(turns[0].start).subtract(
      medicData.cancelTurns.quantity,
      medicData.cancelTurns.time
    );
    if (!dayjs().isBefore(tiempoParaCancelar)) {
        await flowDynamic(
          "No se puede editar el turno. El especialista ha puesto una tolerancia para cancelar o editar el turno. 🛑🔄"
        )
        return gotoFlow(menuFlow)
    }
    if (turns[0].confirmed === false && turns[0].hasOwnProperty("me")) {
      return endFlow(
        `¡Ya tienes un turno registrado para el día!\n${dayjs(
          turns[0].start
        ).format(
          "dddd D, MMMM HH:mm a"
        )}\n\n*Confirma el turno, pagandolo para poder modificarlo*\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
      );
    }
    if (turns[0].confirmed === false && !turns[0].hasOwnProperty("me")) {
      return endFlow(
        `¡Ya tienes un turno registrado para el día!\n${dayjs(
          turns[0].start
        ).format(
          "dddd D, MMMM HH:mm a"
        )}\n\n*Espera a que el especialista lo confirme para poder editarlo*\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
      );
    }
  

    await state.update({
      medic: {
        ...medicData,
        turnFoundToEdit: turns,
        turnIndexToEdit: turnIndex,
      },
    });
    return gotoFlow(askEditTurn);
  }
);
