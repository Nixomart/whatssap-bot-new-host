import axios from "axios";
import { ApiResponse } from "~/dto/ApiResponse";
/* SEND DOCKER PARTICULAR TO PAY TURN */
export const controlMessageParticular = async (bot, req, res) => {
  try {
    const { turnToSendCustomer } = req.body;
    const { document } = req.params;
    const response = await axios.post(
      `http://${document}:4000/send-messageCustomer`,
      { turnToSendCustomer }
    );
    console.log("RESPONSE DE ENVIAR a particular: ", response);
    
    res.end(JSON.stringify(response.data));
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO A PAGAR MEDIANTE DOCKER PARTICULAR: http://${document}:4000/end-messageCustomer `,
      error
    );
    const response: ApiResponse<string> = {
      message: "error to send message particular error from DOCKER MAIN : " + error.message,
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
