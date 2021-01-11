# String

# Routes

## GET /string/null

### Response

```yaml
status: 200
body:
  content: null
```

## PUT /string/null

### Request

```yaml
body:
  content: null
```

### Response

```yaml
status: 200
```

## GET /string/empty

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '""'
```

## PUT /string/empty

### Request

```yaml
body:
  content: '""'
```

### Response

```yaml
status: 200
```

## GET /string/whitespace

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"    Now is the time for all good men to come to the aid of their country    "'
```

## PUT /string/whitespace

### Request

```yaml
body:
  content: '"    Now is the time for all good men to come to the aid of their country    "'
```

### Response

```yaml
status: 200
```

## GET /string/notProvided

### Response

```yaml
status: 200
```

## GET /string/base64UrlEncoding

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjR1cmw"'
```

## PUT /string/base64UrlEncoding

### Request

```yaml
body:
  content: '"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjR1cmw"'
```

### Response

```yaml
status: 200
```

## GET /string/base64Encoding

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjQ="'
```

## GET /string/nullBase64UrlEncoding

### Response

```yaml
status: 200
body:
  contentType: application/json
```

## GET /string/mbcs

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"\u554a\u9f44\u4e02\u72db\u72dc\uf9f1\uf92c\uf9f1\ufa0c\ufa29\u02ca\u301e\u3021\uffe4\u2121\u3231\u2010\u30fc\ufe61\ufe62\ufe6b\u3001\u3013\u2170\u2179\u2488\u20ac\u3220\u3229\u2160\u216b\uff01\uffe3\u3041\u3093\u30a1\u30f6\u0391\ufe34\u0410\u042f\u0430\u044f\u0101\u0261\u3105\u3129\u2500\u254b\ufe35\ufe44\ufe3b\ufe31\ufe33\ufe34\u2170\u2179\u0251\ue7c7\u0261\u3007\u303e\u2ffb\u2e81\ue843\u4723\ue864\u20ac"'
```

## PUT /string/mbcs

### Request

```yaml
body:
  content: '"\u554a\u9f44\u4e02\u72db\u72dc\uf9f1\uf92c\uf9f1\ufa0c\ufa29\u02ca\u301e\u3021\uffe4\u2121\u3231\u2010\u30fc\ufe61\ufe62\ufe6b\u3001\u3013\u2170\u2179\u2488\u20ac\u3220\u3229\u2160\u216b\uff01\uffe3\u3041\u3093\u30a1\u30f6\u0391\ufe34\u0410\u042f\u0430\u044f\u0101\u0261\u3105\u3129\u2500\u254b\ufe35\ufe44\ufe3b\ufe31\ufe33\ufe34\u2170\u2179\u0251\ue7c7\u0261\u3007\u303e\u2ffb\u2e81\ue843\u4723\ue864\u20ac"'
```

### Response

```yaml
status: 200
```

## GET /string/enum/notExpandable

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"red color"'
```

## PUT /string/enum/notExpandable

### Request

```yaml
body:
  contentType: application/json
  content: '"red color"'
```

### Response

```yaml
status: 200
```

## GET /string/enum/Referenced

### Response

```yaml
status: 200
body:
  contentType: application/json
  content: '"red color"'
```

## PUT /string/enum/Referenced

### Request

```yaml
body:
  contentType: application/json
  content: '"red color"'
```

### Response

```yaml
status: 200
```

## GET /string/enum/ReferencedConstant

### Response

```yaml
status: 200
```

#### Body

```json
{ "field1": "Sample String" }
```

## PUT /string/enum/ReferencedConstant

### Request

#### Body

```json
{"ColorConstant": "green-color"}
```

### Response

```yaml
status: 200
```
