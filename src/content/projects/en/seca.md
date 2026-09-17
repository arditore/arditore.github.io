---
title: Seca
status: wip
summary: Three communication apps for Android — contacts, calls and messages — with one Material 3 Expressive design, no Google dependency, and end-to-end encrypted messaging between Seca phones.
repo: https://github.com/arditore/Seca
tech: [Kotlin, Jetpack Compose, Material 3 Expressive, libsignal, Nostr]
topics: [android, privacy, degoogled, end-to-end-encryption, grapheneos, fdroid, sms, dialer]
featured: true
order: 2
updated: 2026-09-16
---

Three apps you open every day — the address book, the dialer, the messages — usually
come from three different places and answer to a company that is not you. Seca replaces
all three with one coherent set, built on the assumption that a phone should keep what it
handles.

The apps run on any phone with Android 12 or newer and are at their best on GrapheneOS.
They speak English and French, following the phone's language.

## The three apps

**Seca Contacts** is the address book, stored in Android's own contacts. Coloured profiles
— Family, Work — are shared with the other two apps. Favourites, search, duplicate merging,
your own card shared by QR code, vCard import and export that preserves each contact's
profile, encrypted backup.

**Seca Phone** handles calls. The call screen shows the caller's profile. T9 search,
telemarketing blocking on the number ranges reserved for it in France, unknown callers
silenced, profiles blocked for a chosen time, a remembered SIM per contact, declining a
call with a message, named audio and Bluetooth outputs.

**Seca Messages** handles texts. Conversations take the colours of the contact's profile.
Scheduled messages, verification codes erased after a delay, advertising texts filed away,
encrypted backup.

Neither Contacts nor Phone holds the `INTERNET` permission. They cannot send anything
anywhere, and that is enforced by the system rather than promised in a privacy policy.

## Seca Link

Between two Seca phones, messaging becomes end-to-end encrypted — with no account and no
Seca server anywhere in the path.

The encryption is Signal's: **libsignal**, with the post-quantum **PQXDH** key agreement.
Encrypted messages travel through public **Nostr** relays, each envelope signed by a
throwaway key. A relay sees who receives, when, and roughly how much. It never sees who
writes, nor what is written.

Two phones that both have Seca Link connect on their own, through a data SMS that a phone
without Seca never displays, sent when a conversation opens. The conversation then says so
and turns encrypted. Scanning each other's code in person works too.

Read receipts, typing indicators, reactions, quoted replies, encrypted photos and voice
messages, disappearing messages, and a safety number to compare. A Tor option through
Orbot keeps the phone's address from the relays.

Seca Link is **off by default**. Without it, Seca Messages does not use the Internet at all.

The interesting part is what happens when it stops. A contact who turns Seca Link off tells
your phone at once: the conversation says so, the lock disappears, and what you write leaves
as an ordinary SMS. A contact who removes Seca entirely says nothing — nothing runs there
any more — so their keys stop being refreshed and expire within a day, which ends the
conversation the same way. Both paths are designed; neither leaves the other side guessing.

## Proving the absence of Google

Claiming no Google dependency is easy. Seca checks it at build time: a
`verifyReleaseNoProprietaryDependencies` task, wired into `check`, fails the build if any
`com.google.android.gms`, `com.google.firebase` or `com.google.android.play` artefact
reaches the runtime.

No analytics, no crash reporting, no trackers. Seca Contacts' profiles can only be read by
apps signed with the same key.

## What it deliberately does not do

**No RCS** — Google keeps its RCS API to a closed list of apps. **No Wi-Fi calling as such**
— VoWiFi belongs to the system's IMS stack and works whatever the dialer; Seca Phone only
shows its state.

## Status

Seca is in beta. Until it reaches F-Droid, releases are published on GitHub Releases, signed
with a certificate whose fingerprint is published in the repository.
