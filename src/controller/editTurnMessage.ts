import provider from "../provider/provider.js";

export const editTurnMessage = async (req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const id = `${turnToSendCustomer.phone}@c.us`;
    let templateMessage;
    if (turnToSendCustomer.fixed == true) {
      templateMessage = {
        text: `🟢🟢 *¡Atención! Tu turno *RECURRENTE* ha sido reprogramado* 🟢🟢\n\n
    💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}* 💢💢\n\n
    Tu cita con *${turnToSendCustomer.specialist}* ha sido modificada. Aquí están los nuevos detalles:\n\n
    📅 *Fecha anterior*: *${turnToSendCustomer.oldDate}*\n
    📅 *Nueva fecha*: *${turnToSendCustomer.date}*\n\n
    📍 *Lugar*: *${turnToSendCustomer.adress}*\n\n
    📝 *Mensaje del especialista*: ${turnToSendCustomer.message}\n\n
    Te pedimos disculpas por cualquier inconveniente que esto pueda causar y agradecemos tu comprensión. Estamos a tu disposición para cualquier consulta que puedas tener.`,
        footer: "Sistema: pedirturno.online",
      };
    } else {
      templateMessage = {
        text: `🟢🟢 *¡Atención! Tu turno ha sido reprogramado* 🟢🟢\n\n
    💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}* 💢💢\n\n
    Tu cita con *${turnToSendCustomer.specialist}* ha sido modificada. Aquí están los nuevos detalles:\n\n
    📅 *Fecha anterior*: *${turnToSendCustomer.oldDate}*\n
    📅 *Nueva fecha*: *${turnToSendCustomer.date}*\n\n
    📍 *Lugar*: *${turnToSendCustomer.address}*\n\n
    📝 *Mensaje del especialista*: ${turnToSendCustomer.message}\n\n
    Te pedimos disculpas por cualquier inconveniente que esto pueda causar y agradecemos tu comprensión. Estamos a tu disposición para cualquier consulta que puedas tener.`,
        footer: "Sistema: pedirturno.online",
      };
    }

    await provider.sendMessage(id, templateMessage, {});

    res.send({ data: "enviado!" });
  } catch (error) {
    console.log("ERROR AL EDITAR TURNO MEDIANTE ESTE DOCKER: ", error);
    res.send({ data: "No se pudo enviar mensaje" });
  }
};
