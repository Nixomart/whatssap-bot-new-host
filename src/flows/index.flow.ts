import { createFlow } from "@builderbot/bot";
import helloFlow from "./hello.flow";
import menuFlow from "./menu.flow";
import welcomeFlow from "./welcome.flow";
import askDeleteTurn from "./cancelTurn/askDeleteTurn";
import cancelTurnWelcome from "./cancelTurn/cancelTurnWelcome";
import deleteTurnChoosen from "./cancelTurn/deleteTurnChoosen";
import DeleteTurnChoosenFromFirebase from "./cancelTurn/DeleteTurnChoosenFromFirebase";
import askEditTurn from "./editTurn/askEditTurn";
import editTurnChoosen from "./editTurn/editTurnChoosen";
import editTurnChoosenFromFirebase from "./editTurn/editTurnChoosenFromFirebase";
import editTurnWelcome from "./editTurn/editTurnWelcome";
import giveQueryTypesSinglesEDIT from "./editTurn/giveQueryTypesSinglesEDIT";
import choosePay from "./pay/choosePay";
import isAgreeToPay from "./pay/isAgreeToPay";
import listPaymentMethods from "./pay/listPaymentMethods";
import payFlow from "./pay/pay.flow";
import payFlowCome from "./pay/payFlow.come";
import chooseOsToPay from "./pay/paymentOS/chooseOsToPay";
import getInformationOS from "./pay/paymentOS/getInformationOS";
import getOsNameToSaveCOME from "./pay/paymentOS/getOsNameToSaveCOME";
import isAgreeToSaveOSpayment from "./pay/paymentOS/isAgreeToSaveOSpayment";
import listOsSpecialistWorks from "./pay/paymentOS/listOsSpecialistWorks";
import messageConfirm from "./pay/paymentOS/messageConfirm";
import dataToTransferCome from "./pay/payTransfer/dataToTransfer.come";
import confirmPresentialCome from "./pay/payPresential/confirmPresential.come";
import saveTurnPresentialCome from "./pay/payPresential/saveTurnPresential.come";
import confirmTransferSaveCome from "./pay/payTransfer/confirmTransferSave.come";
import choosePaymentMethod from "./singleFlows/choosePaymentMethod";
import daysAvailablesSingle from "./singleFlows/daysAvailablesSingle";
import giveDaysWhenMedicWorkNextWeekSingle from "./singleFlows/giveDaysWhenMedicWorkNextWeekSingle";
import giveDaysWhenMedicWorkSingle from "./singleFlows/giveDaysWhenMedicWorkSingle";
import giveQueryTypesSingle from "./singleFlows/giveQueryTypesSingle";
import isAgreeToPaySwitchMethod from "./singleFlows/isAgreeToPaySwitchMethod";
import reservationWithTransfer from "./singleFlows/reservationWithTransfer";
import saveTurnSingle from "./singleFlows/saveTurnSingle";
import saveTurnToFirebase from "./singleFlows/saveTurnToFirebase";
import seeKindOfPayments from "./singleFlows/seeKindOfPayments";
import chooseOsToPaySave from "./singleFlows/payOS/chooseOsToPaySave";
import confirmTurnSaveOs from "./singleFlows/payOS/confirmTurnSaveOs";
import getOsNameToSave from "./singleFlows/payOS/getOsNameToSave";
import listOsSpecialistWorkSave from "./singleFlows/payOS/listOsSpecialistWorkSave";
import messageConfirmSave from "./singleFlows/payOS/messageConfirmSave";
import messageConfirmPresentialSave from "./singleFlows/payPresential/messageConfirmPresentialSave";
import saveTurnPresentialSave from "./singleFlows/payPresential/saveTurnPresentialSave";
import giveDataToPaywithTransfer from "./singleFlows/payTransfer/giveDataToPaywithTransfer";
import messageConfirmTransferSave from "./singleFlows/payTransfer/messageConfirmTransferSave";
import dayOfBirth from "./singleFlows/dateOfBirth/dayOfBirth";
import monthOfBirth from "./singleFlows/dateOfBirth/monthOfBirth";
import yearOfBirth from "./singleFlows/dateOfBirth/yearOfBirth";
import getName from "./singleFlows/getInformation/getName";
import getLastname from "./singleFlows/getInformation/getLastname";
import getDni from "./singleFlows/getInformation/getDni";
import getInformationOsSave from "./singleFlows/payOS/getInformationOsSave";
import showHours from "./singleFlows/showHours";

export default createFlow([
    helloFlow,
    menuFlow,
    welcomeFlow,
    askDeleteTurn,
    cancelTurnWelcome,
    deleteTurnChoosen,
    DeleteTurnChoosenFromFirebase,
    askEditTurn,
    editTurnChoosen,
    editTurnChoosenFromFirebase,
    editTurnWelcome,
    giveQueryTypesSinglesEDIT,
    choosePay,
    isAgreeToPay,
    listPaymentMethods,
    payFlow,
    payFlowCome,
    chooseOsToPay,
    getInformationOS,
    getOsNameToSaveCOME,
    isAgreeToSaveOSpayment,
    listOsSpecialistWorks,
    messageConfirm,
    dataToTransferCome,
    confirmPresentialCome,
    saveTurnPresentialCome,
    confirmTransferSaveCome,
    choosePaymentMethod,
    daysAvailablesSingle,
    
    giveDaysWhenMedicWorkNextWeekSingle,
    giveDaysWhenMedicWorkSingle,
    giveQueryTypesSingle,
    isAgreeToPaySwitchMethod,
    reservationWithTransfer,
    saveTurnSingle,
    saveTurnToFirebase,
    seeKindOfPayments,
    chooseOsToPaySave,
    confirmTurnSaveOs,
    getInformationOsSave,
    getOsNameToSave,
    listOsSpecialistWorkSave,
    messageConfirmSave,
    messageConfirmPresentialSave,
    saveTurnPresentialSave,
    giveDataToPaywithTransfer,
    messageConfirmTransferSave,
    /* GET DATE OF BIRTH */
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    getName,
    getLastname,
    getDni,
    showHours
])