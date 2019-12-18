#!/usr/bin/env node
const { existsSync } = require('fs');
const { resolve } = require('path');
const { execute, queryUser, httpPost } = require('./process');
const { yellow, red, green, white, gray, cyan} = require('chalk');

function prepend( color,pText ,text) {
  return text.replace( /^/gm, `${color(pText)} `)
}

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

  let serverProc = undefined;
  let cmdProc = undefined;
  let spResolve = undefined;
  let spReject = undefined;
  let running = false;

  const interactive = switches.indexOf('--interactive') > -1;
  const showMessages = switches.indexOf('--show-messages') > -1;
  const verbose = switches.indexOf('--verbose') > -1 ? (text) => console.log(prepend( cyan.bold, '[TestServer]', text)) : () => { };

  let isReady = new Promise((r, j) => {
    spResolve = r;
    spReject = j;
  })

  try {
    await httpPost({ port: 3000, host: 'localhost', method: 'POST', path: '/__admin/shutdown' });
    verbose('Shutting down existing WireMock instance.')
  } catch (e) {
    verbose('WireMock was not running previously.')
    // who cares.
  }
  // start the wiremock process
  verbose('Starting WireMock.')
  const spResult = execute(process.execPath, [`${wmFolderPath}/node_modules/wiremock/jdeploy-bundle/jdeploy.js`, '--root-dir', resolve(`${__dirname}/..`), '--port', '3000', '--verbose'], {
    onCreate: (proc) => {
      serverProc = proc;
      proc.on('close', ()=>{
        if( cmdProc && cmdProc.status === null ) {
          cmdProc.kill();
        }
        if( interactive ) {
          process.exit(0);
        }
      })
    },
    onStdOutData: (chunk) => {
      const c = chunk.toString().replace(/\s*$/, '');
      if (showMessages) {
        console.log(prepend( gray, '[WireMock]', c));
      }
      if (/verbose:.*true/.exec(c)) {
        spResolve();
      }
    },
    onStdErrData: (chunk) => {
      const c = chunk.toString().replace(/\s*$/, '');
      if (showMessages) {
        console.log(prepend( yellow.dim, '[WireMock]', c ));
      }
    }
  });

  // when it's ready, run the command line
  await isReady;
  verbose('WireMock is ready.')

  if (!interactive) {
    await execute(command, cmdArgs, {
      onCreate: (process) => {
        verbose(`Started command: '${command} ${cmdArgs.join(' ')}'`);
        cmdProc = process;
        running = true;
      },
      onStdOutData: (chunk) => {
        const c = chunk.toString().replace(/\s*$/, '');
        console.log(c);
      },
      onStdErrData: (chunk) => {
        const c = chunk.toString().replace(/\s*$/, '');
        console.error(c);
      }
    });
    running = false;
    verbose('Command completed.');
  } else {
    await queryUser('\n\nPress enter to stop testserver\n');
  }
  cmdProc = undefined;

  // after the cmdline is done.
  // shutdown server process
  verbose('Shutting down WireMock.');
  await httpPost({ port: 3000, host: 'localhost', method: 'POST', path: '/__admin/shutdown' });

  // wait for it to close
  verbose('Waiting for WireMock to finish.');

  // force-kill server process
  if (serverProc && serverProc.status === null) {
    verbose('killing WireMock');
    serverProc.kill();
  }

  await spResult;
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
