import provider from "../provider/provider.js";
export const sendToCustomerParticular = async (req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const id = `${turnToSendCustomer.phone}@c.us`;
    let templateMessage;
    if (turnToSendCustomer.fixed === true) {
      templateMessage = {
        text: `🔵🔵*TURNO CONFIRMADO*🔵🔵 🧨 \n\n💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes un turno *RECURRENTE* con: *${
          turnToSendCustomer.newTurn.specialist
        }* \n 📅Los dias: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n Mensaje del Especialista: *${
          turnToSendCustomer.message === null
            ? "Sin mensaje"
            : `*${turnToSendCustomer.message}*`
        }*\n\n*METODO DE PAGO*\n ${turnToSendCustomer.newTurn.paymentMethod
          .map(
            (pay, index) =>
              `${
                pay === "os"
                  ? "Obra Social"
                  : pay === "transfer"
                  ? "Transferencia"
                  : pay === "presential" && "Presencial"
              }`
          )
          .join("\n")}\n\n*ESTO QUIERE DECIR QUE TODOS LOS ${
          turnToSendCustomer.date
        } TIENES UN TURNO, ESCRIBE "mispagos ${
          turnToSendCustomer.name
        }" PARA VER QUE TURNOS TIENES A PAGAR*`,
        footer: "Sistema: pedirturno.online",
      };
    } else {
      templateMessage = {
        text: `🔵🔵*TURNO CONFIRMADO*🔵🔵 🧨 \n\n💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno con: *${
          turnToSendCustomer.newTurn.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n Mensaje del Especialista: *${
          turnToSendCustomer.message === null
            ? "Sin mensaje"
            : `*${turnToSendCustomer.message}*`
        }*\n\n*METODO DE PAGO*\n ${turnToSendCustomer.newTurn.paymentMethod
          .map(
            (pay, index) =>
              `${
                pay === "os"
                  ? "Obra Social"
                  : pay === "transfer"
                  ? "Transferencia"
                  : pay === "presential" && "Presencial"
              }`
          )
          .join("\n")}\n\n *ESCRIBE "mispagos ${
          turnToSendCustomer.name
        }" PARA VER QUE TURNOS TIENES A PAGAR*`,
        footer: "Sistema: pedirturno.online",
      };
    }
    const abc = await provider.getInstance();
    await abc.sendMessage(id, templateMessage);
    res.send({ data: "enviado!" });
  } catch (error) {
    console.log("ERROR AL ENVIAR TURNO CONFIRMADO MEDIANTE ESTE DOCKER: ", error);
    res.send({ data: "No se pudo enviar mensaje" });
  }
};
