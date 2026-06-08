const API_BASE = 'https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend';
const ASSETS_BASE = 'https://resultadosegundavuelta.onpe.gob.pe/assets';

const endpoints = {
  procesoActivo: API_BASE + '/proceso/proceso-electoral-activo',
  elecciones: API_BASE + '/proceso/3/elecciones',
  resumenTotales: API_BASE + '/resumen-general/totales?idEleccion=10&tipoFiltro=eleccion',
  resumenParticipantes: API_BASE + '/resumen-general/participantes?idEleccion=10&tipoFiltro=eleccion',
  presidencialPorUbicacion: API_BASE + '/eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion',
  mesasTotales: API_BASE + '/mesa/totales?tipoFiltro=eleccion',
  mapaCalor: API_BASE + '/resumen-general/mapa-calor?idEleccion=10&tipoFiltro=total',
  departamentos: API_BASE + '/ubigeos/departamentos?idEleccion=10&idAmbitoGeografico=1',
  mesasAmbito: API_BASE + '/mesa/totales?tipoFiltro=ambito_geografico&listRegiones=TODOS,PER%C3%9A,EXTRANJERO&ambitoGeografico=1',
  presidencialPorAmbito: API_BASE + '/eleccion-presidencial/participantes-ubicacion-geografica-nombre?tipoFiltro=ambito_geografico&idAmbitoGeografico=1&listRegiones=TODOS,PER%C3%9A,EXTRANJERO&idEleccion=10',
  resumenTotalesAmbito: API_BASE + '/resumen-general/totales?idAmbitoGeografico=1&idEleccion=10&tipoFiltro=ambito_geografico',
  mapaCalorAmbito: API_BASE + '/resumen-general/mapa-calor?idAmbitoGeografico=1&idEleccion=10&tipoFiltro=ambito_geografico',
  presidencialPorOrganizacion: API_BASE + '/eleccion-presidencial/participantes-organizacion-politica?idEleccion=10&tipoFiltro=eleccion',
  geodataPeru: ASSETS_BASE + '/lib/amcharts5/geodata/json/peruLow.json',
  geodataContinental: ASSETS_BASE + '/lib/amcharts5/geodata/json/continental_total.json'
};

module.exports = { endpoints };
