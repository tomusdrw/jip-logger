/**
 * JIP-6: Structured execution logs
 * TypeScript type definitions
 */

import {bytes, codec as codecPkg, numbers, utils} from "@typeberry/lib";
// TODO [ToDr] Fix ES build
const codec = codecPkg.codec;

/** Memory data - either length or actual content */
export type MemoryData =
  | { type: 'length'; value: numbers.U32 }
  | { type: 'data'; value: bytes.BytesBlob };

export type Log = {
  pc: numbers.U32,
  gas: numbers.U64 | null,
  registers: numbers.U64[],
  memory: { access: numbers.U32, address: numbers.U32, data: MemoryData }[],
};

export type Trace = {
  format: numbers.U32,
  codehash: bytes.Bytes<32> | null,
  initial: Log | null,
  entries: Log[],
  status: numbers.U32,
  implementation: string,
}

// TODO [ToDr] introduce union codec
export const MemoryDataCodec = codec.custom<MemoryData>({
  name: 'MemoryData',
  sizeHint: {
    bytes: 2,
    isExact: false
  }
}, (e, x) => {
  if (x.type === 'length') {
    e.varU32(numbers.tryAsU32(0));
    e.varU32(numbers.tryAsU32(x.value));
    return;
  }

  if (x.type === 'data') {
    e.varU32(numbers.tryAsU32(1));
    e.bytesBlob(x.value)
    return;
  }

  utils.assertNever(x);
}, (d) => {
  const type = d.varU32();
  if (type === 0) {
    const value = d.varU32();
    return { type: 'length', value };
  }

  if (type === 1) {
    const value = d.bytesBlob();
    return { type: 'data', value };
  }

  throw new Error(`Unknown type: ${type} for MemoryData`);
}, (s) => {
  const type = s.decoder.varU32();
  if (type === 0) {
    return s.varU32();
  }

  if (type === 1) {
    return s.bytesBlob();
  }

  throw new Error(`Unknown type: ${type} for MemoryData`);
});

/** Memory read or write chunk */
export const Chunk = codec.object({
  // 0 - read, 1 - write
  access: codec.varU32,
  address: codec.varU32,
  data: MemoryDataCodec,
});

export const LogCodec = codec.object<Log>({
  pc: codec.varU32,
  gas: codec.optional(codec.varU64),
  registers: codec.sequenceFixLen(codec.varU64, 13),
  memory: codec.sequenceVarLen(Chunk),
});
// export type Log = codecPkg.DescribedBy<typeof Log>;

/** Top-level trace collection */
export const TraceCodec = codec.object<Trace>({
  // 0 - full, 1 - ecalli
  format: codec.varU32,
  codehash: codec.optional(codec.bytes(32)),
  initial: codec.optional(LogCodec),
  entries: codec.sequenceVarLen(LogCodec),
  // 0 - panic, 1 - halt
  status: codec.varU32,
  implementation: codec.string,
});
// export type Trace = codecPkg.DescribedBy<typeof Trace>;
