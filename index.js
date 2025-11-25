import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';

async function ocrFolderToText(folderPath, outputTxt) {
  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .map(f => path.join(folderPath, f));

  // Pass language ("eng") directly in createWorker
  const worker = await createWorker('eng');

  let textOutput = '';

  for (const file of files) {
    console.log('Recognizing:', file);
    const { data: { text } } = await worker.recognize(file);
    textOutput += text.trim() + '\n\n\n';
  }

  await worker.terminate();

  fs.writeFileSync(outputTxt, textOutput, 'utf8');
  console.log('Saved OCR text to:', outputTxt);
}

ocrFolderToText('images', 'ocr-results.txt')
  .catch(err => {
    console.error('Error in OCR processing:', err);
    process.exit(1);
  });
