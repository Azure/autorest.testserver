# Test server V2

## Requirements

- `Node.js`

**Recommended:**

- VSCode, with the following plugins
  - Prettier
  - ESLint
  - EditorConfig

## Usage

```bash
# Start testserver
autorest-testserver run

# Start testserver at given port
autorest-testserver run --port=<port>

# Start testserver without reseting the coverage. This can be used when you are running the test server multiple times to get the full coverage.
autorest-testserver run --appendCoverage

# Stop testserver
autorest-testserver stop

# Stop testserver running at the given port
autorest-testserver stop --port=<port>

# Sepecify the coverage directory
autorest-testserver run --coverageDirectory=<path>
```

### Coverage upload

Upload the coverage produce by the autorest testserver.

```bash
autorest-testserver-coverage publish \
  --coverageDirectory=<path> \
  --repo=<repo> \
  --ref=<path> \
  --githubToken=<ghToken> \
  --azStorageAccount=<account> \
  --azStorageAccessKey=<azStorageKey>

```

### Clear coverage folder

Clear the coverage folder. `--coverageDirectory` is optional. It defaults to `./coverage`

```bash
autorest-testserver-coverage clear [--coverageDirectory=<path>]
```

## Developping

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
