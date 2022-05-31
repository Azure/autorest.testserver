import { app, json, ValidationError } from "../api";

app.category("azure", () => {
  app.post("/parameterGrouping/postReservedWords", "PostParameterGroupingWithReservedWords", (req) => {
    if (req.query["from"] !== "bob") {
      throw new ValidationError("Wrong query value for 'from'", "bob", req.query["from"]);
    }
    if (req.query["accept"] !== "yes") {
      throw new ValidationError("Wrong query value for 'accept'", "yes", req.query["accept"]);
    }
    return {
      status: 200,
    };
  });
  app.put("/parameterGrouping/groupWithConstant", "PutParameterGroupingConstant", (req) => {
    req.expect.containsHeader("groupedconstant", "foo");
    req.expect.containsHeader("groupedparameter", "bar");
    return {
      status: 200,
    };
  });
});
