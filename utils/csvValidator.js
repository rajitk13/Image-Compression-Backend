const csv = require('csv-parser');
const { Readable } = require('stream');

const validateCSV = async (csvData) => {
  const dataMap = new Map();
  let isValid = true;
  let error = "";

  return new Promise((resolve) => {
    const stream = Readable.from(csvData);

    stream
      .pipe(csv())
      .on('data', (row) => {
        const serialNo = row['S. No.'];
        const productName = row['Product Name'];
        const inputImageUrls = row['Input Image Urls'];

        // Convert comma-separated URLs into an array
        const imageUrlsArray = inputImageUrls
          .split(',')
          .map((url) => url.trim());

        // Aggregate URLs for the same serialNo
        if (!dataMap.has(serialNo)) {
          dataMap.set(serialNo, {
            serialNo,
            productName,
            inputImageUrls: imageUrlsArray
          });
        } else {
          const existingProduct = dataMap.get(serialNo);
          existingProduct.inputImageUrls.push(...imageUrlsArray);
          // Optional: Remove duplicates if needed
          existingProduct.inputImageUrls = [...new Set(existingProduct.inputImageUrls)];
        }
      })
      .on('end', () => {
        if (dataMap.size === 0) {
          isValid = false;
          error = 'CSV is empty or invalid format';
        }
        resolve({ isValid, data: Array.from(dataMap.values()), error });
      })
      .on('error', (err) => {
        isValid = false;
        error = err.message;
        resolve({ isValid, data: [], error });
      });
  });
};

module.exports = { validateCSV };
