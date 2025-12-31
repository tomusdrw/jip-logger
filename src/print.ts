import {Log, MemoryDataKind, Trace} from "./types.js";

export function printTrace(trace: Trace) {
  console.info(`Implementation: ${trace.implementation}`);
  console.info(`Format: ${trace.format}`);
  console.info(`Codehash: ${trace.codehash}`);
  console.info(`Final status: ${trace.status === 0 ? 'PANIC' : 'HALT'}`);
  console.info(`Initial: ${logToString(trace.initial)}`);

  for (const entry of trace.entries) {
    console.info(logToString(entry));
  }
}

function logToString(log: Log | null) {
  if (log === null) {
    return '';
  }

  const memory = () => {
    return log.memory.map(x => {
      const chunk = x.data.kind === MemoryDataKind.Length ? `len: ${x.data.value}` : x.data.value.toString();
      return `${x.access === 0 ? 'R' : 'W'} @ ${x.address.toString(16)} -> ${chunk}`;
    }).join(', ');
  };

  const registers = () => {
    return log.registers.map((v, i) => {
      return v !== 0n ? `r${i}=${v.toString(16)}` : '';
    }).join('|');
  };
  
  return `[${log.pc}] gas=${log.gas}, regs=${registers()} ${memory()}`;

}
