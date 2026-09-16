---
title: "Android se referme, et F-Droid n'a pas la bonne forme pour y survivre"
description: Dès le 30 septembre, toute application installée sur un appareil Android certifié devra remonter à un développeur ayant montré une pièce d'identité à Google. F-Droid n'a pas de développeurs en ce sens — il a du code source et une clé de signature. Cette inadéquation n'est pas un défaut de la règle. C'est la règle.
pubDate: 2026-09-16
tags: [android, f-droid, sideloading, vie-privée, réglementation]
---

Le 30 septembre, Google commence à appliquer la vérification des développeurs au Brésil,
en Indonésie, à Singapour et en Thaïlande. À partir de cette date, une application
installée sur un appareil Android certifié dans ces pays — depuis le Play Store, depuis
une boutique tierce, depuis un téléchargement web, depuis n'importe où — devra être liée à
un développeur ayant vérifié son identité auprès de Google. L'application mondiale suit en
2027.

« Appareil Android certifié » porte beaucoup de poids dans cette phrase. Cela désigne un
appareil livré avec les services Google sous licence, soit plus de 95 % d'Android hors de
Chine. En pratique : les téléphones.

Je veux être précis sur ce que c'est et ce que ce n'est pas, parce que la discussion s'est
effondrée en deux camps également inutiles — l'un affirmant qu'on interdit le sideloading,
l'autre affirmant que rien ne change puisqu'ADB fonctionne toujours. Aucun des deux n'a
raison, et l'intéressant est entre les deux.

## Ce qui change réellement

Le sideloading n'est pas bloqué. C'est l'installation d'une application dont le
développeur n'a pas été vérifié qui l'est.

La distinction compte parce qu'elle déplace la barrière. Android vous a toujours demandé
de confirmer avant d'installer hors boutique — une boîte de dialogue, une permission, un
avertissement. Cette barrière était devant **vous**, et vous pouviez la franchir. La
nouvelle barrière est devant **le développeur**, elle est en amont de vous, et aucun
consentement de votre part ne l'ouvre.

Pour la franchir, un développeur doit créer un compte dans l'Android Developer Console,
payer, fournir une pièce d'identité officielle, et enregistrer chaque application
individuellement contre un nom de paquet et une clé de signature. Le résumé qu'en fait
F-Droid — des conditions « volumineuses, non négociables et changeant en permanence » — est
polémique mais pas inexact.

L'argument de sécurité de Google est réel et ne mérite pas d'être balayé. Les logiciels
malveillants distribués en APK sont un vrai problème, particulièrement les APK de fraude
financière poussés via les messageries, et particulièrement dans les quatre pays retenus
pour la première phase. Ces pays n'ont pas été choisis au hasard. L'attribution augmente
le coût de ces opérations, et cela fonctionnera dans une certaine mesure.

La question n'est pas de savoir si ça marche. C'est de savoir ce que ça fait d'autre.

## Pourquoi F-Droid casse spécifiquement

La plupart des articles traitent F-Droid comme une boutique de plus qui devra remplir un
formulaire. Ce n'en est pas une, et cette différence est toute l'histoire.

Quand vous installez une application depuis Google Play, vous recevez un binaire que le
développeur a compilé et signé. Play est un canal de distribution ; la confiance vient de
la clé du développeur.

F-Droid fait autre chose. Il prend du code source publiquement disponible, le vérifie pour
la conformité de licence et les anti-fonctionnalités, **le compile lui-même**, et signe le
binaire obtenu avec **sa propre clé**. Les builds reproductibles permettent à quiconque de
vérifier que le binaire publié correspond bien au source publié.

Ce modèle retire délibérément le développeur du chemin de confiance. Vous ne faites pas
confiance au fait que la machine de compilation de l'auteur était saine, ni que sa clé de
signature n'a pas été volée. Vous faites confiance à du source que vous pouvez lire et à
une compilation que vous pouvez reproduire. Pour un modèle de menace où le développeur
lui-même peut être compromis, contraint ou simplement négligent, c'est strictement plus
fort que la vérification d'identité — c'est la différence entre « on sait qui a fait ça »
et « vous pouvez vérifier ce que c'est ».

Appliquez maintenant la nouvelle exigence à ce modèle. Quelle identité vérifie une
compilation F-Droid ? Le binaire est signé par F-Droid, pas par l'auteur en amont. Cet
auteur peut ignorer que F-Droid empaquette son application ; c'est permis et courant,
puisque la licence l'autorise. Beaucoup d'auteurs sont pseudonymes, ce qui n'est pas un
signal d'alarme dans cet écosystème mais une condition normale, et souvent nécessaire,
pour contribuer à des outils de protection de la vie privée.

Il n'y a pas de réponse propre. Que F-Droid se déclare développeur de plusieurs milliers
d'applications qu'il n'a pas écrites est une fiction. Exiger que chaque auteur en amont
s'enregistre individuellement chez Google — payer, montrer une pièce d'identité, accepter
les conditions — pour rester dans un dépôt auquel il n'a peut-être jamais adhéré n'est pas
un correctif ; c'est la fin du catalogue. L'analyse d'un membre du conseil de F-Droid,
selon laquelle cela « signifiera la fin du projet F-Droid et des autres sources de
distribution libres », n'est pas une exagération. Elle découle de la structure.

Le cadre de vérification ne reconnaît pas la transparence par le source comme équivalente
à l'identité. Il ne le peut pas, parce qu'il a été conçu autour d'un modèle où une personne
morale répond d'un binaire. Toute la valeur de F-Droid tient à ce que personne n'ait à le
faire.

## Le « flux avancé » répond à une autre question

