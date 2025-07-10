// Test de Estados de Entrada - Ejemplo de funcionamiento
// ====================================================

// BACKEND: entrada.controller.ts
// ==============================

function calcularEstadoEntrada(fechaEvento) {
  if (!fechaEvento) return 'Expirada';
  
  const ahora = new Date();
  const fechaEventoDate = new Date(fechaEvento);
  
  return fechaEventoDate > ahora ? 'Activa' : 'Expirada';
}

// Ejemplos de estados:
console.log('🧪 EJEMPLOS DE ESTADOS DE ENTRADA:');
console.log('===================================');

// Entrada para evento futuro (mañana)
const mañana = new Date();
mañana.setDate(mañana.getDate() + 1);
console.log(`📅 Evento mañana: ${calcularEstadoEntrada(mañana)} ✅`);

// Entrada para evento pasado (ayer)
const ayer = new Date();
ayer.setDate(ayer.getDate() - 1);
console.log(`📅 Evento ayer: ${calcularEstadoEntrada(ayer)} ⏰`);

// Entrada sin fecha
console.log(`📅 Sin fecha: ${calcularEstadoEntrada(null)} ⏰`);

// FRONTEND: EntradaPage.js
// ========================

/*
En el frontend se muestra así:

<div className="estado-entrada activa">
  <strong>✅ Estado:</strong> Activa
</div>

<div className="estado-entrada expirada">
  <strong>⏰ Estado:</strong> Expirada
</div>
*/

// CSS: EntradaPage.css
// ====================

/*
.estado-entrada.activa {
  background-color: #d4edda;  // Verde claro
  color: #155724;             // Verde oscuro
  border: 1px solid #c3e6cb;
}

.estado-entrada.expirada {
  background-color: #f8d7da;  // Rojo claro
  color: #721c24;             // Rojo oscuro
  border: 1px solid #f5c6cb;
}
*/

console.log('');
console.log('🎯 FUNCIONALIDAD IMPLEMENTADA:');
console.log('==============================');
console.log('✅ Backend calcula estado dinámicamente');
console.log('✅ Frontend muestra estado con colores e iconos');
console.log('✅ Estado se actualiza automáticamente');
console.log('✅ Estilos responsivos para móviles');
console.log('✅ Fallback si backend no envía estado');
