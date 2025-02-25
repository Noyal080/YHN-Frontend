import Compressor from "compressorjs";
export const compressImage = (file : File ) : Promise<File> => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality : 0.5, // Adjust quality (0.1 - 1.0)
          success(result) {
            resolve(result as File);
          },
          error(err) {
            reject(err);
          },
        });
      });
}

export const compressMultiImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Compression quality (0-1)
      maxWidth: 1200, // Maximum width in pixels
      maxHeight: 1200, // Maximum height in pixels
      mimeType: "image/jpeg", // Output format
      success(result) {
        // Convert Blob to File
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
};