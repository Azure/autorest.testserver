# Cadl files for testserver

The final plan is to have those files in a cadl.testserver package, this folder is temporary and may be removed in future versions.

Known issues:

- In dpg-update1.json, no model for JSON or JPEG
- In dpg-customization.json, no Paging
- In dpg-customization.json, no LRO

Beware that `OpenAPI.operationId` should NOT be used by CADL emitter of codegen. This line is in the CADL file waiting for https://github.com/microsoft/cadl/issues/689 to be fixed
