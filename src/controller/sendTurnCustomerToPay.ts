import provider from "../provider/provider.js";

export const sendTurnCustomerToPay = async (req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const id = `${turnToSendCustomer.phone}@c.us`;
    let templateMessage 
    if (turnToSendCustomer.fixed === true) {
      templateMessage = {
        text: `🔵🔵*Tienes un turno RECURRENTE*🔵🔵 
         \n📅*El especialista te ha asignado un turno RECURRENTE:* \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno *RECURRENTE* con: *${
          turnToSendCustomer.specialist
        }* \n 📅Los dias: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\nEscribe *mispagos ${turnToSendCustomer.name}* para eligir un metodo. Deberás pagar siempre antes del proximo turno para que lo confirmes.`,
        footer: "Sistema: pedirturno.online",
      };
    }else{
      templateMessage = {
        text: `🔵🔵*Tienes un turno proveniente del sistema PedirTurno.Online*🔵🔵 
         \n📅*El especialista te ha asignado un turno:* \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\n*METODOS DE PAGO🔢* \n ${turnToSendCustomer.newTurn.paymentMethod.map(
          (pay, index) => `*${index}*. ${pay == "os"? "Obra social": pay == "presential" ? "Presencial": "Transferencia"}\n`
        )}\nEscriba *mispagos ${turnToSendCustomer.name}* para eligir un metodo`,
        footer: "Sistema: pedirturno.online",
      };
    }
    
    await provider.sendMessage(id, templateMessage, {});

    res.send({ data: "enviado!" });
  } catch (error) {
    console.log("ERROR AL ENVIAR TURNO PARA PAGAR MEDIANTE ESTE DOCKER: ", error);
        res.send({ data: "No se pudo enviar mensaje" });
  }
};
