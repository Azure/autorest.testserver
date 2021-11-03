import { app, ValidationError } from "../api";

app.category("optional", () => {
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
  app.post("/formsdataurlencoded/pet/add/:petId", "UpdatePetWithForm", (request) => {
    const petId = request.params.petId;
    if (petId !== "1") {
      throw new ValidationError(`Expected petID 1 but got ${petId}`, undefined, request.params);
    }
    request.expect.containsHeader("content-type", "application/x-www-form-urlencoded");
    request.expect.bodyEquals({ pet_type: "dog", pet_food: "meat", name: "Fido", pet_age: "42" });
    return {
      status: 200,
    };
  });
  app.post("/formsdataurlencoded/partialConstantBody", "UrlEncodedDataWithPartialConstantBody", (request) => {
    request.expect.bodyEquals({ grant_type: "access_token", access_token: "foo", service: "bar" });
    return {
      status: 200,
    };
  });
});
