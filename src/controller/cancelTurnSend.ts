import provider from "../provider/provider.js";

export const cancelTurnSend = async (req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const id = `${turnToSendCustomer.phone}@c.us`;
    let templateMessage
    if (turnToSendCustomer.fixed === true && turnToSendCustomer.newTurn.imageConfirmation !== null) {
      templateMessage = {
        text: `🔴🔴*El especialista no recibio el pago correctamente de tu turno *RECURRENTE**🔴🔴 \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n Tu turno turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\nEscribe *mispagos ${turnToSendCustomer.consultName}* para pagarlo nuevamente\n\nMensaje del especialista: ${turnToSendCustomer.message}`,
        footer: "Sistema: pedirturno.online",
      };
    }else{
      templateMessage = {
        text: `🔴🔴*Tu turno fue cancelado*🔴🔴 \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n Tu turno turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\nMensaje del especialista: *${turnToSendCustomer.message}* `,
        footer: "Sistema: pedirturno.online",
      };
    }
    await provider.sendMessage(id, templateMessage , {});

    res.send({ data: "enviado!" });
  } catch (error) {
    console.log("ERROR AL CANCELAR TURNO MEDIANTE ESTE DOCKER: ", error);
    res.send({ data: "No se pudo enviar mensaje" });
  }
};
