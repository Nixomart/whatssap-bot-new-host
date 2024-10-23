import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import welcomeFlow from "./welcome.flow.js";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { addKeyword } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
dayjs.extend(isBetween);
export default addKeyword<Provider, Database>(["miturno", "Miturno"], {
  sensitive: true,
}).addAction(
  null,
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
    const medicosplit = ctx.body.split(" ");
    console.log("ctx.body", ctx.body);

    if (medicosplit.length > 1 && (medicosplit[0] === "miturno" || medicosplit[0] === "Miturno")  ) {
      const consultsRef = collection(db, "consults");
      const qeqwe = query(
        consultsRef,
        where("consultName", "==", medicosplit[1])
      );

      const querySnapshot = await getDocs(qeqwe);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
        });
      } else {
        console.log("Documento no encontrado.");
      }
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          await state.update({ medic: doc.data() });
        });
        const medicData = state.getMyState().medic;
        const customerFound = medicData.customers.find(
          (customer) => customer.phone == ctx.from
        );
        if (
          medicData.paymentMethods.length !== 0 &&
          medicData.reservaciones.length !== 0 &&
          medicData.businessHours.length !== 0
        ) {
          if (medicData.onlySendMessagesBot) {
            return endFlow();
          } else {
            await flowDynamic("...🕒")  

            if (medicData.ownBot === true) {
              return endFlow(
                `*¡Ups!* 🤷‍♂️\n\n👨‍⚕️ El médico tiene su propio bot de asistencia. 🤖 Si necesitas registrar un turno, simplemente envía un mensaje diciendo "turno" al siguiente número: 📲 ${medicData.profile.socialNetwork.whatssap}.\n\nO, si prefieres, puedes iniciar la conversación directamente haciendo clic en este enlace:\nhttps://wa.me/549${medicData.profile.socialNetwork.whatssap}?text=miturno\n\n¡No te quedes sin tu cita! Hazlo ahora mismo. 🕒`
              );
            }
            if (customerFound != undefined) {
              if (customerFound.cancell >= 3 && customerFound.ban === false) {
                const docRef = doc(db, "consults", medicData.uid);
                const customerss = medicData.customers.map((cu) => {
                  if (customerFound.phone == cu.phone) {
                    return {
                      ...cu,
                      ban: true,
                    };
                  }
                  return { ...cu };
                });
                await updateDoc(docRef, {
                  customers: customerss,
                });
              }
              if (customerFound.ban || customerFound.cancell >= 3) {
                return endFlow(
                  "👨‍⚕️ Se ha bloqueado tu número.\n\nEsto se debe a múltiples cancelaciones o postergaciones de citas. Si crees que esto es un error o deseas discutir tu situación, te recomendamos contactar directamente con el Profesional."
                );
              }

              await flowDynamic(
                `*¡Hola! soy el asistente de ${medicData.name}* 🌟\n${medicData.about} 😊 \n\nSi quieres *registrar un turno* o *ver tu turno*. Escribe *si quiero*.\n\nSi quieres cancelar un turno. Escribe *cancelar*.\n\nPara cambiar la fecha de un turno. Escribe *editar*\n\nPara ver los horarios del especialista. Escribe *horarios*\n\nPara saber los tipos de turnos del especialista. Escribe *turnos*\n\nEstoy aquí para facilitarte el proceso! 📅👨‍⚕️ ¡Adelante! 🌈`
              );
              return gotoFlow(welcomeFlow);
            } else {
              await state.update({patientFound: {patientFound: false}});
              await flowDynamic(
                `*¡Hola! soy el asistente de ${medicData.name}* 🌟\n${medicData.about} 😊 \n\nSi quieres *registrar un turno* o *ver tu turno*. Escribe *si quiero*.\n\nSi quieres cancelar un turno. Escribe *cancelar*.\n\nPara cambiar la fecha de un turno. Escribe *editar*\n\nPara ver los horarios del especialista. Escribe *horarios*\n\nPara saber los tipos de turnos del especialista. Escribe *turnos*\n\nEstoy aquí para facilitarte el proceso! 📅👨‍⚕️ ¡Adelante! 🌈`
              );
              return gotoFlow(welcomeFlow);
            }
          }
        }else{
          console.log("No tiene metodos de pago");
          
          return endFlow()
        }
        /* https://api.whatsapp.com/send?phone=549${medicData.phone}1&text=hola 
        
        https://wa.me/549${medicData.phone}?text=hola
        */
      } else {
        return endFlow(
          "*¡Ups!* 🤷‍♂️\nNo se encontró médico en esta búsqueda. \nPor favor, asegúrate de ingresar el nombre correcto o intenta con otro Profesional. 🩺🔍          "
        );
      }
    } else {
      return endFlow(
        "*¡Atención!* ⚠️\nCarácter incorrecto. Por favor, utiliza solo letras al buscar un médico. 📝🚫\nEstamos en el proceso de encontrar un médico. Inténtalo de nuevo. 👨‍⚕️🔍        "
      );
    }
  }
);
