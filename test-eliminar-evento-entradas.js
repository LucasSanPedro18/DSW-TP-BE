// Script de prueba para eliminar evento con entradas
import 'reflect-metadata';
import { orm } from './src/shared/db/orm.js';
import { Evento } from './src/evento/evento.entity.js';
import { Entrada } from './src/entrada/entrada.entity.js';

async function testEventoElimination() {
  try {
    console.log('🔍 Probando eliminación de evento con entradas...');
    
    const em = orm.em.fork();
    
    // Buscar todos los eventos con sus entradas
    const eventos = await em.find(
      Evento, 
      {}, 
      { populate: ['entradas', 'organizador'] }
    );
    
    console.log(`📊 Total de eventos en base de datos: ${eventos.length}`);
    
    // Buscar un evento que tenga entradas
    const eventoConEntradas = eventos.find(evento => evento.entradas.length > 0);
    
    if (!eventoConEntradas) {
      console.log('❌ No se encontró ningún evento con entradas para probar');
      
      // Mostrar todos los eventos
      console.log('📋 Eventos disponibles:');
      eventos.forEach(evento => {
        console.log(`  - ID: ${evento.id}, Nombre: "${evento.name}", Entradas: ${evento.entradas.length}`);
      });
      
      return;
    }
    
    console.log(`🎯 Evento seleccionado: "${eventoConEntradas.name}" (ID: ${eventoConEntradas.id})`);
    console.log(`🎫 Entradas asociadas: ${eventoConEntradas.entradas.length}`);
    console.log(`👤 Organizador: ${eventoConEntradas.organizador.nickname}`);
    
    // Contar entradas totales antes de eliminar
    const entradasAntes = await em.count(Entrada);
    console.log(`📊 Total de entradas en base de datos antes: ${entradasAntes}`);
    
    // NOTA: Este script solo muestra información, no elimina realmente
    // Para probar la eliminación real, descomenta las siguientes líneas:
    
    /*
    console.log('🗑️ Procediendo a eliminar el evento...');
    
    // Eliminar el evento (debe eliminar las entradas automáticamente)
    await em.removeAndFlush(eventoConEntradas);
    
    // Contar entradas después de eliminar
    const entradasDespues = await em.count(Entrada);
    console.log(`📊 Total de entradas en base de datos después: ${entradasDespues}`);
    console.log(`✅ Entradas eliminadas: ${entradasAntes - entradasDespues}`);
    
    console.log('✅ Eliminación completada exitosamente');
    */
    
    console.log('ℹ️ Script en modo de solo lectura - descomenta el código para eliminar realmente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await orm.close();
  }
}

// Ejecutar el script
testEventoElimination();
