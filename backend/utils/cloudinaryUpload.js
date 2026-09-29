import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, resourceType) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_chunked_stream(
            {
                folder: "blog-project",
                resource_type: resourceType,
                chunk_size: 6000000
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;