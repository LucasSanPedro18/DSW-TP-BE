// src/middlewares/multer.ts
import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se almacenan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para la imagen
  },
});


// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Permitir solo imágenes
  } else {
    cb(new Error('Solo se permiten imágenes.'), false); // Rechazar si no es imagen
  }
};  

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Ajusta el límite de tamaño a 10MB
});

export default upload; // Exportar el middleware
