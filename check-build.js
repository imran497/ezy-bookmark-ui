const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Checking for TypeScript and build issues...\n');

try {
  // Change to UI directory
  process.chdir('/Users/imran/Documents/code/ezy-bookmark/ui');
  
  console.log('📋 Current directory:', process.cwd());
  console.log('📦 Checking package.json...');
  
  // Check if package.json exists
  const fs = require('fs');
  if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
  } else {
    console.log('❌ package.json not found');
    process.exit(1);
  }
  
  // Run TypeScript check
  console.log('\n🔧 Running TypeScript check...');
  try {
    const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', timeout: 30000 });
    console.log('✅ TypeScript check passed');
  } catch (error) {
    console.log('❌ TypeScript errors found:');
    console.log(error.stdout || error.message);
  }
  
  // Run lint check
  console.log('\n🔍 Running lint check...');
  try {
    const lintOutput = execSync('npm run lint', { encoding: 'utf8', timeout: 30000 });
    console.log('✅ Lint check passed');
  } catch (error) {
    console.log('❌ Lint errors found:');
    console.log(error.stdout || error.message);
  }
  
  // Run build
  console.log('\n🏗️ Running build...');
  try {
    const buildOutput = execSync('npm run build', { encoding: 'utf8', timeout: 60000 });
    console.log('✅ Build successful');
  } catch (error) {
    console.log('❌ Build failed:');
    console.log(error.stdout || error.message);
  }
  
} catch (error) {
  console.error('❌ Error during checks:', error.message);
  process.exit(1);
}