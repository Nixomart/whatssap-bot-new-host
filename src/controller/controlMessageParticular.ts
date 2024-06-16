import axios from "axios";
  /* SEND DOCKER PARTICULAR TO PAY TURN */
export const controlMessageParticular = async (req, res) => {
  try {
    const { turnToSendCustomer } = req.body;
    const {document} =req.params
    const response = await axios.post(
      `http://${document}:4000/send-messageCustomer`, {turnToSendCustomer}
    );
    console.log("RESPONSE DE ENVIAR a particular: ",response);
    res.send( response.data );
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO A PAGAR MEDIANTE DOCKER PARTICULAR: http://${document}:4000/send-messageCustomer `,
      error
    );    res.send({ data: "No se pudo enviar mensaje" });
  }
};
