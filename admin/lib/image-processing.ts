export function convertImageToWebp(
  file: File,
  maxDimension = 1000,
  quality = 0.82,
  namePrefix = 'image',
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.onload = (event) => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not decode the selected image.'));
      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Image processing is unavailable in this browser.'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not compress the selected image.'));
            return;
          }
          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || namePrefix;
          resolve(new File([blob], `${baseName}_${Date.now()}.webp`, { type: 'image/webp' }));
        }, 'image/webp', quality);
      };
      image.src = typeof event.target?.result === 'string' ? event.target.result : '';
    };
    reader.readAsDataURL(file);
  });
}
