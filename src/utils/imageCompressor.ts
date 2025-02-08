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