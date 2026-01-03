/**
 * Token Comparison Script
 * Compares old and new design token CSS output to validate migration
 */

import fs from 'fs';
import path from 'path';

function extractCSSVariables(cssContent: string): Map<string, string> {
  const varMap = new Map<string, string>();
  const varRegex = /(--[^:]+):\s*([^;]+);/g;

  let match;
  while ((match = varRegex.exec(cssContent)) !== null) {
    const [, varName, value] = match;
    varMap.set(varName.trim(), value.trim());
  }

  return varMap;
}

function compareTokens() {
  const oldPath = path.join(process.cwd(), 'src', 'tokens', 'design-tokens.css.backup');
  const newPath = path.join(process.cwd(), 'src', 'tokens', 'design-tokens.css');

  // Check if backup exists
  if (!fs.existsSync(oldPath)) {
    console.log('⚠️  Backup file not found at:', oldPath);
    console.log('   Skipping comparison - this is expected if no backup was created.');
    return;
  }

  console.log('📊 Comparing token outputs...\n');

  const oldContent = fs.readFileSync(oldPath, 'utf-8');
  const newContent = fs.readFileSync(newPath, 'utf-8');

  const oldVars = extractCSSVariables(oldContent);
  const newVars = extractCSSVariables(newContent);

  console.log(`Old CSS: ${oldVars.size} variables`);
  console.log(`New CSS: ${newVars.size} variables\n`);

  // Find missing variables
  const missing = Array.from(oldVars.keys()).filter(v => !newVars.has(v));

  // Find added variables
  const added = Array.from(newVars.keys()).filter(v => !oldVars.has(v));

  // Find changed values
  const changed: Array<{name: string, oldValue: string, newValue: string}> = [];
  for (const [varName, newValue] of newVars) {
    const oldValue = oldVars.get(varName);
    if (oldValue && oldValue !== newValue) {
      changed.push({ name: varName, oldValue, newValue });
    }
  }

  // Report results
  if (missing.length > 0) {
    console.log(`⚠️  Missing variables (${missing.length}):`);
    missing.slice(0, 10).forEach(v => console.log(`   - ${v}`));
    if (missing.length > 10) {
      console.log(`   ... and ${missing.length - 10} more`);
    }
    console.log();
  }

  if (added.length > 0) {
    console.log(`➕ Added variables (${added.length}):`);
    added.slice(0, 10).forEach(v => console.log(`   - ${v}`));
    if (added.length > 10) {
      console.log(`   ... and ${added.length - 10} more`);
    }
    console.log();
  }

  if (changed.length > 0) {
    console.log(`🔄 Changed values (${changed.length}):`);
    changed.slice(0, 5).forEach(({ name, oldValue, newValue }) => {
      console.log(`   ${name}:`);
      console.log(`     Old: ${oldValue}`);
      console.log(`     New: ${newValue}`);
    });
    if (changed.length > 5) {
      console.log(`   ... and ${changed.length - 5} more`);
    }
    console.log();
  }

  // File size comparison
  const oldSize = (oldContent.length / 1024).toFixed(2);
  const newSize = (newContent.length / 1024).toFixed(2);
  console.log(`📦 File sizes:`);
  console.log(`   Old: ${oldSize} KB`);
  console.log(`   New: ${newSize} KB`);
  const sizeDiff = ((newContent.length - oldContent.length) / 1024).toFixed(2);
  if (parseFloat(sizeDiff) > 0) {
    console.log(`   Difference: +${sizeDiff} KB\n`);
  } else {
    console.log(`   Difference: ${sizeDiff} KB\n`);
  }

  // Final verdict
  if (missing.length === 0 && added.length === 0 && changed.length === 0) {
    console.log('✅ Perfect match! Token migration successful - all variables identical.');
  } else if (missing.length === 0) {
    console.log('✅ Migration successful! No variables lost.');
    if (added.length > 0) {
      console.log(`   ${added.length} new variable(s) added.`);
    }
    if (changed.length > 0) {
      console.log(`   ${changed.length} value(s) changed - review changes above.`);
    }
  } else {
    console.log('⚠️  Migration has differences - manual review required.');
  }
}

compareTokens();
