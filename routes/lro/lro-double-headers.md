# Long running operations: Post Double Headers

# Routes

## POST /lro/LROPostDoubleHeadersFinalLocationGet

### Response

```yaml
status: 202
headers:
  Azure-AsyncOperation: "{{request.baseUrl}}/lro/LROPostDoubleHeadersFinalLocationGet/asyncOperationUrl"
  Location: "{{request.baseUrl}}/lro/LROPostDoubleHeadersFinalLocationGet/location"
```

## GET /lro/LROPostDoubleHeadersFinalLocationGet/asyncOperationUrl

### Response

```yaml
status: 200
```

### Body

```json
{
  "status": "succeeded"
}
```

## GET /lro/LROPostDoubleHeadersFinalLocationGet/location

### Response

```yaml
status: 200
```

### Body

```json
{
  "id": "100",
  "name": "foo"
}
```
