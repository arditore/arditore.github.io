---
title: NootExtract
summary: Android forensic acquisition and evidence preparation in Rust. Authorized methods only, streaming SHA-256, versioned JSON manifests, and evidence guarantees the test suite actually checks.
status: wip
repo: https://github.com/arditore/NootExtract
tech: [Rust, ADB, SHA-256, libewf, Autopsy]
topics: [digital-forensics, dfir, mobile-forensics, android, chain-of-custody, incident-response, cli]
featured: true
order: 1
updated: 2026-09-18
---

NootExtract pulls evidence off an Android device over channels the device already grants,
records exactly what it did in a versioned JSON manifest, and prepares the result for
analysis tools such as Autopsy.

It is written in Rust, contains no `unsafe`, and streams everything. A 256 GB image costs
the same memory as a 4 KB one.

## What it refuses to do

The scope section comes before the feature list, because the restraint is the design.

NootExtract uses only access that has already been authorized: USB debugging accepted for
this host's ADB key, and — for physical acquisition — an ADB shell that is already
privileged. It does not attempt to defeat PINs, passwords, biometrics, lock screens, file-
or metadata-based encryption, verified boot, OEM protections or enterprise controls. It
contains no exploit and no privilege-escalation code.

Where an authorized method cannot reach the data, the tool reports the limitation and
stops.

That last sentence is the whole posture. A forensic tool that quietly does less than it
claims is worse than one that refuses loudly, because the gap ends up in a report that
someone relies on. Physical acquisition on an ordinary retail device is unavailable — that
is a property of Android's security model, not a missing feature — so the tool exits with
code 9 and says so.

## Guarantees the code enforces

These are not promises in a README. They are properties the implementation holds and the
test suite checks:

- Files under `original/` are never modified, never overwritten, never deleted.
- Every evidence file is created with `create_new`, so an existing file causes a failure
  rather than a silent replacement.
- Bulk data is written to a `.partial` file and renamed into place only after the transfer
  completes cleanly. **A file under its final name is always a completed transfer.**
- Every artifact is hashed with SHA-256 as it is written, then re-read from disk to confirm
  the digest.
- An acquisition that does not complete exits non-zero and records its partial output as
  incomplete. It never reports success.
- Conversions and copies produce new artifacts under `derived/` or `working/`; the source
  is opened read-only.

The `.partial` rename is the one I would point at. It turns "did this transfer finish?"
from a question you have to investigate into a property of the filename. There is no state
where a truncated image sits under a name that suggests it is whole.

These are engineering guarantees about the program's behaviour. They are not a claim about
the legal or evidentiary sufficiency of any acquisition, which depends on authorization,
procedure and jurisdiction.

## The case directory

```
CASE-001/
    original/    acquired evidence — never modified, overwritten or deleted
    derived/     conversions produced from originals
    working/     verified copies and extracted files, for analysis tools
    manifests/   one immutable manifest per operation
    hashes/      sha256sum-compatible hash lists
    logs/        structured JSON Lines logs
```

Manifests are append-only. A conversion writes a *new* manifest referencing its source, so
the record of the original acquisition is never rewritten. One case directory holds several
evidence items.

The hash side files are coreutils-compatible, which matters more than it sounds. You can
verify a case without trusting this tool at all:

```bash
cd ./evidence/CASE-001 && sha256sum -c hashes/EVIDENCE-001-*.sha256
```

## Hashing and verification

SHA-256 is always computed; `--sha512` adds SHA-512. Hashing streams over a 1 MiB buffer,
so memory use is constant regardless of image size, and the digest recorded at acquisition
comes from the same code path that later verifies it.

`verify` reports four outcomes per file — `MATCH`, `MISMATCH`, `MISSING`, `EXTRA` — and
exits 5 if anything mismatches, is missing, or is unaccounted for. Exit codes are a stable
contract, documented rather than incidental.

## Acquisition methods

| Method | Kind | Output | Requires |
|---|---|---|---|
| `adb-logical-tar` (default) | logical | tar | Authorized ADB, device unlocked, `tar` on the device |
| `adb-physical-dd` | physical | raw | Authorized ADB, a shell already running as UID 0, explicit `--source` |

The device must stay unlocked during a logical acquisition: on a device with file-based
encryption, locked-profile directories are simply unreadable. The tool says so rather than
producing a quietly incomplete archive.

## What has not been verified

The automated suite runs without a physical device. Device behaviour comes from a scripted
ADB stand-in that exercises the real command paths, which is not evidence that any
particular handset or Android version behaves as modelled.

CI runs the suite plus a full end-to-end check on Linux, macOS and Windows, and compiles
the crate on the declared minimum Rust version. All jobs pass.

**No physical Android device, and no Autopsy import, was used in developing this version.**
`docs/TESTING.md` states precisely what was and was not exercised, and
`docs/INTEROPERABILITY.md` separates import procedures that have been tested from those
that have not.

Publishing that distinction is the point. A forensics tool that overstates its testing is
producing evidence about itself that would not survive the standard it asks of everything
else.

## Status

Ten documents cover the architecture, manifest schema 1.0, exit-code contract, threat
model, image formats, interoperability, limitations, test strategy, why resumable
acquisition is deliberately not implemented, and development setup.

Requires a stable Rust toolchain (1.88 or newer; developed against 1.96.0) and the Android
SDK platform-tools. MIT licensed. No release tagged yet.
