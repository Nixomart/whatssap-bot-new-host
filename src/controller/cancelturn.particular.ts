import axios from "axios";
import { ApiResponse } from "~/dto/ApiResponse";
export const cancelTurnSendParticular = async (bot, req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const response = await axios.post(
      `http://${turnToSendCustomer.uid}:4000/cancel-turn`,
      { turnToSendCustomer }
    );
    console.log("RESPONSE DE ENVIAR a particular: ", response);

    res.end(response.data);
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO CANCELADO MEDIANTE DOCKER PARTICULAR: http://${turnToSendCustomer.uid}:4000/cancel-turn `,
      error
    );
    const response: ApiResponse<string> = {
      message: "error to send message particular cancel turn",
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
