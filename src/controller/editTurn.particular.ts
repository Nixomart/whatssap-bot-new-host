import axios from "axios";
import provider from "../provider/provider.js";
import { Request, Response } from "express";
import { ApiResponse } from "~/dto/ApiResponse.js";

export const editTurnParticular = async (bot, req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const response = await axios.post(
      `http://${turnToSendCustomer.uid}:4000/edit-turn`, {turnToSendCustomer}
    );
    console.log("RESPONSE DE ENVIAR a particular: ",response);
    res.end( response.data );
  } catch (error) {
    const response:ApiResponse<string> = {
      message: "error to send message particular edit turn",
      status: "error",
      status_code: 500,
      data: null,
    };
    console.log(`ERROR AL ENVIAR TURNO EDITADO MEDIANTE DOCKER PARTICULAR: http://${turnToSendCustomer.uid}:4000/edit-turn: `, error);
        res.end(JSON.stringify(response));
  }
};
