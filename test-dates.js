// Script de prueba para verificar que las fechas se guardan correctamente
const axios = require('axios');

async function testDates() {
  try {
    // Simulamos el endpoint para obtener entradas de un usuario
    const response = await axios.get('http://localhost:4000/api/usuarios/1/entradas');
    
    if (response.data && response.data.data) {
      console.log('📅 Prueba de fechas:');
      console.log('==================');
      
      response.data.data.forEach((entrada, index) => {
        console.log(`\nEntrada ${index + 1}:`);
        console.log(`  🎫 Código: ${entrada.code}`);
        console.log(`  📅 Fecha de creación de entrada: ${entrada.date}`);
        console.log(`  🎭 Evento: ${entrada.evento?.name || 'No disponible'}`);
        console.log(`  📅 Fecha del evento: ${entrada.evento?.date || 'No disponible'}`);
        console.log(`  ⏰ Diferencia: ${entrada.date !== entrada.evento?.date ? '✅ Fechas diferentes' : '❌ Fechas iguales'}`);
      });
    } else {
      console.log('❌ No se encontraron entradas');
    }
  } catch (error) {
    console.error('Error al probar fechas:', error.message);
  }
}

testDates();
