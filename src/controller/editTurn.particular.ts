import axios from "axios";
import provider from "../provider/provider.js";

export const editTurnParticular = async (req, res) => {
  try {
    const { turnToSendCustomer } = req.body;
    const response = await axios.post(
      `http://${turnToSendCustomer.uid}:4000/edit-turn`, {turnToSendCustomer}
    );
    console.log("RESPONSE DE ENVIAR a particular: ",response);
    res.send( response.data );
  } catch (error) {
    console.log(`ERROR AL ENVIAR TURNO EDITADO MEDIANTE DOCKER PARTICULAR: http://${turnToSendCustomer.uid}:4000/edit-turn: `, error);
        res.send({ data: "No se pudo enviar mensaje" });
  }
};
