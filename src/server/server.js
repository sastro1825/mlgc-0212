const Hapi = require("@hapi/hapi");
const Inert = require('@hapi/inert');
const routes = require("./routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST || "0.0.0.0",
  });

  // Load model
  const model = await loadModel().catch((err) => {
    console.error("Gagal memuat model:", err.message);
    throw new Error("Model gagal di-load");
  });
  server.app.model = model;

  // Register routes
  server.route(routes);

  // Middleware to handle 413 Payload Too Large
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      if (response.output.statusCode === 413) {
        return h
          .response({
            status: "fail",
            message: "Payload content length greater than maximum allowed: 1000000",
          })
          .code(413);
      }
      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message: response.message,
          })
          .code(400);
      }
    }
    return h.continue;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
