# Writing mock apis

1. First step is to create a new file typescript file in the [src/test-routes](../src/test-routes) folder:
1. All the needed imports are from the `api` folder
1. Define the category for your apis using `app.category("vanilla" | "azure" | "optional", () => {})`
1. Start writing mock apis inside the `category` callback

## Example

```ts
import { app, json } from "../../api";

app.category("vanilla", () => {
  app.get("/test", "GetMyTest", (req) => {
    return {
      status: 200,
      body: json({
        foo: "succeeded",
        bar: "wut",
      }),
    };
  });

  app.post("/test", "PostMyTest", (req) => {
    req.expect.bodyEquals({ foo: "123", bar: "456" });
    return {
      status: 200,
      body: json({
        succeeded: true,
      }),
    };
  });
});
```

## How to build response

Return the reponse object. [See type](../src/api/mock-response.ts)

```ts
// Minimum requirement is the status code.
return {
  status: 200,
};
```

### Return a body

```ts
// Return json
return {
  status: 200,
  body: json({ foo: 123 }),
};

// Return raw content
return {
  status: 200,
  body: {
    contentType: "application/text",
    rawContent: "foobar",
  },
};
```

### Return headers

```ts
// Return json
return {
  status: 200,
  headers: {
      MyHeader: "value-1"
      MyHeaderOther: req.headers.MyRequestHeader
  }
};

```

## How to validate the request:

All built-in validation tools can be accessed using `req.expect.`

### Validate the body

- With `req.expect.bodyEquals`

This will do a deep equals of the body to make sure it match.

```ts
app.post("/example", "Example", (req) => {
  req.bodyEquals({ foo: "123", bar: "456" });
});
```

- With `req.expect.rawBodyEquals`

This will compare the raw body sent.

```ts
app.post("/example", "Example", (req) => {
  req.rawBodyEquals('"foo"');
});
```

### Custom validation

You can do any kind of validation accessing the `req: MockRequest` object and deciding to return a different response in some cases.
You can also always `throw` a `ValidationError`

Example:

```ts
app.post("/example", "Example", (req) => {
  if (req.headers.MyCustomHeader.startsWith("x-foo")) {
    throw new ValidationError("MyCustomHeader shouldn't start with x-foo", null, req.headers.MyCustomHeader);
  }
});
```
