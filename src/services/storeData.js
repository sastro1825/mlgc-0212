const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

async function storeData(id, data) {
  try {
    const db = new Firestore({
      projectId: "submissionmlgc-ridhofajar44",
      keyFilename: path.resolve(__dirname, "../submissionmlgc-ridhofajar44-4e33db8145e8.json"),
    });

    const predictCollection = db.collection("predictions");
    await predictCollection.doc(id).set(data);
    console.log(`Data with ID ${id} successfully stored.`);
  } catch (error) {
    console.error("Error storing data:", error.message);
    throw new Error("Gagal menyimpan data ke Firestore.");
  }
}

module.exports = storeData;
