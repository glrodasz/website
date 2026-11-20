import { describe, expect, it } from 'vitest';
import { markdownToPlainText } from './markdownToPlainText';

describe('markdownToPlainText', () => {
  it('keeps the link text and drops the URL', () => {
    expect(markdownToPlainText('Shipped at [Klarna](https://www.klarna.com).')).toBe('Shipped at Klarna.');
  });

  it('removes bold and italic markers', () => {
    expect(markdownToPlainText('**Guillermo Rodas** is a *Senior* engineer')).toBe(
      'Guillermo Rodas is a Senior engineer'
    );
  });

  it('keeps paragraph breaks', () => {
    expect(markdownToPlainText('First.\n\nSecond.')).toBe('First.\n\nSecond.');
  });

  it('leaves plain text untouched', () => {
    expect(markdownToPlainText('I build production AI systems.')).toBe('I build production AI systems.');
  });
});
