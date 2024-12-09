// src/middlewares/multer.ts
import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/uploads/'); // Ruta donde se almacenan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para la imagen
  },
});


// Filtro para aceptar solo imágenes JPG, JPEG, y PNG
const fileFilter = (req: any, file: any, cb: any) => {
  // Verifica si el tipo MIME corresponde a las imágenes permitidas
  if (
    file.mimetype === 'image/jpeg' || // JPEG y JPG
    file.mimetype === 'image/png' ||  // PNG
    file.mimetype.startsWith('image/') // Cualquier otro tipo de imagen
  ) {
    cb(null, true); // Permitir el archivo
  } else {
    cb(new Error('Solo se permiten imágenes en formato JPG, JPEG o PNG.'), false); // Rechazar si no es permitido
  }
};


// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Ajusta el límite de tamaño a 10MB
});

export default upload; // Exportar el middleware
