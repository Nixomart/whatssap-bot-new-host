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
export default addKeyword<Provider, Database>("miturno",{ sensitive: true }).addAnswer(
  "Buscando especialista..🕑",
  null,
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
    const medicosplit = ctx.body.split(" ");

    if (medicosplit.length > 1) {
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
        querySnapshot.forEach(async(doc) => {
          await state.update({ medic: doc.data() });
        });
        const medicData = state.getMyState().medic;
        const customerFound = medicData.customers.find(
          (customer) => customer.phone == ctx.from
        );
        /* https://api.whatsapp.com/send?phone=549${medicData.phone}1&text=hola 
        
        https://wa.me/549${medicData.phone}?text=hola
        */
        if (medicData.ownBot === true) {
          return endFlow(
            `*¡Ups!* 🤷‍♂️\n\n👨‍⚕️ El médico tiene su propio bot de asistencia. 🤖 Si necesitas registrar un turno, simplemente envía un mensaje diciendo "turno" al siguiente número: 📲 ${medicData.phone}.\n\nO, si prefieres, puedes iniciar la conversación directamente haciendo clic en este enlace:\nhttps://wa.me/549${medicData.profile.socialNetwork.whatssap}?text=miturno\n\n¡No te quedes sin tu cita! Hazlo ahora mismo. 🕒`
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
              "👨‍⚕️ Se ha bloqueado tu número.\n\nEsto se debe a múltiples cancelaciones o postergaciones de citas. Si crees que esto es un error o deseas discutir tu situación, te recomendamos contactar directamente con el especialista."
            );
          }
          
            await flowDynamic(
              `*¡Hola!* 🌟\n ${medicData.about} 😊\n\nEspecialista: *${medicData.name}*, \n\nSi quieres *registrar un turno* o *ver tu turno*. Escribe *si quiero*.\nSi quieres cancelar un turno. Escribe *cancelar*. \nPara cambiar la fecha de un turno. Escribe *editar*\n\nEstoy aquí para facilitarte el proceso! 📅👨‍⚕️ ¡Adelante! 🌈`
            )
            return gotoFlow(welcomeFlow)
        } else {
            await flowDynamic(
              `*¡Hola!* 🌟\n ${medicData.about} 😊\n\nEspecialista: *${medicData.name}*, \n\nSi quieres *registrar un turno* o *ver tu turno*. Escribe *si quiero*.\nSi quieres cancelar un turno. Escribe *cancelar*. \nPara cambiar la fecha de un turno. Escribe *editar*\n\nEstoy aquí para facilitarte el proceso! 📅👨‍⚕️ ¡Adelante! 🌈`
            )
            return gotoFlow(welcomeFlow)
        }
      } else {
        return endFlow(
          "*¡Ups!* 🤷‍♂️\nNo se encontró médico en esta búsqueda. \nPor favor, asegúrate de ingresar el nombre correcto o intenta con otro especialista. 🩺🔍          "
        );
      }
    } else {
      return endFlow(
        "*¡Atención!* ⚠️\nCarácter incorrecto. Por favor, utiliza solo letras al buscar un médico. 📝🚫\nEstamos en el proceso de encontrar un médico. Inténtalo de nuevo. 👨‍⚕️🔍        "
      );
    }
  }
);
