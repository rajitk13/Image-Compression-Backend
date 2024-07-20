const { validateCSV } = require("../utils/csvValidator");
const { generateRequestID } = require("../utils/requestIDGenerator");
const Request = require("../models/request");
const Product = require("../models/product");
const Image = require("../models/image");
const { processImages } = require("../services/imageProcessingService");

const uploadCSV = async (req, res) => {
  try {
    const csvData = req.file.buffer.toString();
    const { isValid, data, error } = await validateCSV(csvData);
    console.log(data);

    if (!isValid) {
      return res.status(400).json({ error });
    }

    const requestId = generateRequestID();
    const request = new Request({ requestId, status: "pending" });
    await request.save();

    for (const row of data) {
      const product = new Product({ name: row["productName"] });
      const inputImageUrls = row["inputImageUrls"];

      const inputImages = await Promise.all(
        inputImageUrls.map(async (url) => {
          const image = new Image({ url, type: "input" });
          await image.save();
          return image;
        })
      );

      product.inputImages = inputImages.map((image) => image._id);
      await product.save();

      request.products.push(product._id);
    }

    await request.save();
    processImages(requestId);

    res.status(200).json({ requestId });
  } catch (err) {
    console.error("Error in uploadCSV:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadCSV };
