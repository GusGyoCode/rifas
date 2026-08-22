/**
 * Convierte un archivo de imagen en formato WebP comprimido del lado del cliente
 * utilizando un elemento HTML5 Canvas.
 * 
 * @param file Archivo original de imagen (PNG, JPG, etc.)
 * @param quality Calidad de compresión (0.0 a 1.0). Por defecto 0.8 (buen equilibrio de legibilidad y peso)
 * @returns Promesa que resuelve a un nuevo objeto File en formato image/webp
 */
export const convertToWebP = (file: File, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Si el archivo no es una imagen, rechazar directamente
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo seleccionado no es una imagen válida."));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          
          // Opcional: Si la imagen es extremadamente grande, podemos limitar las dimensiones máximas
          // para optimizar aún más el tamaño sin perder legibilidad.
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.naturalWidth;
          let height = img.naturalHeight;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo inicializar el renderizador de imagen."));
            return;
          }

          // Dibujar la imagen en las nuevas dimensiones
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar a blob en formato webp
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Error al procesar el archivo WebP."));
                return;
              }

              // Nombre sin extensión original + .webp
              const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
              const webpFile = new File([blob], `${baseName}.webp`, {
                type: "image/webp",
                lastModified: Date.now(),
              });

              resolve(webpFile);
            },
            "image/webp",
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => {
        reject(new Error("Error al decodificar los datos de la imagen."));
      };
    };

    reader.onerror = (err) => {
      reject(new Error("Error al leer el archivo de origen."));
    };
  });
};
