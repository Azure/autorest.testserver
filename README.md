# Test server V2

## Requirements

- `Node.js`

**Recommended:**

- VSCode, with the following plugins
  - Prettier
  - ESLint
  - EditorConfig

## Getting started

```bash
# Install dependencies
npm install

# Start for dev: Will start the server and automatically restart in case there is changes in the files.
npm run start:dev

# Start for running: Will build and start the server
npm run start

# Format all the files(Required for CI). Use prettier vscode extension(or other editor prettier integration) for on save formatting.
npm run format
```

## Writing mock apis

See [docs](./docs/writing-mock-apis.md)
