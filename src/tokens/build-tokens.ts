/**
 * Build Script for Design Tokens
 * Generates CSS variables from W3C DTCG design token JSON files
 */

import fs from 'fs';
import path from 'path';
import { parseTokens, resolveReferences } from './parser.js';
import { generateCSSVariables, generateStats } from './generator.js';

async function buildTokens() {
  try {
    console.log('🔧 Building design tokens from W3C DTCG format...\n');

    // Read the three W3C DTCG token files
    const tokensDir = path.join(process.cwd(), 'src', 'tokens', 'json');

    const globalPath = path.join(tokensDir, 'global.json');
    const systemPath = path.join(tokensDir, 'system.json');
    const componentsPath = path.join(tokensDir, 'components.json');
    const siteComponentsPath = path.join(tokensDir, 'site-components.json');

    console.log(`📖 Reading tokens from: ${tokensDir}`);
    console.log(`   - global.json`);
    console.log(`   - system.json`);
    console.log(`   - components.json`);
    console.log(`   - site-components.json (merged into component layer)\n`);

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
    const siteComponentTokensRaw = fs.existsSync(siteComponentsPath)
      ? JSON.parse(fs.readFileSync(siteComponentsPath, 'utf-8'))
      : {};
    const siteComponentMap = parseTokens(siteComponentTokensRaw, 'components tokens', 'component');

    // Parse each file with appropriate level wrapper and level tag
    console.log('⚙️  Parsing design tokens...');
    const globalMap = parseTokens(globalTokens, 'global tokens', 'global');
    console.log(`   ✓ Global: ${Object.keys(globalMap).length} tokens`);

    const systemMap = parseTokens(systemTokens, 'system tokens', 'system');
    console.log(`   ✓ System: ${Object.keys(systemMap).length} tokens`);

    const componentMap = parseTokens(componentTokens, 'components tokens', 'component');
    console.log(`   ✓ Component: ${Object.keys(componentMap).length} tokens`);
    if (Object.keys(siteComponentMap).length > 0) {
      console.log(`   ✓ Site component: ${Object.keys(siteComponentMap).length} tokens`);
    }
    console.log('');

    // Merge all token maps (site tokens extend component layer without editing Figma components.json)
    const tokenMap = { ...globalMap, ...systemMap, ...componentMap, ...siteComponentMap };
    console.log(`📊 Total tokens found: ${Object.keys(tokenMap).length}\n`);

    // Resolve references
    console.log('🔗 Resolving token references...');
    const resolvedTokens = resolveReferences(tokenMap);
    console.log(`   ✓ Resolved ${Object.keys(resolvedTokens).length} tokens\n`);

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
