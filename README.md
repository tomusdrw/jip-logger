# JIP-6 Logger

A TypeScript implementation of the JIP-proposed structured execution logs format for JAM  PVM execution traces.

## Overview

This tool parses and displays binary trace files following the JIP specification proposal.

## Installation

```bash
npm install
```

## Usage

Run the tool with one or more binary trace files:

```bash
npm start -- <logfile.bin> [<logfile2.bin> ...]
```

## Output Format

The tool displays:

- **Implementation**: Name of the JAM implementation that produced the trace
- **Format**: Trace format type (0 = full, 1 = ecalli)
- **Codehash**: Hash of the executed code (if available)
- **Final status**: Execution result (PANIC or HALT)
- **Initial state**: PVM state before first instruction (if available)
- **Trace entries**: Per-entry state showing:
  - Program counter (pc)
  - Gas remaining
  - Register values (only non-zero registers shown as hex)
  - Memory operations (R for read, W for write)

### Example Output

```
Implementation: jam-reference-impl
Format: 0
Codehash: 0x1234...
Final status: HALT
Initial: [0] gas=1000000, regs=r1=a|r2=b
[4] gas=999950, regs=r0=1a|r1=a|r2=b W @ 100 -> 0x0a0b
[8] gas=999900, regs=r0=1a|r1=a|r2=b R @ 100 -> len: 2
```

## License

MPL-2.0

## Author

Fluffy Labs <hello@fluffylabs.dev>
