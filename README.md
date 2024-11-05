**API Endpoints**

**Upload API**

* **Endpoint:** `/upload`
* **Method:** `POST`
* **Request Body:** CSV file containing the following columns:
    * Serial Number
    * Product Name
    * Input Image URLs (comma-separated)
    * Output Image URLs (comma-separated)
* **Response:**
    * **Success:**
        * HTTP Status Code: 201 Created
        * JSON Response:
            ```json
            {
                "requestId": "unique_request_id"
            }
            ```
    * **Failure:**
        * HTTP Status Code: 400 Bad Request or 500 Internal Server Error
        * JSON Response:
            ```json
            {
                "error": "error message"
            }
            ```

**CSV Format**

| Serial Number | Product Name | Input Image URLs                                                                             | Output Image URLs                                                                              |
|---------------|--------------|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| 1             | SKU1         | https://www.public-image-url1.jpg, https://www.public-image-url2.jpg, https://www.public-image-url3.jpg | https://www.public-image-output-url1.jpg, https://www.public-image-output-url2.jpg, https://www.public-image-output-url3.jpg |
| 2             | SKU2         | https://www.public-image-url1.jpg, https://www.public-image-url2.jpg, https://www.public-image-url3.jpg | https://www.public-image-output-url1.jpg, https://www.public-image-output-url2.jpg, https://www.public-image-output-url3.jpg |

**Tech Stack**

* Node.js
* AWS S3 Bucket
