import Busboy from "busboy";
import { app, ValidationError } from "../api";

app.category("vanilla", () => {
  app.put("/formdata/stream/uploadfile", "StreamUploadFile", (request) => {
    if (!(request.body instanceof Buffer)) {
      throw new ValidationError(`Expected binary body but got  ${typeof request.body}`, undefined, request.body);
    }
    return {
      status: 200,
      body: {
        contentType: "application/text",
        rawContent: request.body.toString(),
      },
    };
  });
});
