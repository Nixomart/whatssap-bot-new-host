import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";

export const editTurnMessage = async (bot,req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const id = `${turnToSendCustomer.phone}`;
    let message;
    if (turnToSendCustomer.fixed == true) {
      message =  `🟢🟢 *¡Atención! Tu turno *RECURRENTE* ha sido reprogramado* 🟢🟢\n\n
    💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}* 💢💢\n\n
    Tu cita con *${turnToSendCustomer.specialist}* ha sido modificada. Aquí están los nuevos detalles:\n\n
    📅 *Fecha anterior*: *${turnToSendCustomer.oldDate}*\n
    📅 *Nueva fecha*: *${turnToSendCustomer.date}*\n\n
    📍 *Lugar*: *${turnToSendCustomer.address}*\n\n
    📝 *Mensaje del especialista*: *${turnToSendCustomer.message}*\n\n
    Te pedimos disculpas por cualquier inconveniente que esto pueda causar y agradecemos tu comprensión. Estamos a tu disposición para cualquier consulta que puedas tener.`
    } else {
      message =  `🟢🟢 *¡Atención! Tu turno ha sido reprogramado* 🟢🟢\n\n
    💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}* 💢💢\n\n
    Tu cita con *${turnToSendCustomer.specialist}* ha sido modificada. Aquí están los nuevos detalles:\n\n
    📅 *Fecha anterior*: *${turnToSendCustomer.oldDate}*\n
    📅 *Nueva fecha*: *${turnToSendCustomer.date}*\n\n
    📍 *Lugar*: *${turnToSendCustomer.address}*\n\n
    📝 *Mensaje del especialista*: *${turnToSendCustomer.message}*\n\n
    Te pedimos disculpas por cualquier inconveniente que esto pueda causar y agradecemos tu comprensión. Estamos a tu disposición para cualquier consulta que puedas tener.`
    }

    await bot.sendMessage(id, message, {});
    const response: ApiResponse<string> = {
      message: "send message edit turn",
      status: "success",
      status_code: 200,
      data: null,
    };
    res.end(JSON.stringify(response));
  } catch (error) {
    const response: ApiResponse<string> = {
      message: "error to send message edit turn",
      status: "error",
      status_code: 500,
      data: null,
    };
    console.log("ERROR AL EDITAR TURNO MEDIANTE ESTE DOCKER: ", error);
    res.end(JSON.stringify(response));
  }
};
