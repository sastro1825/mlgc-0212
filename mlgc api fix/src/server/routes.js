const { postPredictHandler, predictHistories } = require("./handler");
const Joi = require("joi");

const imageSchema = Joi.object({
  image: Joi.any()
    .meta({ swaggerType: "file" })
    .required()
    .description("File gambar untuk prediksi"),
});

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000 * 1000, // Maksimal ukuran payload (1 MB)
        allow: "multipart/form-data",
        multipart: true,
      },
      validate: {
        payload: imageSchema,
        failAction: (request, h, error) => {
          console.error("Validasi gagal:", error.message);
          throw new InputError("File gambar tidak valid");
        },
      },
    },
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: predictHistories,
  },
  {
    path: "/",
    method: "GET",
    handler: (request, h) => {
      return h.response({
        status: "success",
        message: "ML API is running",
      });
    },
  },
];

module.exports = routes;
