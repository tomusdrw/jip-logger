import { readFileSync } from 'node:fs';
import {codec} from '@typeberry/lib';
import minimist from 'minimist';
import { TraceCodec } from './types.js';
import {printTrace} from './print.js';


const args = minimist(process.argv.slice(2));
if (args._.length === 0) {
  console.error('Usage: <logfile.bin>');
  process.exit(1);
}

for (const file of args._) {
  console.log(`Reading ${file}`);
  const f = readFileSync(file);
  const trace = codec.Decoder.decodeObject(TraceCodec, f);
  printTrace(trace);
}

