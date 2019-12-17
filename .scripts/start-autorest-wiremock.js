#!/usr/bin/env node
const { existsSync } = require('fs');
const { resolve } = require('path');
const { execute, queryUser, httpPost } = require('./process');

// syntax:
// > start-autorest-testserver <command-line...>


// start 
//  (a) the wiremock server, (and wait for it to be ready)
//  (b) run the given command line.
// when the (b) completes, terminate (a)

function getEntrypoint() {
  var folder = __dirname;
  while (!existsSync(`${folder}/node_modules/wiremock/jdeploy-bundle/jdeploy.js`)) {
    folder = resolve(`${folder}/..`);
    if (folder === '/' || folder.endsWith('\\')) {
      throw new Error('Unable to start test-server.')
    }
  }
  return folder;
}

async function main() {
  const wmFolderPath = getEntrypoint();

  const cmdArgs = [];
  const switches = [];
  let switchChecking = true;

  for (const each of process.argv.slice(2)) {
    if (switchChecking && each.startsWith('--')) {
      switches.push(each);
      continue;
    }
    switchChecking = false;
    cmdArgs.push(each);
  }
  const command = cmdArgs.shift()

  let wmProc = undefined;
  let wmResolve = undefined;
  let wmReject = undefined;
  let running = false;

  const interactive = switches.indexOf('--interactive') > -1;
  const showWM = switches.indexOf('--show-messages') > -1;
  const verbose = switches.indexOf('--verbose') > -1 ? console.log : () => { };

  let wmReady = new Promise((r, j) => {
    wmResolve = r;
    wmReject = j;
  })

  try {
    // shutdown wiremock if its still running
    await httpPost({ port: 3000, host: 'localhost', method: 'POST', path: '/__admin/shutdown' });
    verbose('Shutting down existing WireMock instance.')
  } catch (e) {
    verbose('WireMock was not running previously.')
    // who cares.
  }
  // start the wiremock process
  verbose('Starting WireMock.')
  const wmResult = execute(process.execPath, [`${wmFolderPath}/node_modules/wiremock/jdeploy-bundle/jdeploy.js`, '--root-dir', resolve(`${__dirname}/..`), '--port', '3000', '--verbose'], {
    onCreate: (process) => {
      wmProc = process;
    },
    onStdOutData: (chunk) => {
      const c = chunk.toString();
      if (showWM) {
        console.log(c);
      }
      if (/verbose:.*true/.exec(c)) {
        wmResolve();
      }
    },
    onStdErrData: (chunk) => {
      if (showWM) {
        console.log(chunk.toString());
      }
    }
  });

  // when it's ready, run the command line
  await wmReady;
  verbose('WireMock is ready.')

  if (!interactive) {
    await execute(command, cmdArgs, {
      onCreate: (process) => {
        verbose(`Started command: ${command} ${cmdArgs}`);
        running = true;
      },
      onStdOutData: (chunk) => {
        console.log(chunk.toString());
      },
      onStdErrData: (chunk) => {
        console.error(chunk.toString());
      }
    });
    running = false;
    verbose('Command completed.');
  } else {
    await queryUser('\n\nPress enter to stop testserver\n');
  }


  // after the cmdline is done.
  // shutdown wiremock
  verbose('Shutting down WireMock.');
  await httpPost({ port: 3000, host: 'localhost', method: 'POST', path: '/__admin/shutdown' });

  // wait for it to close
  verbose('Waiting for WireMock to finish.');

  // force-kill wiremock
  if (wmProc.status === null) {
    verbose('killing WireMock');
    wmProc.kill();
  }

  await wmResult;
  verbose('Exiting.');
}
async function start() {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();
