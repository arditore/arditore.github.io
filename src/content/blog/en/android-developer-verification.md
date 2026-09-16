---
title: 'Android is closing, and F-Droid is the wrong shape to survive it'
description: From 30 September, apps on certified Android devices must trace back to a developer who showed Google a government ID. F-Droid does not have developers in that sense — it has source code and a signing key. That mismatch is not a bug in the policy. It is the policy.
pubDate: 2026-09-16
tags: [android, f-droid, sideloading, privacy, policy]
---

On 30 September, Google begins enforcing developer verification in Brazil, Indonesia,
Singapore and Thailand. From that date, an app installed on a certified Android device in
those countries — from the Play Store, from a third-party store, from a browser download,
from anywhere — must be tied to a developer who has verified their identity with Google.
Global enforcement follows in 2027.

"Certified Android device" is doing a great deal of work in that sentence. It means a
device shipping Google's services under licence, which is over 95% of Android outside
China. For practical purposes: phones.

I want to be precise about what this is and is not, because the discussion has collapsed
into two unhelpful camps — one insisting sideloading is being banned, the other insisting
nothing is changing because ADB still works. Neither is right, and the interesting part is
in between.

## What actually changes

Sideloading is not blocked. Installing an app whose developer has not verified is.

The distinction matters because it relocates the gate. Android has always asked you to
confirm before installing from outside the store — a dialog, a permission, a warning. That
gate was in front of *you*, and you could walk through it. The new gate is in front of
*the developer*, it is upstream of you, and no amount of consent on your part opens it.

To pass that gate a developer must create an account in the Android Developer Console,
pay, hand over a government identity document, and register each application individually
against a package name and a signing key. F-Droid's own summary of the terms attached —
"voluminous, non-negotiable, and ever-changing" — is polemical but not inaccurate.

Google's security argument is real and should not be waved away. Sideloaded malware is a
genuine problem, particularly financial-fraud APKs pushed through messaging apps, and
particularly in the four countries chosen for the first phase. Those countries were not
picked at random. Attribution raises the cost of running that operation, and it will work
to some degree.

The question is not whether it works. It is what else it does.

## Why F-Droid breaks specifically

Most coverage treats F-Droid as one more app store that will need to fill in some
paperwork. It is not, and the difference is the whole story.

When you install an app from Google Play, you receive a binary the developer built and
signed. Play is a distribution channel; trust flows from the developer's key.

F-Droid does something else. It takes publicly available source code, reviews it for
licence compliance and for anti-features, **builds it itself**, and signs the resulting
binary with **F-Droid's own key**. Reproducible builds let anyone check that the published
binary matches the published source.

That model deliberately removes the developer from the trust path. You are not trusting
that the author's build machine was clean or that their signing key was not stolen. You
are trusting source you can read and a build you can reproduce. For a threat model where
the developer themselves might be compromised, coerced or simply careless, that is
strictly stronger than identity verification — it is the difference between "we know who
made this" and "you can verify what this is."

Now apply the new requirement to it. Whose identity verifies an F-Droid build? The binary
is signed by F-Droid, not by the upstream author. The upstream author may not know F-Droid
packages their app; that is allowed and common, because the licence permits it. Many
upstream authors are pseudonymous, which is not a red flag in this ecosystem but a normal
and frequently necessary condition of contributing to privacy tooling.

There is no clean answer. F-Droid verifying itself as the developer of several thousand
applications it did not write is a fiction. Requiring every upstream author to
individually register with Google — pay, show ID, accept terms — in order to remain in a
repository they may never have opted into is not a fix; it is the end of the catalogue. An
F-Droid board member's assessment, that this "will mean the end of the F-Droid project and
other free and open-source distribution sources," is not hyperbole. It follows from the
structure.

The verification framework does not recognise transparency-through-source as equivalent to
identity. It cannot, because it was designed around a model where one legal person stands
behind one binary. F-Droid's entire value is that no one has to.

## The advanced flow is an answer to a different question

