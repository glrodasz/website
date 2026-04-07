/**
 * Build Script for Design Tokens
 * Generates CSS variables from W3C DTCG design token JSON files
 */

import fs from 'fs';
import path from 'path';
import { parseTokens, resolveReferences } from './parser.js';
import { generateThemedCSSVariables, generateStats } from './generator.js';

async function buildTokens() {
  try {
    console.log('🔧 Building design tokens from W3C DTCG format...\n');

    // Read the three W3C DTCG token files
    const tokensDir = path.join(process.cwd(), 'src', 'tokens', 'json');

    const globalPath = path.join(tokensDir, 'global.json');
    const systemPath = path.join(tokensDir, 'system-light.json');
    const componentsPath = path.join(tokensDir, 'components.json');

    console.log(`📖 Reading tokens from: ${tokensDir}`);
    console.log(`   - global.json`);
    console.log(`   - system-light.json`);
    console.log(`   - components.json\n`);

    // Verify files exist
    if (!fs.existsSync(globalPath)) {
      throw new Error(`Global tokens file not found: ${globalPath}`);
    }
    if (!fs.existsSync(systemPath)) {
      throw new Error(`System tokens file not found: ${systemPath}`);
    }
    if (!fs.existsSync(componentsPath)) {
      throw new Error(`Component tokens file not found: ${componentsPath}`);
    }

    const globalTokens = JSON.parse(fs.readFileSync(globalPath, 'utf-8'));
    const systemTokens = JSON.parse(fs.readFileSync(systemPath, 'utf-8'));
    const componentTokens = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));

    // Load system-dark.json for dark mode color token overrides
    const systemDarkPath = path.join(tokensDir, 'system-dark.json');
    const systemDarkTokensRaw = fs.existsSync(systemDarkPath)
      ? JSON.parse(fs.readFileSync(systemDarkPath, 'utf-8'))
      : {};
    console.log(`   - system-dark.json`);
    const systemDarkMap = parseTokens(systemDarkTokensRaw, 'system tokens', 'system');
    console.log(`   ✓ System dark: ${Object.keys(systemDarkMap).length} tokens\n`);

    // Parse each file with appropriate level wrapper and level tag
    console.log('⚙️  Parsing design tokens...');
    const globalMap = parseTokens(globalTokens, 'global tokens', 'global');
    console.log(`   ✓ Global: ${Object.keys(globalMap).length} tokens`);

    const systemMap = parseTokens(systemTokens, 'system tokens', 'system');
    console.log(`   ✓ System: ${Object.keys(systemMap).length} tokens`);

    const componentMap = parseTokens(componentTokens, 'components tokens', 'component');
    console.log(`   ✓ Component: ${Object.keys(componentMap).length} tokens`);
    console.log('');

    // Merge all token maps
    const tokenMap = { ...globalMap, ...systemMap, ...componentMap };
    console.log(`📊 Total tokens found: ${Object.keys(tokenMap).length}\n`);

    // Resolve references
    console.log('🔗 Resolving token references...');
    const resolvedTokens = resolveReferences(tokenMap);
    console.log(`   ✓ Resolved ${Object.keys(resolvedTokens).length} tokens\n`);

    // Resolve dark system token references against global tokens
    const darkTokenMap = { ...globalMap, ...systemDarkMap };
    const resolvedDarkSystemTokens = resolveReferences(darkTokenMap);

    // Generate themed CSS (system color tokens → [data-theme] blocks)
    console.log('🎨 Generating themed CSS variables...');
    const cssContent = generateThemedCSSVariables(resolvedTokens, resolvedDarkSystemTokens);

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
