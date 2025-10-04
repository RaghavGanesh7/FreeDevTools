// sitemap-checker-pdf-summary.cjs
const axios = require("axios");
const cheerio = require("cheerio");
const { parseStringPromise } = require("xml2js");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const pLimit = require("p-limit"); // ensure v3 for CommonJS

const sitemapUrl = process.argv[2];
const concurrency = parseInt(process.argv[3] || "20"); // default 20 concurrent requests

if (!sitemapUrl) {
  console.error("Usage: node sitemap-checker-pdf-summary.cjs <sitemap-url> [concurrency]");
  process.exit(1);
}

// derive pdf name
function getPdfName(url) {
  const pathPart = url.replace(/^https?:\/\//, '').replace(/\//g, '-').replace(/-sitemap\.xml$/, '');
  return `sitemap_report-${pathPart}-sitemap.pdf`;
}

async function fetchText(url) {
  try {
    return await axios.get(url, { timeout: 15000, validateStatus: () => true });
  } catch (err) {
    return null;
  }
}

async function validateCanonical(url) {
  try {
    const res = await axios.head(url, { timeout: 10000, validateStatus: () => true });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function checkUrl(url, seenHashes) {
  let status = "";
  let issues = [];
  let indexable = "Yes";

  try {
    const res = await fetchText(url);
    if (!res) {
      status = "Error";
      indexable = "No";
      issues.push("Fetch failed");
      return { url, status, indexable, issues: issues.join("; ") };
    }

    status = res.status;

    if ([301, 302, 307, 308].includes(status)) {
      indexable = "No";
      issues.push(`Redirect -> ${res.headers.location || "unknown"}`);
    }

    if (status >= 500) {
      indexable = "No";
      issues.push("Server error (5xx)");
    }

    if (status === 404) {
      indexable = "No";
      issues.push("Not found (404)");
    }

    if (status === 200 && res.headers["content-type"]?.includes("text/html")) {
      const $ = cheerio.load(res.data);

      const metaRobots = $('meta[name="robots"]').attr("content");
      if (metaRobots && metaRobots.toLowerCase().includes("noindex")) {
        indexable = "No";
        issues.push("Noindex tag");
      }

      const canonical = $('link[rel="canonical"]').attr("href");
      if (canonical && canonical !== url) {
        const valid = await validateCanonical(canonical);
        if (!valid) {
          issues.push(`Canonical -> ${canonical} (INVALID)`);
          indexable = "No";
        } else {
          issues.push(`Canonical -> ${canonical}`);
        }
      }

      const bodyText = $("body").text().trim();
      if (bodyText.length < 200 || /not found|error 404/i.test(bodyText)) {
        indexable = "No";
        issues.push("Soft 404 suspected");
      }

      const hash = crypto
        .createHash("md5")
        .update($("title").text() + bodyText.slice(0, 500))
        .digest("hex");

      if (seenHashes.has(hash)) {
        indexable = "No";
        issues.push(`Duplicate of ${seenHashes.get(hash)}`);
      } else {
        seenHashes.set(hash, url);
      }
    }
  } catch (err) {
    status = "Error";
    indexable = "No";
    issues.push("Fetch failed");
  }

  return { url, status, indexable, issues: issues.join("; ") };
}

async function main() {
  console.log(`Loading sitemap: ${sitemapUrl}`);
  const sitemapXml = await axios.get(sitemapUrl).then(r => r.data).catch(() => null);
  if (!sitemapXml) throw new Error("Failed to load sitemap");

  const parsed = await parseStringPromise(sitemapXml);
  const urls = [];

  if (parsed.urlset && parsed.urlset.url) {
    parsed.urlset.url.forEach(u => urls.push(u.loc[0]));
  } else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    for (const sm of parsed.sitemapindex.sitemap) {
      const sub = await axios.get(sm.loc[0]).then(r => r.data).catch(() => null);
      if (!sub) continue;
      const subParsed = await parseStringPromise(sub);
      subParsed.urlset.url.forEach(u => urls.push(u.loc[0]));
    }
  }

  console.log(`Total URLs to check: ${urls.length}`);

  const limit = pLimit(concurrency);
  const seenHashes = new Map();
  const results = await Promise.all(
    urls.map(url => limit(() => checkUrl(url, seenHashes)))
  );

  results.sort((a, b) => {
    if (a.indexable === "No" && b.indexable === "Yes") return -1;
    if (a.indexable === "Yes" && b.indexable === "No") return 1;
    return 0;
  });

  const pdfName = getPdfName(sitemapUrl);
  generatePDF(results, pdfName);
}

function generatePDF(results, pdfName) {
    const doc = new PDFDocument({ margin: 20, size: 'A4', layout: 'portrait' });
    doc.pipe(fs.createWriteStream(pdfName));
  
    // --- Summary Page ---
    const total = results.length;
    const failed = results.filter(r => r.indexable === "No").length;
    const passed = total - failed;
    const percentPassed = ((passed / total) * 100).toFixed(2);
    const percentFailed = ((failed / total) * 100).toFixed(2);
  
    doc.fontSize(20).text('Sitemap Indexability Report', { align: 'center' });
    doc.moveDown(2);
  
    // Summary table
    const tableCols = [
      { header: 'Metric', width: 200 },
      { header: 'Count', width: 100 },
      { header: 'Percentage', width: 100 },
    ];
    const rowHeight = 40;
    const startX = 100;
    let y = doc.y;
  
    // Draw table header
    let x = startX;
    doc.fontSize(12).fillColor('white').font('Helvetica-Bold');
    tableCols.forEach(col => {
      doc.rect(x, y, col.width, rowHeight).fill('#333').stroke('black');
      doc.fillColor('white').text(col.header, x + 5, y + 12, { width: col.width - 10 });
      x += col.width;
    });
  
    y += rowHeight;
  
    // Draw summary rows
    const summaryRows = [
      { Metric: 'Total URLs tested', Count: total, Percentage: '100%' },
      { Metric: 'Passed (indexable)', Count: passed, Percentage: `${percentPassed}%` },
      { Metric: 'Failed (non-indexable)', Count: failed, Percentage: `${percentFailed}%` },
    ];
  
    doc.font('Helvetica').fillColor('black');
    summaryRows.forEach(row => {
      x = startX;
      const fillColor = row.Metric.includes('Failed') ? '#f8d9d9' : '#d9f0d9';
  
      tableCols.forEach(col => {
        doc.rect(x, y, col.width, rowHeight).fill(fillColor).stroke('black');
        x += col.width;
      });
  
      x = startX;
      doc.fillColor('black')
        .text(row.Metric, x + 5, y + 12, { width: tableCols[0].width - 10 });
      x += tableCols[0].width;
      doc.text(row.Count.toString(), x + 5, y + 12, { width: tableCols[1].width - 10 });
      x += tableCols[1].width;
      doc.text(row.Percentage, x + 5, y + 12, { width: tableCols[2].width - 10 });
  
      y += rowHeight;
    });
  
    doc.addPage();
  
    // --- Detailed URLs Table ---
    const cols = [
      { header: 'URL', width: 220 },
      { header: 'Status', width: 60 },
      { header: 'Indexable', width: 60 },
      { header: 'Issues', width: 200 }
    ];
    const rowHeightDetail = 40;
    y = doc.y;
  
    let xDetail = 20;
    doc.fontSize(10).fillColor('white').font('Helvetica-Bold');
    cols.forEach(col => {
      doc.rect(xDetail, y, col.width, rowHeightDetail).fill('#333').stroke('black');
      doc.fillColor('white').text(col.header, xDetail + 5, y + 12, { width: col.width - 10 });
      xDetail += col.width;
    });
  
    y += rowHeightDetail;
    doc.font('Helvetica').fillColor('black');
  
    results.forEach(r => {
      xDetail = 20;
      const fillColor = r.indexable === "Yes" ? '#d9f0d9' : '#f8d9d9';
  
      cols.forEach(col => {
        doc.rect(xDetail, y, col.width, rowHeightDetail).fill(fillColor).stroke('black');
        xDetail += col.width;
      });
  
      xDetail = 20;
      doc.fillColor('black')
        .text(r.url, xDetail + 5, y + 12, { width: cols[0].width - 10, ellipsis: true });
      xDetail += cols[0].width;
      doc.text(r.status, xDetail + 5, y + 12, { width: cols[1].width - 10 });
      xDetail += cols[1].width;
      doc.text(r.indexable, xDetail + 5, y + 12, { width: cols[2].width - 10 });
      xDetail += cols[2].width;
      doc.text(r.issues, xDetail + 5, y + 12, { width: cols[3].width - 10, ellipsis: true });
  
      y += rowHeightDetail;
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }
    });
  
    doc.end();
    console.log(`✅ PDF report saved as ${pdfName}`);
  }
  

main().catch(err => {
  console.error(err);
  process.exit(1);
});
