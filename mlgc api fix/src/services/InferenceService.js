const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    if (!image) throw new InputError("Gambar tidak ditemukan dalam payload");

    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    if (isNaN(confidenceScore)) throw new InputError("Hasil prediksi tidak valid");

    const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";
    const suggestion = label === "Cancer" ? "Segera periksa ke dokter!" : "Penyakit kanker tidak terdeteksi.";

    return { confidenceScore, label, suggestion };
  } catch (error) {
    console.error("Error dalam prediksi:", error.message);
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predictClassification;
