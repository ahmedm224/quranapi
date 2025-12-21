/**
 * Script to download Quran SVG pages from github.com/batoulapps/quran-svg
 *
 * Usage: node scripts/download-quran-svg.js
 *
 * This will download all 604 pages to: quran-text/pages/
 * And create a ZIP file at: quran-text/quran-pages.zip
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOTAL_PAGES = 604;
const BASE_URL = 'https://raw.githubusercontent.com/batoulapps/quran-svg/main/svg';
const OUTPUT_DIR = path.join(__dirname, '..', 'quran-text', 'pages');
const ZIP_OUTPUT = path.join(__dirname, '..', 'quran-text', 'quran-pages.zip');

// Create output directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Download a single file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

// Download with retry
async function downloadWithRetry(url, dest, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await downloadFile(url, dest);
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`  Retry ${i + 1}/${retries}...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

// Main download function
async function downloadAllPages() {
  console.log('='.repeat(50));
  console.log('Quran SVG Downloader');
  console.log('Source: https://github.com/batoulapps/quran-svg');
  console.log('='.repeat(50));
  console.log('');

  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);

  const startTime = Date.now();
  let downloaded = 0;
  let skipped = 0;
  let failed = [];

  console.log(`Downloading ${TOTAL_PAGES} SVG pages...`);
  console.log('');

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    // The original repo uses format like "001.svg", "002.svg", etc.
    const sourceFileName = `${String(page).padStart(3, '0')}.svg`;
    const url = `${BASE_URL}/${sourceFileName}`;

    // We save as "1.svg", "2.svg", etc. for simpler API
    const destFileName = `${page}.svg`;
    const destPath = path.join(OUTPUT_DIR, destFileName);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 0) {
        skipped++;
        process.stdout.write(`\r[${page}/${TOTAL_PAGES}] Skipped (exists): ${destFileName}`);
        continue;
      }
    }

    try {
      process.stdout.write(`\r[${page}/${TOTAL_PAGES}] Downloading: ${destFileName}...    `);
      await downloadWithRetry(url, destPath);
      downloaded++;
    } catch (err) {
      failed.push({ page, error: err.message });
      console.log(`\n  Error downloading page ${page}: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    if (page % 10 === 0) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('\n');
  console.log('='.repeat(50));
  console.log('Download Complete!');
  console.log('='.repeat(50));
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed pages:');
    failed.forEach(f => console.log(`  - Page ${f.page}: ${f.error}`));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nTime: ${duration}s`);
  console.log(`Output: ${OUTPUT_DIR}`);

  return failed.length === 0;
}

// Create ZIP file
async function createZip() {
  console.log('\n');
  console.log('Creating ZIP file...');

  const pagesDir = OUTPUT_DIR;
  const zipPath = ZIP_OUTPUT;

  // Check if pages exist
  if (!fs.existsSync(pagesDir)) {
    console.log('Error: Pages directory not found. Run download first.');
    return false;
  }

  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.svg'));
  if (files.length === 0) {
    console.log('Error: No SVG files found.');
    return false;
  }

  console.log(`Found ${files.length} SVG files`);

  try {
    // Try using PowerShell on Windows
    const parentDir = path.dirname(pagesDir);
    const pagesFolder = path.basename(pagesDir);

    // Change to parent directory and zip the pages folder
    process.chdir(parentDir);

    if (process.platform === 'win32') {
      // PowerShell command for Windows
      execSync(`powershell -Command "Compress-Archive -Path '${pagesFolder}\\*' -DestinationPath '${path.basename(zipPath)}' -Force"`, {
        stdio: 'inherit'
      });
    } else {
      // Unix zip command
      execSync(`zip -r "${zipPath}" "${pagesFolder}"`, {
        stdio: 'inherit'
      });
    }

    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`\nZIP created: ${zipPath}`);
      console.log(`Size: ${sizeMB} MB`);
      return true;
    }
  } catch (err) {
    console.log(`Error creating ZIP: ${err.message}`);
    console.log('\nYou can manually create the ZIP file:');
    console.log(`  - Windows: Right-click on "quran-text/pages" folder -> Send to -> Compressed (zipped) folder`);
    console.log(`  - Linux/Mac: cd quran-text && zip -r quran-pages.zip pages/`);
  }

  return false;
}

// Upload instructions
function printUploadInstructions() {
  console.log('\n');
  console.log('='.repeat(50));
  console.log('UPLOAD TO R2');
  console.log('='.repeat(50));
  console.log('');
  console.log('Option 1: Upload individual pages');
  console.log('  npx wrangler r2 object put alfurqan/quran-text/pages/1.svg --file="quran-text/pages/1.svg"');
  console.log('');
  console.log('Option 2: Upload all pages (run in PowerShell):');
  console.log('  Get-ChildItem "quran-text/pages/*.svg" | ForEach-Object { npx wrangler r2 object put "alfurqan/quran-text/pages/$($_.Name)" --file="$($_.FullName)" }');
  console.log('');
  console.log('Option 3: Upload ZIP for bulk download:');
  console.log('  npx wrangler r2 object put alfurqan/quran-text/quran-pages.zip --file="quran-text/quran-pages.zip"');
  console.log('');
  console.log('Option 4: Use Cloudflare Dashboard');
  console.log('  1. Go to R2 > alfurqan bucket');
  console.log('  2. Create folder "quran-text/pages"');
  console.log('  3. Upload all SVG files');
  console.log('');
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/download-quran-svg.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --download    Download SVG files only');
    console.log('  --zip         Create ZIP file only (requires downloaded files)');
    console.log('  --help, -h    Show this help');
    console.log('');
    console.log('Without options, downloads files and creates ZIP.');
    return;
  }

  const downloadOnly = args.includes('--download');
  const zipOnly = args.includes('--zip');

  if (!zipOnly) {
    await downloadAllPages();
  }

  if (!downloadOnly) {
    await createZip();
  }

  printUploadInstructions();
}

main().catch(console.error);
