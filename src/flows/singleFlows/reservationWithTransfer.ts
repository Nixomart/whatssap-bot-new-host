/* eslint-disable no-prototype-builtins */
import dayjs from "dayjs";
import { writeFile } from "fs/promises";
import { saveInFirebaseTurn } from "../../fuctions/saveInFirebasenewTurn.js";
import { updateFirebaseData } from "../../fuctions/updateFirebaseData.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import {
  MemoryDB as Database,
  EVENTS,
  addKeyword,
  utils,
} from "@builderbot/bot";
import provider from "~/provider/provider.js";
const localPaths = [];
let imageProcessed = false; // Flag to track if an image has been processed
export default addKeyword<Provider, Database>(EVENTS.MEDIA)
  /* .addAction(async(ctx, { provider, queue }) => { 
  if (!imageProcessed) { 
    await queue.enqueue('processImage', async () => {
      const localPath = await provider.saveFile(ctx, { path: "./images" });
      localPaths.push(localPath);
    }, 'imageProcessingTask');
    await queue.processQueue('processImage');
    await queue.clearQueue('processImage');
    queue.clearAndDone('processImage', {fingerIdRef: 'imageProcessingTask'});
    imageProcessed = true; 
  }
}) */
  .addAction(async (ctx, { state, flowDynamic, gotoFlow, endFlow, queue }) => {
    try {
      if (imageProcessed) {
        console.log("SEGUNDA IMAGEN CON IMAGE PROCCESED" , imageProcessed);
      } else {
        imageProcessed = true;
        const data = state.getMyState();
        console.log("ALA PRIMERA IMAGEN ", imageProcessed);
        if (
          (data !== undefined &&
            state.getMyState().hasOwnProperty("turnoNew")) ||
          (data !== undefined && data.hasOwnProperty("resend") && data.resend)
        ) {
          if (state.getMyState().turnoNew.paymentMethod.includes("transfer")) {
            const turnoNew = state.getMyState().turnoNew;
            const dataUpdated = await updateFirebaseData(data.medic.uid);
            console.log("TURNO ID: ", turnoNew.id);
            await state.update({
              medic: { ...dataUpdated, turnId: turnoNew.id },
            });
            const turno = turnoNew;
            if (turno.imageConfirmation === null) {
              const medicData = state.getMyState().medic;
              console.log("entra a saveFile provider. ");
              const localPath = await provider.saveFile(ctx, { path: `./` });
              await saveInFirebaseTurn(medicData, localPath, turnoNew.id);
              return endFlow(
                `🙌 ¡GRACIAS! Recibimos con éxito la foto. Esta será enviada al Profesional con *toda tu información*. ¡Muchas gracias! 📸💼\n\nAquí están los detalles de tu turno:\n📍 Dirección: *qwoenqowe*\n👨‍⚕️ Profesional: *${
                  medicData.name
                }*\n📅 Fecha: *${dayjs(turnoNew.start).format(
                  "dddd D, MMMM HH:mm a"
                )}*\n👤 Nombre: *${
                  turnoNew.customer.name + " " + turnoNew.customer.lastname
                }*\n🔍 DNI: *${
                  turnoNew.customer.dni
                }*\n\n📱 El número de celular donde recibirás la confirmación: ${
                  ctx.from
                }\nPara volver al menu en cualquier momento escribe *miturno ${
                  medicData.consultName
                }*`
              );
            } else {
              return endFlow(
                `Se envió la primera foto que enviaste! 😁 \n\nTu numero de celular:${ctx.from}
                `
              );
            }
          } else {
            return endFlow(
              `❌ ¡Error! Has elegido un método de pago diferente a transferencia o no has comenzado un turno. 🔄💳 Por favor, escribe *miturno justo con el nombre del esecialista* si deseas volver al menú. 📋🔙`
            );
          }
        } else {
          return endFlow(
            `📸 ¡Hemos recibido una imagen sin comenzar un turno! 🚫💼\n\nSi no has enviado una foto de comprobante al guardar turno, escribe *miturno* seguido del nombre del médico que quieres buscar. O escribe *mispagos* seguido del nombre del profesional que quieres buscar 📝🔍\n\n📱 Tu número de celular: ${ctx.from}\n\n*Si haz mandado una foto erronea, el profesional podra enviarte un mensaje que no ha recibido la transferencia y podrás reenviar la foto*`
          );
        }
      }
    } catch (error) {
      console.log("error", error);
      return endFlow(
        `Si deseas pedir un turno Escribe *mispagos justo con el nombre del Profesional*
        `
      );
    }
  });
