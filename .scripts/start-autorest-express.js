#!/usr/bin/env node
const { existsSync } = require('fs');
const { resolve } = require('path');
const { execute, queryUser, httpPost } = require('./process');

// syntax:
// > start-autorest-testserver <command-line...>


// start 
//  (a) the express server, (and wait for it to be ready)
//  (b) run the given command line.
// when the (b) completes, terminate (a)

async function main() {

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

  let exProc = undefined;
  let exResolve = undefined;
  let exReject = undefined;
  let running = false;

  const interactive = switches.indexOf('--interactive') > -1;
  const showEx = switches.indexOf('--show-express') > -1;
  const verbose = switches.indexOf('--verbose') > -1 ? console.log : () => { };

  let exReady = new Promise((r, j) => {
    exResolve = r;
    exReject = j;
  })

  try {
    await execute(process.execPath, [`${__dirname}/../legacy/startup/shutdown.js`]);
    verbose('Shutting down existing Express instance.') 
  } catch (e) {
    verbose('Express was not running previously.')
    // who cares.
  }

  // start the express process
  verbose('Starting Express Server.')
  const exResult = execute(process.execPath, [`${__dirname}/../legacy/startup/www.js`], {
    onCreate: (process) => {
      exProc = process;
    },
    onStdOutData: (chunk) => {
      const c = chunk.toString();
      if (showEx) {
        console.log(c);
      }
      if (/Server started/.exec(c)) {
        exResolve();
      }
    },
    onStdErrData: (chunk) => {
      if (showEx) {
        console.log(chunk.toString());
      }
    }
  });

  // when it's ready, run the command line
  await exReady;
  verbose('Express is ready.')

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
  // shutdown express
  verbose('Shutting down Express.');
  try {
    await execute(process.execPath, [`${__dirname}/../legacy/startup/shutdown.js`]);
    verbose('Shutting down existing Express instance.')
  } catch (e) {
    // who cares.
  }

  // wait for it to close
  verbose('Waiting for Express to finish.');

  // force-kill express
  if (exProc.status === null) {
    verbose('killing express');
    exProc.kill();
  }

  await exResult;
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
