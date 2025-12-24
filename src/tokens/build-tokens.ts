/**
 * Build Script for Design Tokens
 * Generates CSS variables from design-tokens.tokens.json
 */

import fs from 'fs';
import path from 'path';
import { parseTokens, resolveReferences } from './parser.js';
import { generateCSSVariables, generateStats } from './generator.js';

async function buildTokens() {
  try {
    console.log('🔧 Building design tokens...\n');

    // Read the design tokens JSON file
    const tokensPath = path.join(process.cwd(), 'design-tokens.tokens.json');
    console.log(`📖 Reading tokens from: ${tokensPath}`);

    const designTokensContent = fs.readFileSync(tokensPath, 'utf-8');
    const designTokens = JSON.parse(designTokensContent);

    // Parse tokens
    console.log('⚙️  Parsing design tokens...');
    const tokenMap = parseTokens(designTokens);
    console.log(`   Found ${Object.keys(tokenMap).length} tokens`);

    // Resolve references
    console.log('🔗 Resolving token references...');
    const resolvedTokens = resolveReferences(tokenMap);
    console.log(`   Resolved ${Object.keys(resolvedTokens).length} tokens`);

    // Generate CSS
    console.log('🎨 Generating CSS variables...');
    const cssContent = generateCSSVariables(resolvedTokens);

    // Get statistics
    const stats = generateStats(resolvedTokens);
    console.log('\n📊 Token Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Global: ${stats.global}`);
    console.log(`   System: ${stats.system}`);
    console.log(`   Component: ${stats.component}`);

    // Write CSS file
    const outputPath = path.join(process.cwd(), 'src', 'tokens', 'design-tokens.css');
    fs.writeFileSync(outputPath, cssContent, 'utf-8');

    console.log(`\n✅ Successfully generated: ${outputPath}`);
    console.log(`   File size: ${(cssContent.length / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error building tokens:', error);
    process.exit(1);
  }
}

buildTokens();
