import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  getLocalizedPath,
  stripLangPrefix,
  localeHome,
  useTranslations,
  publishedPosts,
} from '../../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('détecte le français au préfixe /fr/', () => {
    expect(getLangFromUrl(new URL('https://a.io/fr/cv'))).toBe('fr');
  });
  it('retombe sur l’anglais sans préfixe', () => {
    expect(getLangFromUrl(new URL('https://a.io/cv'))).toBe('en');
  });
  it('traite /fr comme du français', () => {
    expect(getLangFromUrl(new URL('https://a.io/fr'))).toBe('fr');
  });
  it('ne confond pas /french avec /fr', () => {
    expect(getLangFromUrl(new URL('https://a.io/french/x'))).toBe('en');
  });
  it('traite la racine comme de l’anglais', () => {
    expect(getLangFromUrl(new URL('https://a.io/'))).toBe('en');
  });
});

describe('stripLangPrefix', () => {
  it('retire le préfixe de langue', () => {
    expect(stripLangPrefix('/fr/projects/seca')).toBe('/projects/seca');
  });
  it('laisse un chemin anglais intact', () => {
    expect(stripLangPrefix('/projects/seca')).toBe('/projects/seca');
  });
  it('réduit /fr/ à la racine', () => {
    expect(stripLangPrefix('/fr/')).toBe('/');
  });
  it('réduit /fr à la racine', () => {
    expect(stripLangPrefix('/fr')).toBe('/');
  });
  it('ne tronque pas un segment qui commence par fr', () => {
    expect(stripLangPrefix('/frameworks')).toBe('/frameworks');
  });
});

describe('getLocalizedPath', () => {
  it('EN vers FR conserve la page', () => {
    expect(getLocalizedPath('/projects/seca', 'fr')).toBe('/fr/projects/seca');
  });
  it('FR vers EN conserve la page', () => {
    expect(getLocalizedPath('/fr/projects/seca', 'en')).toBe('/projects/seca');
  });
  it('mappe les accueils', () => {
    expect(getLocalizedPath('/', 'fr')).toBe('/fr/');
    expect(getLocalizedPath('/fr/', 'en')).toBe('/');
  });
  it('est idempotent vers la même langue', () => {
    expect(getLocalizedPath('/fr/cv', 'fr')).toBe('/fr/cv');
    expect(getLocalizedPath('/cv', 'en')).toBe('/cv');
  });
  it('retombe sur l’accueil si la page cible n’existe pas', () => {
    const available = new Set(['/fr/', '/fr/cv']);
    expect(getLocalizedPath('/blog/post', 'fr', available)).toBe('/fr/');
  });
  it('conserve la page si elle existe dans la cible', () => {
    const available = new Set(['/fr/', '/fr/cv']);
    expect(getLocalizedPath('/cv', 'fr', available)).toBe('/fr/cv');
  });
});

describe('localeHome', () => {
  it('donne la racine de chaque langue', () => {
    expect(localeHome('en')).toBe('/');
    expect(localeHome('fr')).toBe('/fr/');
  });
});

describe('useTranslations', () => {
  it('retourne la chaîne française', () => {
    expect(useTranslations('fr')('nav.projects')).toBe('Projets');
  });
  it('retourne la chaîne anglaise', () => {
    expect(useTranslations('en')('nav.projects')).toBe('Projects');
  });
  it('toutes les clés anglaises existent en français', () => {
    const t = useTranslations('fr');
    const en = useTranslations('en');
    for (const key of ['nav.home', 'nav.cv', 'cv.p2p', 'hero.role', 'footer.built'] as const) {
      expect(t(key), key).toBeTruthy();
      expect(en(key), key).toBeTruthy();
    }
  });
});

describe('publishedPosts', () => {
  const entries = [
    { id: 'en/un', data: { draft: false } },
    { id: 'en/brouillon', data: { draft: true } },
    { id: 'fr/un', data: { draft: false } },
  ];
  it('ne garde que la langue demandée', () => {
    expect(publishedPosts(entries, 'fr').map((e) => e.id)).toEqual(['fr/un']);
  });
  it('exclut les brouillons', () => {
    expect(publishedPosts(entries, 'en').map((e) => e.id)).toEqual(['en/un']);
  });
  it('renvoie un tableau vide sans article', () => {
    expect(publishedPosts([], 'en')).toEqual([]);
  });
});
