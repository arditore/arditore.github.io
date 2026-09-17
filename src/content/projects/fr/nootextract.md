---
title: NootExtract
summary: Acquisition forensique Android et préparation de preuves, en Rust. Méthodes autorisées uniquement, SHA-256 en flux, manifestes JSON versionnés, et des garanties que la suite de tests vérifie réellement.
status: wip
repo: https://github.com/arditore/NootExtract
tech: [Rust, ADB, SHA-256, libewf, Autopsy]
topics: [investigation-numérique, dfir, forensique-mobile, android, chaîne-de-possession, réponse-à-incident, cli]
featured: true
order: 1
updated: 2026-09-18
---

NootExtract extrait des preuves d'un appareil Android par des canaux que l'appareil accorde
déjà, consigne exactement ce qu'il a fait dans un manifeste JSON versionné, et prépare le
résultat pour des outils d'analyse comme Autopsy.

Écrit en Rust, sans aucun `unsafe`, et entièrement en flux. Une image de 256 Go coûte
autant de mémoire qu'une de 4 Ko.

## Ce qu'il refuse de faire

La section sur le périmètre vient avant la liste des fonctionnalités, parce que la retenue
*est* la conception.

NootExtract n'utilise que des accès déjà autorisés : le débogage USB accepté pour la clé
ADB de cette machine, et — pour l'acquisition physique — un shell ADB déjà privilégié. Il
ne tente pas de contourner un code PIN, un mot de passe, la biométrie, un écran de
verrouillage, le chiffrement par fichier ou par métadonnées, le démarrage vérifié, les
protections constructeur ou les contrôles d'entreprise. Il ne contient aucun exploit ni
code d'élévation de privilèges.

Là où une méthode autorisée ne peut pas atteindre la donnée, l'outil signale la limite et
s'arrête.

Cette dernière phrase résume toute la posture. Un outil forensique qui fait discrètement
moins que ce qu'il annonce est pire qu'un outil qui refuse bruyamment, parce que l'écart
finit dans un rapport sur lequel quelqu'un s'appuie. L'acquisition physique est
indisponible sur un appareil grand public ordinaire — c'est une propriété du modèle de
sécurité d'Android, pas une fonctionnalité manquante — donc l'outil sort avec le code 9 et
le dit.

## Des garanties tenues par le code

Ce ne sont pas des promesses dans un README. Ce sont des propriétés que l'implémentation
maintient et que la suite de tests vérifie :

- Les fichiers sous `original/` ne sont jamais modifiés, jamais écrasés, jamais supprimés.
- Chaque fichier de preuve est créé avec `create_new`, donc un fichier existant provoque un
  échec plutôt qu'un remplacement silencieux.
- Les données volumineuses sont écrites dans un fichier `.partial` et renommées seulement
  une fois le transfert terminé proprement. **Un fichier portant son nom définitif est
  toujours un transfert achevé.**
- Chaque artefact est haché en SHA-256 au fil de l'écriture, puis relu depuis le disque
  pour confirmer l'empreinte.
- Une acquisition qui n'aboutit pas sort avec un code non nul et consigne sa sortie
  partielle comme incomplète. Elle ne rapporte jamais un succès.
- Conversions et copies produisent de nouveaux artefacts sous `derived/` ou `working/` ; la
  source est ouverte en lecture seule.

Le renommage depuis `.partial` est celui que je mettrais en avant. Il transforme « est-ce
que ce transfert s'est terminé ? » d'une question à instruire en une propriété du nom de
fichier. Il n'existe aucun état où une image tronquée porte un nom qui suggère qu'elle est
complète.

Ce sont des garanties d'ingénierie sur le comportement du programme. Ce ne sont pas des
affirmations sur la suffisance juridique ou probatoire d'une acquisition, qui dépend de
l'autorisation, de la procédure et de la juridiction.

## Le répertoire de dossier

```
CASE-001/
    original/    preuves acquises — jamais modifiées, écrasées ni supprimées
    derived/     conversions produites depuis les originaux
    working/     copies vérifiées et fichiers extraits, pour les outils d'analyse
    manifests/   un manifeste immuable par opération
    hashes/      listes d'empreintes compatibles sha256sum
    logs/        journaux structurés en JSON Lines
```

Les manifestes sont en ajout seul. Une conversion écrit un *nouveau* manifeste référençant
sa source, donc la trace de l'acquisition d'origine n'est jamais réécrite. Un répertoire de
dossier contient plusieurs pièces à conviction.

Les fichiers d'empreintes sont compatibles coreutils, ce qui compte plus qu'il n'y paraît.
Vous pouvez vérifier un dossier sans faire confiance à cet outil du tout :

```bash
cd ./evidence/CASE-001 && sha256sum -c hashes/EVIDENCE-001-*.sha256
```

## Hachage et vérification

SHA-256 est toujours calculé ; `--sha512` ajoute SHA-512. Le hachage se fait en flux sur un
tampon de 1 Mio, donc l'usage mémoire est constant quelle que soit la taille de l'image, et
l'empreinte consignée à l'acquisition provient du même chemin de code que celui qui la
vérifie ensuite.

`verify` rapporte quatre résultats par fichier — `MATCH`, `MISMATCH`, `MISSING`, `EXTRA` —
et sort avec le code 5 si quoi que ce soit diverge, manque ou reste inexpliqué. Les codes
de sortie sont un contrat stable, documenté plutôt qu'accidentel.

## Méthodes d'acquisition

| Méthode | Type | Sortie | Exige |
|---|---|---|---|
| `adb-logical-tar` (défaut) | logique | tar | ADB autorisé, appareil déverrouillé, `tar` présent sur l'appareil |
| `adb-physical-dd` | physique | brut | ADB autorisé, un shell déjà en UID 0, `--source` explicite |

L'appareil doit rester déverrouillé pendant une acquisition logique : sur un appareil à
chiffrement par fichier, les répertoires des profils verrouillés sont simplement
illisibles. L'outil le dit, au lieu de produire une archive discrètement incomplète.

## Ce qui n'a pas été vérifié

La suite automatisée tourne sans appareil physique. Le comportement de l'appareil provient
d'un substitut ADB scripté qui exerce les vrais chemins de commande, ce qui ne prouve pas
qu'un téléphone ou une version d'Android donnés se comportent comme modélisé.

L'intégration continue exécute la suite plus une vérification de bout en bout sur Linux,
macOS et Windows, et compile la crate sur la version minimale de Rust déclarée. Tous les
travaux passent.

**Aucun appareil Android physique, et aucun import Autopsy, n'a servi au développement de
cette version.** `docs/TESTING.md` précise exactement ce qui a été exercé et ce qui ne l'a
pas été, et `docs/INTEROPERABILITY.md` sépare les procédures d'import testées de celles qui
ne le sont pas.

Publier cette distinction est précisément le sujet. Un outil forensique qui surestime ses
tests produit, sur lui-même, une preuve qui ne survivrait pas au standard qu'il exige de
tout le reste.

## État

Dix documents couvrent l'architecture, le schéma de manifeste 1.0, le contrat de codes de
sortie, le modèle de menace, les formats d'image, l'interopérabilité, les limites, la
stratégie de test, la raison pour laquelle l'acquisition reprenable n'est délibérément pas
implémentée, et la mise en place de l'environnement de développement.

Nécessite une chaîne d'outils Rust stable (1.88 ou plus récente ; développé avec la
1.96.0) et les platform-tools du SDK Android. Sous licence MIT. Aucune version encore
étiquetée.
