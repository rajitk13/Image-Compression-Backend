const Request = require('../models/request');

const getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({ requestId }).populate({
      path: 'products',
      populate: {
        path: 'inputImages outputImages',
        model: 'Image',
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const response = {
      status: request.status,
      products: request.products.map(product => ({
        productName: product.name,
        inputImageUrls: product.inputImages.map(image => image.url),
        outputImageUrls: product.outputImages.map(image => image.url),
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getStatus };