Google's concession for power users is an "advanced flow": enable developer mode, restart,
wait 24 hours, reauthenticate, then install the unverified app. ADB installs remain
exempt.

Taken as an anti-fraud measure, this is well designed. The 24-hour delay specifically
defeats the dominant scam pattern, where a victim is talked through an install while
someone is on the phone with them. Social engineering does not survive a day of waiting.
Credit where it is due.

Taken as a preservation of software freedom, it is not one. A friction gradient is a
policy instrument. The people who will push through a reboot, a day's wait and a
reauthentication are the people who already know what an APK is. Everyone else — the
person who would have installed a privacy-respecting SMS app because someone they trust
recommended it — will not. That is not a side effect of the design. Deterring
non-technical users from installing unverified software is the stated purpose.

And it only holds while the exception holds. An escape hatch that exists at Google's
discretion, on Google's timeline, is not the same kind of thing as a platform capability.
F-Droid's open letter notes the flow was not made available early enough to be assessed
before the deadline, which tells you something about how central it was considered.

## GrapheneOS is not the counterargument people think it is

A recurring response is that this does not matter because GrapheneOS is unaffected. That
is true, and it is narrower than it sounds.

Verification is enforced through Google Play Services, and a GrapheneOS device is not a
certified Android device. The mechanism simply is not present. Nothing about installing
what you like on GrapheneOS changes.

But GrapheneOS and CalyxOS both lean heavily on F-Droid as their application source. If
the catalogue thins out because upstream authors will not or cannot register, the
de-Googled distributions inherit a smaller ecosystem regardless of what their own
installer permits. The freedom to install anything is not worth much if there is less to
install.

There is also an audience question. Roughly speaking, GrapheneOS is for people who bought
a specific phone and flashed a specific OS on purpose. That is a rounding error against
the installed base. A policy that preserves freedom for people who have already opted out
of the mainstream platform, while removing it from the mainstream platform, has not
preserved very much.

## If you ship an open source Android app

I do, so this is not abstract for me.

Practically, for now:

- If your users are in Brazil, Indonesia, Singapore or Thailand, 30 September is your
  date. Elsewhere, 2027, with the exact scope still open.
- Registration has been open since March 2026. Registering does not endorse the policy,
  and refusing to register does not stop it — it removes your app from most users' reach.
  That is a real choice with real costs either way, and anyone telling you it is obvious
  is not shipping anything.
- Reproducible builds matter more now, not less. If your published binary can be
  independently derived from your published source, you retain a verification story that
  does not depend on Google vouching for you.
- Keep a direct APK channel working and documented, signed with a stable key, even if it
  becomes the minority path. GitHub Releases with a published certificate fingerprint is
  not elegant, but it is yours.

The uncomfortable part is that "just publish the source" stops being sufficient. For a
decade the answer to platform gatekeeping was that anyone could compile it themselves. In
2027 that is still true and increasingly irrelevant, because the person who needs your
software cannot compile anything.

## What this actually is

Android's distinguishing claim, against iOS, was that it was the phone you could install
software on without permission. Not the phone with better hardware or a nicer store —
the one where the platform owner was not in the loop.

After September, on the devices most people own, the platform owner is in the loop. Not as
a reviewer of content, which would be more visible and more contested, but as a registry
of identity. Google does not need to approve your app. It needs to know who you are, and
retain the ability to stop knowing.

That is a smaller change than a ban and a larger one than a dialog box, and it is close to
irreversible once the infrastructure exists. Security requirements do not usually get
relaxed after they ship.

F-Droid's mistake, if you can call it that, was building the right thing for a threat model
the platform stopped sharing.

---

Sources: [F-Droid's open letter, co-signed by the EFF, FSFE and Software Freedom Conservancy](https://f-droid.org/2026/02/24/open-letter-opposing-developer-verification.html) ·
[Android developer verification documentation](https://developer.android.com/developer-verification) ·
[Google's Sept 30 deadline for the first four countries](https://thehackernews.com/2026/06/google-sets-sept-30-deadline-for.html)
