# Cadl files for testserver

Known issues:

- In dpg-update1.json, no model for JSON or JPEG
- In dpg-customization.json, no Paging
- In dpg-customization.json, no LRO

Beware that `OpenAPI.operationId` should NOT be used by CADL emitter of codegen. This line is in the CADL file waiting for https://github.com/microsoft/cadl/issues/689 to be fixed
