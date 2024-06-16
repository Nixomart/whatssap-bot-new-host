import { Response } from "express";
import fs from "fs";
import path from "path";
export const getQr = (req, res: Response) => {
  const qrImagePath = "./bot.qr.png";
  fs.readFile(qrImagePath, (err, data) => {
    if (err) {
      console.log("Error al leer la imagen del código QR:", err);
      return;
    }
    res.contentType("image/png");
    res.send(data);
  });
};
