// Prueba para verificar la normalización de rutas de archivos
const testPathNormalization = () => {
  // Simular req.file.path que viene de multer
  const mockFilePath = "dist/uploads/1733714778078-291111749-test.jpg";
  
  // Aplicar la normalización
  const normalizedPath = mockFilePath.replace(/^dist\//, '');
  
  console.log("Ruta original:", mockFilePath);
  console.log("Ruta normalizada:", normalizedPath);
  console.log("URL final:", `http://localhost:4000/${normalizedPath}`);
  
  // Verificar que sea correcta
  const expected = "uploads/1733714778078-291111749-test.jpg";
  console.log("Esperado:", expected);
  console.log("¿Correcto?", normalizedPath === expected);
};

testPathNormalization();
