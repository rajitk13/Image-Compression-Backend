const axios = require("axios");
const sharp = require("sharp");
const Image = require("../models/image");
const Product = require("../models/product");
const Request = require("../models/request");

// Import S3 client from the middleware
const s3 = require("../aws/config");

const generateUniqueFilename = () => {
  // Example using timestamp and random numbers (fixed template literals)
  return `image-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.jpg`;
};

const fetchImage = async (url, retries = 3) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying image fetch: ${url}`);
      return fetchImage(url, retries - 1);
    } else {
      throw new Error(`Failed to fetch image after multiple attempts: ${url}`);
    }
  }
};

const processImages = async (requestId) => {
  try {
    const request = await Request.findOne({ requestId }).populate("products");
    if (!request) throw new Error("Request not found");

    const products = request.products;
    for (const product of products) {
      const inputImages = await Image.find({
        _id: { $in: product.inputImages },
      });
      const outputImages = [];

      for (const inputImage of inputImages) {
        try {
          const buffer = await fetchImage(inputImage.url);
          const compressedBuffer = await sharp(buffer)
            .jpeg({ quality: 50 })
            .toBuffer();

          const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: generateUniqueFilename(), // Use generated unique filename
            Body: compressedBuffer,
            ContentType: "image/jpeg",
          };

          const signedUrl = await getSignedUrl(uploadParams);

          const uploadResult = await s3
            .upload({ ...uploadParams, UploadUrl: signedUrl })
            .promise(); // Upload with signed URL

          const outputUrl = uploadResult.Location; // Public URL from S3

          const outputImage = new Image({ url: outputUrl, type: "output" });
          await outputImage.save();
          outputImages.push(outputImage._id);
        } catch (error) {
          console.error(
            `Error processing image ${inputImage.url}:`,
            error.message
          );
          // Continue processing the remaining images
          continue;
        }
      }

      product.outputImages = outputImages;
      await product.save();
    }

    request.status = "completed";
    await request.save();
  } catch (error) {
    console.error("Error processing images:", error.message);
    const request = await Request.findOne({ requestId }).populate("products");
    request.status = "failed";
    await request.save();
  }
};

const getSignedUrl = async (params) => {


  const signedUrl = s3.getSignedUrl("putObject", {
    ...params,
  });
  return signedUrl;
};

module.exports = { processImages };
