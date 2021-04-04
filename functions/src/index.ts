import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const toggleGarage = functions
    .region("europe-west3")
    .https.onRequest(async (_, response) => {
      const batch = db.batch();
      const collection = db.collection("garage-status");

      const docRef = db.collection("garage-status").doc("garage-status");

      try {
        const data = await docRef.get();

        if (data.exists) {
          const isOpen = data.data()?.isOpen;

          if (isOpen) {
            batch.set(collection.doc("garage-status"), {isOpen: false}, {});
            response.send("Garage door closing");
          } else {
            batch.set(collection.doc("garage-status"), {isOpen: true}, {});
            response.send("Garage door opening");
          }

          await batch.commit();
        }
      } catch (e) {
        response.send(e);
      }
    });

export const garageStatus = functions
    .region("europe-west3")
    .https.onRequest(async (_, response) => {
      const batch = db.batch();
      const collection = db.collection("garage-status");

      const docRef = db.collection("garage-status").doc("garage-status");

      try {
        const data = await docRef.get();

        if (data.exists) {
          const isOpen = data.data()?.isOpen;

          if (isOpen) {
            response.send("Garage door is open");
          } else {
            batch.set(collection.doc("garage-status"), {isOpen: true}, {});
            response.send("Garage door is closed");
          }
        }
      } catch (e) {
        response.send(e);
      }
    });
