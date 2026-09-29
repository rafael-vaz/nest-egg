import {initializeApp} from "firebase-admin/app";

initializeApp();

export * from "./triggers/transactions";
export * from "./triggers/cron";
