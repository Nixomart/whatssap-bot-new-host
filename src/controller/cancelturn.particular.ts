import axios from "axios";
import provider from "../provider/provider.js";

export const cancelTurnSendParticular = async (req, res) => {
  try {
    const { turnToSendCustomer } = req.body;
    const response = await axios.post(
      `http://${turnToSendCustomer.uid}:4000/cancel-turn`,
      { turnToSendCustomer }
    );
    console.log("RESPONSE DE ENVIAR a particular: ", response);
    res.send(response.data);
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO CANCELADO MEDIANTE DOCKER PARTICULAR: http://${turnToSendCustomer.uid}:4000/cancel-turn `,
      error
    );
    res.send({ data: "No se pudo enviar mensaje" });
  }
};
