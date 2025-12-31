/**
 * JIP-6: Structured execution logs
 * TypeScript type definitions
 */

import {BytesBlob} from "@typeberry/lib/bytes";
import {codec, DescribedBy} from "@typeberry/lib/codec";
import {U32} from "@typeberry/lib/numbers";

export type Log = DescribedBy<typeof LogCodec>;
export type Trace = DescribedBy<typeof TraceCodec>;
export type Chunk = DescribedBy<typeof Chunk>;

export enum MemoryDataKind {
  Length, Data,
}

export type MemoryData = {
  kind: MemoryDataKind.Data;
  value: BytesBlob;
} | {
  kind: MemoryDataKind.Length;
  value: U32;
};

export const MemoryDataCodec = codec.union<MemoryDataKind, MemoryData>(
  "MemoryData",
  {
    [MemoryDataKind.Length]: codec.object({
      value: codec.u32,
    }),
    [MemoryDataKind.Data]: codec.object({
      value: codec.blob,
    })
  }
);

/** Memory read or write chunk */
export const Chunk = codec.object({
  // 0 - read, 1 - write
  access: codec.varU32,
  address: codec.varU32,
  data: MemoryDataCodec,
});

export const LogCodec = codec.object({
  pc: codec.varU32,
  gas: codec.optional(codec.varU64),
  registers: codec.sequenceFixLen(codec.varU64, 13),
  memory: codec.sequenceVarLen(Chunk),
});

/** Top-level trace collection */
export const TraceCodec = codec.object({
  // 0 - full, 1 - ecalli
  format: codec.varU32,
  codehash: codec.optional(codec.bytes(32)),
  initial: codec.optional(LogCodec),
  entries: codec.sequenceVarLen(LogCodec),
  // 0 - panic, 1 - halt
  status: codec.varU32,
  implementation: codec.string,
});