La concession de Google pour les utilisateurs avertis est un « flux avancé » : activer le
mode développeur, redémarrer, attendre 24 heures, se réauthentifier, puis installer
l'application non vérifiée. Les installations par ADB restent exemptées.

Comme mesure anti-fraude, c'est bien conçu. Le délai de 24 heures neutralise précisément le
schéma d'escroquerie dominant, où l'on guide une victime pendant l'installation tout en
l'ayant au téléphone. L'ingénierie sociale ne survit pas à une journée d'attente. Il faut
le reconnaître.

Comme préservation de la liberté logicielle, ce n'en est pas une. Un gradient de friction
est un instrument de politique publique. Les gens qui franchiront un redémarrage, une
journée d'attente et une réauthentification sont ceux qui savent déjà ce qu'est un APK.
Tous les autres — la personne qui aurait installé une application de SMS respectueuse de
sa vie privée parce que quelqu'un de confiance la lui a recommandée — ne le feront pas. Ce
n'est pas un effet secondaire de la conception. Dissuader les utilisateurs non techniques
d'installer des logiciels non vérifiés est l'objectif annoncé.

Et cela ne tient qu'aussi longtemps que l'exception tient. Une issue de secours qui existe
à la discrétion de Google, selon le calendrier de Google, n'est pas de même nature qu'une
capacité de la plateforme. La lettre ouverte de F-Droid relève que ce flux n'a pas été mis
à disposition assez tôt pour être évalué avant l'échéance, ce qui en dit long sur la place
qu'on lui accordait.

## GrapheneOS n'est pas le contre-argument qu'on croit

Une réponse revient souvent : cela n'a pas d'importance puisque GrapheneOS n'est pas
concerné. C'est vrai, et c'est plus étroit que ça n'en a l'air.

La vérification passe par les services Google Play, et un appareil sous GrapheneOS n'est
pas un appareil Android certifié. Le mécanisme n'est tout simplement pas présent. Rien ne
change quant à ce que vous pouvez installer sur GrapheneOS.

Mais GrapheneOS et CalyxOS s'appuient tous deux massivement sur F-Droid comme source
d'applications. Si le catalogue s'appauvrit parce que les auteurs en amont ne veulent pas
ou ne peuvent pas s'enregistrer, les distributions dégooglées héritent d'un écosystème plus
pauvre, quoi qu'autorise leur propre installateur. La liberté d'installer n'importe quoi
vaut peu s'il y a moins de choses à installer.

Il y a aussi une question de public. En gros, GrapheneOS s'adresse aux gens qui ont acheté
un téléphone précis pour y flasher un système précis, délibérément. C'est une erreur
d'arrondi face au parc installé. Une règle qui préserve la liberté de ceux qui ont déjà
quitté la plateforme dominante, tout en la retirant de la plateforme dominante, n'a pas
préservé grand-chose.

## Si vous publiez une application Android libre

C'est mon cas, donc ce n'est pas abstrait pour moi.

En pratique, pour l'instant :

- Si vos utilisateurs sont au Brésil, en Indonésie, à Singapour ou en Thaïlande, votre
  échéance est le 30 septembre. Ailleurs, 2027, avec un périmètre encore ouvert.
- L'enregistrement est ouvert depuis mars 2026. S'enregistrer ne cautionne pas la règle, et
  refuser de s'enregistrer ne l'arrête pas — cela retire votre application de la portée de
  la plupart des utilisateurs. C'est un vrai choix avec de vrais coûts des deux côtés, et
  quiconque vous dit que la réponse est évidente ne publie rien.
- Les builds reproductibles comptent davantage, pas moins. Si votre binaire publié peut
  être dérivé indépendamment de votre source publié, vous gardez une histoire de
  vérification qui ne dépend pas de Google se portant garant de vous.
- Maintenez un canal APK direct, fonctionnel et documenté, signé avec une clé stable, même
  s'il devient la voie minoritaire. GitHub Releases avec l'empreinte du certificat publiée
  n'est pas élégant, mais c'est le vôtre.

Le point inconfortable, c'est que « il suffit de publier le source » cesse de suffire.
Pendant une décennie, la réponse au contrôle des plateformes était que n'importe qui
pouvait compiler lui-même. En 2027 c'est toujours vrai et de moins en moins pertinent,
parce que la personne qui a besoin de votre logiciel ne sait rien compiler.

## Ce que c'est réellement

L'argument distinctif d'Android, face à iOS, était que c'était le téléphone sur lequel on
pouvait installer des logiciels sans permission. Pas le téléphone au meilleur matériel ou à
la plus jolie boutique — celui où le propriétaire de la plateforme n'était pas dans la
boucle.

Après septembre, sur les appareils que possèdent la plupart des gens, le propriétaire de la
plateforme est dans la boucle. Pas comme relecteur de contenu, ce qui serait plus visible
et plus contesté, mais comme registre d'identité. Google n'a pas besoin d'approuver votre
application. Il a besoin de savoir qui vous êtes, et de conserver la possibilité de cesser
de le savoir.

C'est un changement plus petit qu'une interdiction et plus grand qu'une boîte de dialogue,
et il est proche de l'irréversible une fois l'infrastructure en place. Les exigences de
sécurité sont rarement assouplies après leur déploiement.

L'erreur de F-Droid, si l'on peut l'appeler ainsi, aura été de construire la bonne chose
pour un modèle de menace que la plateforme a cessé de partager.

---

Sources : [la lettre ouverte de F-Droid, cosignée par l'EFF, la FSFE et la Software Freedom Conservancy](https://f-droid.org/2026/02/24/open-letter-opposing-developer-verification.html) ·
[la documentation Android developer verification](https://developer.android.com/developer-verification) ·
[l'échéance du 30 septembre pour les quatre premiers pays](https://thehackernews.com/2026/06/google-sets-sept-30-deadline-for.html)
