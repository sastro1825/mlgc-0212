const predictClassification = require("../services/InferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    console.log("Payload diterima:", image ? "Ada gambar" : "Tidak ada gambar");

    const { confidenceScore, label, suggestion } = await predictClassification(model, image);
    console.log("Hasil prediksi:", { confidenceScore, label, suggestion });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data,
      })
      .code(201);
  } catch (error) {
    console.error("Error dalam handler:", error.message);
    throw error;
  }
}

async function predictHistories(request, h) {
  const { Firestore } = require("@google-cloud/firestore");
  const db = new Firestore({
    projectId: "submissionmlgc-ridhofajar44",
  });

  const predictCollection = db.collection("predictions");
  const snapshot = await predictCollection.get();
  const result = [];
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      history: {
        result: doc.data().result,
        createdAt: doc.data().createdAt,
        suggestion: doc.data().suggestion,
        id: doc.data().id,
      },
    });
  });

  return h.response({
    status: "success",
    data: result,
  });
}

module.exports = { postPredictHandler, predictHistories };
