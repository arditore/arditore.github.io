---
title: Seca
summary: Trois applications de communication pour Android — contacts, appels et messages — un seul design Material 3 Expressive, aucune dépendance Google, et une messagerie chiffrée de bout en bout entre téléphones Seca.
status: wip
repo: https://github.com/arditore/Seca
tech: [Kotlin, Jetpack Compose, Material 3 Expressive, libsignal, Nostr]
topics: [android, vie-privée, dégooglé, chiffrement-bout-en-bout, grapheneos, fdroid, sms, téléphonie]
featured: true
order: 2
updated: 2026-09-16
---

Les trois applications qu'on ouvre tous les jours — le répertoire, le téléphone, les
messages — viennent en général de trois endroits différents et répondent à une entreprise
qui n'est pas vous. Seca remplace les trois par un ensemble cohérent, construit sur l'idée
qu'un téléphone devrait garder ce qu'il manipule.

Les applications tournent sur tout téléphone en Android 12 ou plus récent, et donnent leur
meilleur sur GrapheneOS. Elles parlent français et anglais, en suivant la langue du téléphone.

## Les trois applications

**Seca Contacts**, c'est le répertoire, stocké dans les contacts natifs d'Android. Des
profils colorés — Famille, Travail — sont partagés avec les deux autres applications.
Favoris, recherche, fusion des doublons, votre propre fiche partagée par QR code, import et
export vCard qui conserve le profil de chaque contact, sauvegarde chiffrée.

**Seca Phone** gère les appels. L'écran d'appel affiche le profil de l'appelant. Recherche
T9, blocage du démarchage téléphonique sur les plages de numéros qui lui sont réservées en
France, appelants inconnus mis en silence, profils bloqués pour une durée choisie, SIM
mémorisée par contact, refus d'appel avec message, sorties audio et Bluetooth nommées.

**Seca Messages** gère les SMS. Les conversations prennent les couleurs du profil du
contact. Messages programmés, codes de vérification effacés après un délai, SMS publicitaires
mis de côté, sauvegarde chiffrée.

Ni Contacts ni Phone ne détiennent la permission `INTERNET`. Ils ne peuvent rien envoyer
nulle part, et c'est le système qui le garantit — pas une politique de confidentialité.

## Seca Link

Entre deux téléphones Seca, la messagerie devient chiffrée de bout en bout, sans compte et
sans aucun serveur Seca sur le trajet.

Le chiffrement est celui de Signal : **libsignal**, avec l'accord de clés post-quantique
**PQXDH**. Les messages chiffrés transitent par des relais **Nostr** publics, chaque
enveloppe étant signée par une clé jetable. Un relais voit qui reçoit, quand, et
approximativement quel volume. Il ne voit jamais qui écrit, ni ce qui est écrit.

Deux téléphones équipés de Seca Link se connectent d'eux-mêmes, via un SMS de données qu'un
téléphone sans Seca n'affiche jamais, envoyé à l'ouverture d'une conversation. La conversation
l'indique alors et passe en chiffré. Scanner le code de l'autre en personne fonctionne aussi.

Accusés de lecture, indicateur de saisie, réactions, réponses citées, photos et messages
vocaux chiffrés, messages éphémères, et un numéro de sécurité à comparer. Une option Tor via
Orbot empêche les relais de voir l'adresse du téléphone.

Seca Link est **désactivé par défaut**. Sans lui, Seca Messages n'utilise pas Internet du tout.

Le plus intéressant, c'est ce qui se passe quand ça s'arrête. Un contact qui désactive Seca
Link prévient votre téléphone immédiatement : la conversation l'indique, le cadenas disparaît,
et ce que vous écrivez repart en SMS ordinaire. Un contact qui désinstalle Seca ne dit rien
— plus rien ne tourne chez lui — donc ses clés cessent d'être rafraîchies et expirent en
moins d'un jour, ce qui termine la conversation de la même façon. Les deux chemins sont
prévus ; aucun ne laisse l'autre côté dans le doute.

## Prouver l'absence de Google

Affirmer qu'il n'y a aucune dépendance Google est facile. Seca le vérifie au moment du build :
une tâche `verifyReleaseNoProprietaryDependencies`, branchée sur `check`, fait échouer la
compilation si le moindre artefact `com.google.android.gms`, `com.google.firebase` ou
`com.google.android.play` atteint l'exécution.

Aucun analytics, aucun rapport de plantage, aucun traceur. Les profils de Seca Contacts ne
sont lisibles que par des applications signées avec la même clé.

## Ce qu'il ne fait délibérément pas

**Pas de RCS** — Google réserve son API RCS à une liste fermée d'applications. **Pas de
Wi-Fi calling à proprement parler** — la VoWiFi relève de la pile IMS du système et
fonctionne quel que soit le téléphone utilisé ; Seca Phone se contente d'en afficher l'état.

## État

Seca est en bêta. En attendant F-Droid, les versions sont publiées sur GitHub Releases,
signées par un certificat dont l'empreinte est publiée dans le dépôt.
