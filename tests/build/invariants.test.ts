import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';

const OWN = 'https://arditore.github.io';

function htmlFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) htmlFiles(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function normalise(p: string): string {
  return p.split(sep).join('/').replace(/^dist\//, '');
}

interface Page {
  path: string;
  html: string;
}

let pages: Page[];

beforeAll(() => {
  expect(existsSync('dist'), 'dist/ absent — lancer `astro build` avant ces tests').toBe(true);
  pages = htmlFiles('dist').map((path) => ({ path: normalise(path), html: readFileSync(path, 'utf8') }));
  expect(pages.length).toBeGreaterThan(0);
});

describe('zéro requête tierce', () => {
  it('aucune ressource externe chargée automatiquement', () => {
    const offenders: string[] = [];

    for (const { path, html } of pages) {
      const anchors = new Set(
        [...html.matchAll(/<a\b[^>]*?\bhref="([^"]+)"/g)].map((m) => m[1]),
      );

      for (const m of html.matchAll(/\b(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/g)) {
        const url = m[1]!;
        if (url.startsWith(OWN)) continue;
        if (anchors.has(url)) continue;
        offenders.push(`${path} -> ${url}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('aucun @import ni url() distant', () => {
    for (const { path, html } of pages) {
      expect(html, path).not.toMatch(/@import\s+(?:url\()?["']?https?:/);
      expect(html, path).not.toMatch(/url\(\s*["']?https?:\/\/(?!arditore\.github\.io)/);
    }
  });

  it('aucun srcset externe', () => {
    for (const { path, html } of pages) {
      for (const m of html.matchAll(/srcset\s*=\s*"([^"]+)"/g)) {
        expect(m[1], path).not.toMatch(/https?:\/\/(?!arditore\.github\.io)/);
      }
    }
  });
});

describe('budget JavaScript', () => {
  it('aucun script externe', () => {
    for (const { path, html } of pages) {
      expect(html, path).not.toMatch(/<script[^>]+\bsrc=/);
    }
  });

  it('le JS inline reste sous 1 Ko par page', () => {
    for (const { path, html } of pages) {
      const total = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
        .map((m) => m[1]!.length)
        .reduce((a, b) => a + b, 0);
      expect(total, `${path} = ${total} octets`).toBeLessThan(1024);
    }
  });

  it('aucune hydratation de composant', () => {
    for (const { path, html } of pages) {
      expect(html, path).not.toMatch(/astro-island/);
    }
  });
});

describe('parité linguistique', () => {
  const mirrored = [
    'index.html',
    'cv/index.html',
    'projects/index.html',
    'projects/seca/index.html',
    'blog/index.html',
  ];

  it('chaque page anglaise a son équivalent français', () => {
    const have = new Set(pages.map((p) => p.path));
    for (const p of mirrored) {
      expect(have.has(p), `manque /${p}`).toBe(true);
      expect(have.has(`fr/${p}`), `manque /fr/${p}`).toBe(true);
    }
  });

  it('les deux flux RSS existent', () => {
    expect(existsSync('dist/rss.xml')).toBe(true);
    expect(existsSync('dist/fr/rss.xml')).toBe(true);
  });

  it('les hreflang sont réciproques et incluent x-default', () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(/hreflang="en"/);
      expect(html, path).toMatch(/hreflang="fr"/);
      expect(html, path).toMatch(/hreflang="x-default"/);
    }
  });

  it("l'attribut lang correspond au dossier", () => {
    for (const { path, html } of pages) {
      const expected = path.startsWith('fr/') ? 'fr' : 'en';
      expect(html, path).toMatch(new RegExp(`<html[^>]+lang="${expected}"`));
    }
  });
});

describe('accessibilité structurelle', () => {
  it('chaque page a un titre et une description utiles', () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(/<title>[^<]{3,}<\/title>/);
      expect(html, path).toMatch(/<meta name="description" content="[^"]{10,}"/);
    }
  });

  it("chaque page a un lien d'évitement", () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(/class="skip-link"/);
    }
  });

  it('les couches de scène sont masquées aux lecteurs d’écran', () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(/class="scene"[^>]*aria-hidden="true"/);
    }
  });

  it('une seule balise h1 par page', () => {
    for (const { path, html } of pages) {
      const count = [...html.matchAll(/<h1[\s>]/g)].length;
      expect(count, `${path} a ${count} h1`).toBe(1);
    }
  });
});

describe('vie privée du CV', () => {
  const cvPages = () => pages.filter((p) => p.path.includes('cv/'));

  it('le CV ne publie que l’adresse e-mail connue', () => {
    const cv = cvPages();
    expect(cv.length).toBe(2);
    for (const { path, html } of cv) {
      const emails = new Set([...html.matchAll(/[\w.+-]+@[\w.-]+\.\w{2,}/g)].map((m) => m[0]));
      expect([...emails], path).toEqual(['arditore@tuta.io']);
    }
  });

  it('le CV ne publie aucun numéro de téléphone', () => {
    for (const { path, html } of cvPages()) {
      expect(html, path).not.toMatch(/\+\d{2}[\s.-]?\d/);
      expect(html, path).not.toMatch(/\b0[1-9]([\s.-]?\d{2}){4}\b/);
    }
  });

  it('le CV affiche la limite P2P', () => {
    for (const { path, html } of cvPages()) {
      expect(html.toLowerCase(), path).toMatch(/peer-to-peer|particulier à particulier/);
    }
  });

  it('le CV ne publie ni employeur ni formation datée', () => {
    for (const { path, html } of cvPages()) {
      const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
      expect(body, path).not.toMatch(/\b(19|20)\d{2}\s*[–—-]\s*((19|20)\d{2}|présent|present)\b/i);
    }
  });
});

describe('métadonnées sociales', () => {
  it('chaque page porte une image Open Graph absolue sur le domaine', () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(
        new RegExp(`<meta property="og:image" content="${OWN}/og\\.png"`),
      );
      expect(html, path).toMatch(/<meta property="og:title"/);
      expect(html, path).toMatch(/<meta name="twitter:card"/);
    }
  });

  it('chaque page a une URL canonique', () => {
    for (const { path, html } of pages) {
      expect(html, path).toMatch(new RegExp(`<link rel="canonical" href="${OWN}`));
    }
  });
});
