import axios from "axios";
/* SEND PARTICULAR DOCKER CONFIRMED TURN */
export const sendParticularTurnConfirmedCustomer = async (req, res) => {
  const { document } = req.params;

  try {
    const { turnToSendCustomer } = req.body;
    const response = await axios.post(
      `http://${document}:4000/send-messageCustomer/confirmed`,
      { turnToSendCustomer }
    );
    console.log("RESPONSE DE ENVIAR a particular TURNO CONFIRMADO: ", response);
    /* 
        log de la funcion de ella
          console.log(
      "ID: ",
      id,
      "ENVIA A CUSTOMER PARTICULAR, RAPIDO: /send-messageCustomer"
    );
        */
    res.send(response.data);
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO CONFIRMADO MEDIANTE DOCKER PARTICULAR: http://${document}:4000/send-messageCustomer/confirmed `,
      error
    );
    res.send({ data: "No se pudo enviar mensaje" });
  }
};
