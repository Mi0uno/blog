import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../public/articles');
const OUTPUT_FILE = path.join(__dirname, '../public/search.json');

// Helper to recursively get all files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function generateIndex() {
  console.log('Starting search index generation...');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = getAllFiles(CONTENT_DIR);
  const searchIndex = [];

  files.forEach((filePath) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      // Skip drafts
      if (data.draft) return;

      // Generate slug from file path relative to CONTENT_DIR
      const relativePath = path.relative(CONTENT_DIR, filePath);
      // Remove extension and replace backslashes with forward slashes for URL consistency
      const slug = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\\/g, '/');

      // Create a plain text excerpt (first 200 chars) for search preview
      // Remove markdown syntax roughly
      const plainText = content
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, '$1') // Remove links but keep text
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim()
        .substring(0, 200);

      searchIndex.push({
        title: data.title || path.basename(filePath, path.extname(filePath)),
        slug: slug,
        date: data.date ? new Date(data.date).toISOString() : null,
        tags: data.tags || [],
        category: data.category || 'Uncategorized',
        description: data.description || plainText,
        path: `/articles/${slug}` // Assuming the frontend serves md files or routes this way
      });

    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
      // We don't exit process here to allow other files to be indexed
    }
  });

  // Sort by date descending
  searchIndex.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));
    console.log(`Successfully generated search index with ${searchIndex.length} entries.`);
    console.log(`Output saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error writing index file:`, error.message);
    process.exit(1);
  }
}

generateIndex();
