// Genera el contenido de demostración de la revista (noticias ficticias
// pero realistas, centradas en transporte y comunicaciones del Perú) como
// un archivo JSON por noticia en /content/articles.
//
// Ejecutar: node scripts/seed-content.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
fs.rmSync(ARTICLES_DIR, { recursive: true, force: true });
fs.mkdirSync(ARTICLES_DIR, { recursive: true });

const AUTORES = [
  "Redacción",
  "Laura Medina",
  "Carlos Iñarra",
  "Sofía Vega",
  "Daniel Roth",
];

function p(id, slug, title, data) {
  return {
    id,
    slug,
    title,
    status: "published",
    demo: true,
    ...data,
  };
}

const A = [
  // ---------------------------------------------------------------
  // TRANSPORTE (terrestre y ferroviario)
  // ---------------------------------------------------------------
  p("art-001", "linea-2-metro-lima-nuevo-tramo",
    "La Línea 2 del Metro de Lima activa un nuevo tramo entre San Juan de Lurigancho y el Cercado",
    {
      subtitle: "El tren subterráneo reduce a 25 minutos un trayecto que hoy toma más de 90 en superficie",
      excerpt:
        "El nuevo tramo de la Línea 2 del Metro de Lima y Callao entra en operación comercial, conectando San Juan de Lurigancho con el centro de Lima en un cuarto del tiempo actual.",
      content:
        "La Línea 2 del Metro de Lima y Callao ha activado un nuevo tramo subterráneo que conecta San Juan de Lurigancho con el Cercado de Lima, reduciendo un trayecto que hoy toma más de 90 minutos en superficie a apenas 25 minutos bajo tierra.\n\nEl tramo, operado por el concesionario a cargo del proyecto bajo supervisión de la Autoridad Autónoma del Sistema Eléctrico de Transporte Masivo de Lima y Callao (AATE), incorpora tres nuevas estaciones intermodales que conectan con el Metropolitano y con corredores complementarios de buses.\n\n\"Esta es una de las obras de infraestructura de transporte más esperadas por los limeños de los últimos veinte años\", señaló un vocero del Ministerio de Transportes y Comunicaciones (MTC) durante la inauguración del tramo.\n\nSe estima que el nuevo tramo beneficiará de forma directa a más de 300.000 habitantes de San Juan de Lurigancho, uno de los distritos más poblados de Lima Metropolitana y con menor cobertura de transporte masivo hasta la fecha.\n\nLa obra continuará su expansión hacia el Callao en las siguientes fases del proyecto, con el objetivo de completar los 27 kilómetros totales previstos para la Línea 2 en los próximos años.",
      category: "transporte",
      date: "2026-09-30",
      author: AUTORES[0],
      tags: ["Metro de Lima", "Ferrocarriles", "Movilidad urbana", "MTC"],
      featured: true,
    }),

  p("art-002", "panamericana-sur-ampliacion-carriles",
    "MTC inicia la ampliación a tres carriles por sentido de la Panamericana Sur",
    {
      subtitle: "El tramo entre Lima y Cañete concentra el mayor flujo de carga del sur del país",
      excerpt:
        "Las obras de ampliación de la Panamericana Sur buscan reducir la congestión y la siniestralidad en uno de los corredores de carga más transitados del Perú.",
      content:
        "El Ministerio de Transportes y Comunicaciones (MTC) ha dado inicio a las obras de ampliación a tres carriles por sentido del tramo de la Panamericana Sur entre Lima y Cañete, uno de los corredores viales con mayor flujo de carga y transporte interprovincial del país.\n\nLa obra, ejecutada bajo la modalidad de contrato de concesión vial, contempla la construcción de intercambios viales a desnivel en los puntos de mayor accidentalidad, además de puentes peatonales y ciclovías en los tramos urbanos que atraviesa la vía.\n\nSegún cifras del propio MTC, el tramo registra un tránsito diario superior a los 45.000 vehículos, una cifra que ha crecido de forma sostenida en la última década impulsada por el desarrollo industrial y agroexportador del sur chico.\n\nLa ampliación busca además reducir los índices de siniestralidad vial, que en este tramo se encuentran entre los más altos de la red vial nacional según reportes de la Policía de Tránsito.\n\nSe estima que las obras concluyan en un plazo de 30 meses, con trabajos nocturnos en los tramos de mayor tránsito para minimizar el impacto sobre los usuarios durante la ejecución.",
      category: "transporte",
      date: "2026-09-21",
      author: AUTORES[1],
      tags: ["Carreteras", "Panamericana", "MTC", "Logística"],
      featured: false,
    }),

  p("art-003", "metropolitano-flota-electrica-busway",
    "El Metropolitano incorpora sus primeros 50 buses eléctricos en el corredor del Busway",
    {
      subtitle: "La renovación de flota forma parte del plan de electrificación del transporte público de Lima",
      excerpt:
        "Los nuevos buses eléctricos del Metropolitano reducirán el ruido y las emisiones en uno de los corredores de transporte masivo más utilizados de Lima.",
      content:
        "El sistema de transporte masivo Metropolitano ha incorporado sus primeros 50 buses eléctricos al corredor del Busway, que conecta el norte y el sur de Lima a lo largo de 33 kilómetros de vía exclusiva.\n\nLos nuevos vehículos cuentan con autonomía suficiente para cubrir una jornada completa de operación y se cargan durante la noche en el patio de la estación Naranjal, al norte de la ciudad, donde se ha instalado la infraestructura de carga necesaria.\n\nLa Autoridad de Transporte Urbano para Lima y Callao (ATU) señaló que la incorporación de buses eléctricos permitirá reducir de forma significativa el ruido y las emisiones contaminantes en un corredor que moviliza a más de 700.000 pasajeros diarios.\n\nEl plan contempla la renovación progresiva del resto de la flota del Metropolitano en los próximos cinco años, en línea con la meta nacional de transporte público con bajas emisiones.\n\nLos usuarios han reportado, además de la reducción de ruido, una mejora notable en la suavidad del viaje respecto a los buses diésel que los nuevos vehículos sustituyen.",
      category: "transporte",
      date: "2026-09-10",
      author: AUTORES[2],
      tags: ["Movilidad urbana", "Vehículos eléctricos", "Transporte público", "Lima"],
      featured: false,
    }),

  p("art-004", "tren-cercanias-lima-barranca-estudio",
    "Avanza el estudio de factibilidad para un tren de cercanías entre Lima y Barranca",
    {
      subtitle: "El proyecto evalúa aprovechar el corredor ferroviario histórico del norte chico",
      excerpt:
        "El MTC encarga un estudio de factibilidad para un servicio ferroviario de pasajeros que conectaría Lima con la provincia de Barranca en poco más de una hora.",
      content:
        "El Ministerio de Transportes y Comunicaciones ha encargado un estudio de factibilidad para evaluar la puesta en marcha de un servicio de tren de cercanías entre Lima y la provincia de Barranca, aprovechando parte del trazado ferroviario histórico del norte chico.\n\nEl estudio, que estará listo en un plazo de ocho meses, analizará la demanda potencial, el estado de la infraestructura existente y los requerimientos de inversión para habilitar un servicio de pasajeros moderno en este corredor.\n\nDe concretarse, el proyecto permitiría conectar Lima con Barranca en poco más de una hora, frente a las casi tres horas que toma actualmente el trayecto por la Panamericana Norte en condiciones normales de tráfico.\n\nAutoridades locales de la región Lima han expresado su respaldo a la iniciativa, señalando el potencial del proyecto para descongestionar la Panamericana Norte y dinamizar la economía de las provincias del norte chico.\n\nEl MTC ha indicado que, de resultar viable, el proyecto se licitaría bajo la modalidad de asociación público-privada, siguiendo el modelo empleado en otros corredores ferroviarios del país.",
      category: "transporte",
      date: "2026-09-02",
      author: AUTORES[3],
      tags: ["Ferrocarriles", "MTC", "Movilidad", "Proyectos"],
      featured: false,
    }),

  // ---------------------------------------------------------------
  // AEROPUERTOS (transporte aéreo)
  // ---------------------------------------------------------------
  p("art-005", "jorge-chavez-nueva-terminal-inauguracion",
    "El Aeropuerto Jorge Chávez inaugura su nueva terminal y segunda pista de aterrizaje",
    {
      subtitle: "La ampliación triplica la capacidad del principal aeropuerto del Perú",
      excerpt:
        "Lima Airport Partners pone en operación la nueva terminal y la segunda pista del Jorge Chávez, consolidando al aeropuerto como uno de los principales hubs de Sudamérica.",
      content:
        "El Aeropuerto Internacional Jorge Chávez ha inaugurado oficialmente su nueva terminal de pasajeros y su segunda pista de aterrizaje, en el marco del plan de ampliación ejecutado por el concesionario Lima Airport Partners (LAP).\n\nLa nueva infraestructura triplica la capacidad operativa del aeropuerto, que podrá atender hasta 40 millones de pasajeros al año, consolidando a Lima como uno de los principales hubs de conexión aérea de Sudamérica.\n\nLa segunda pista, de 3.500 metros de longitud, permite operaciones simultáneas de despegue y aterrizaje, reduciendo significativamente los tiempos de espera que se habían vuelto frecuentes en los últimos años por la saturación de la pista única.\n\nEl Ministerio de Transportes y Comunicaciones destacó que la ampliación posiciona al Perú como punto de conexión estratégico entre Norteamérica, Sudamérica y Asia-Pacífico, en línea con el crecimiento sostenido del tráfico aéreo de pasajeros y carga en la región.\n\nLa nueva terminal incorpora además un área de carga aérea ampliada, clave para las exportaciones agroindustriales peruanas que dependen del transporte aéreo para llegar en óptimas condiciones a mercados internacionales.",
      category: "aeropuertos",
      date: "2026-09-28",
      author: AUTORES[0],
      tags: ["Jorge Chávez", "Aeropuertos", "Aviación", "MTC"],
      featured: true,
    }),

  p("art-006", "aeropuerto-chinchero-cusco-avance-obras",
    "Las obras del Aeropuerto Internacional de Chinchero en Cusco alcanzan el 70% de avance",
    {
      subtitle: "El nuevo terminal busca descongestionar el actual aeropuerto de Alejandro Velasco Astete",
      excerpt:
        "El aeropuerto de Chinchero permitirá operar vuelos internacionales directos hacia Cusco, hoy limitados por las condiciones del aeropuerto actual.",
      content:
        "Las obras de construcción del nuevo Aeropuerto Internacional de Chinchero, en la región Cusco, han alcanzado el 70% de avance físico, según el reporte más reciente del concesionario a cargo del proyecto.\n\nEl nuevo terminal, ubicado a mayor altitud que el actual aeropuerto Alejandro Velasco Astete, ha sido diseñado para operar con aeronaves de mayor capacidad y permitir, por primera vez, vuelos internacionales directos hacia uno de los destinos turísticos más visitados de Sudamérica.\n\nEl proyecto ha enfrentado en el pasado observaciones relacionadas con el impacto ambiental y arqueológico de la zona, que han sido atendidas mediante planes de mitigación supervisados por el Ministerio de Cultura y la autoridad ambiental competente.\n\nEl gobierno regional de Cusco ha señalado que el nuevo aeropuerto podría incrementar en más de 40% la llegada de turistas internacionales a la región durante sus primeros cinco años de operación.\n\nSe estima que el aeropuerto entre en operación comercial en los próximos dos años, una vez concluidas las pruebas de certificación aeronáutica correspondientes.",
      category: "aeropuertos",
      date: "2026-09-15",
      author: AUTORES[1],
      tags: ["Aeropuertos", "Cusco", "Turismo", "Aviación"],
      featured: false,
    }),

  p("art-007", "aerolinea-low-cost-nuevas-rutas-regionales",
    "Una nueva aerolínea de bajo costo anuncia seis rutas regionales adicionales en el Perú",
    {
      subtitle: "La operadora busca conectar ciudades intermedias hoy dependientes del transporte terrestre",
      excerpt:
        "La ampliación de rutas regionales busca ofrecer alternativas de transporte aéreo accesibles para ciudades del interior del país.",
      content:
        "Una aerolínea de bajo costo que opera en el mercado peruano ha anunciado la apertura de seis nuevas rutas regionales, conectando ciudades intermedias que hasta ahora dependían casi exclusivamente del transporte terrestre interprovincial.\n\nLas nuevas rutas conectarán ciudades del norte y sur del país con Lima, con tarifas promocionales de lanzamiento que buscan incentivar el uso del transporte aéreo frente a trayectos terrestres de ocho a doce horas.\n\nLa Dirección General de Aeronáutica Civil (DGAC) del MTC ha señalado que el crecimiento de rutas regionales de bajo costo ha sido uno de los principales motores de la recuperación del tráfico aéreo doméstico en los últimos años.\n\nLa operadora indicó que las nuevas frecuencias comenzarán de forma gradual, con tres vuelos semanales por ruta que podrían ampliarse según la demanda observada en los primeros meses de operación.\n\nGremios de turismo regional han celebrado el anuncio, señalando el potencial impacto positivo en la conectividad y el desarrollo económico de las ciudades beneficiadas.",
      category: "aeropuertos",
      date: "2026-09-05",
      author: AUTORES[2],
      tags: ["Aviación", "Aeropuertos", "Conectividad regional"],
      featured: false,
    }),

  p("art-008", "aeropuertos-regionales-modernizacion-programa",
    "El MTC anuncia la modernización de doce aeropuertos regionales hacia 2028",
    {
      subtitle: "El plan prioriza terminales en regiones con alto potencial turístico y de carga",
      excerpt:
        "El programa de modernización aeroportuaria regional busca ampliar pistas, terminales y sistemas de navegación en doce aeropuertos del interior del país.",
      content:
        "El Ministerio de Transportes y Comunicaciones ha presentado un programa de modernización que contempla la ampliación y mejora de doce aeropuertos regionales hacia el año 2028, priorizando terminales en regiones con alto potencial turístico y de carga agroexportadora.\n\nEl plan incluye la ampliación de pistas de aterrizaje para permitir la operación de aeronaves de mayor capacidad, la modernización de sistemas de navegación aérea y la construcción de nuevas terminales de pasajeros en varios aeropuertos del interior.\n\nEntre los aeropuertos priorizados se encuentran terminales de las regiones norte y sur del país, seleccionados en función de su crecimiento de tráfico de pasajeros y su rol estratégico para la conectividad nacional.\n\nLa inversión total del programa, que combina fondos públicos y esquemas de asociación público-privada, se estima en más de 800 millones a lo largo de los próximos cuatro años.\n\nEl MTC señaló que la modernización de estos aeropuertos es clave para descentralizar el tráfico aéreo, hoy fuertemente concentrado en el Aeropuerto Jorge Chávez de Lima.",
      category: "aeropuertos",
      date: "2026-08-27",
      author: AUTORES[3],
      tags: ["Aeropuertos", "MTC", "Infraestructura", "Regiones"],
      featured: false,
    }),

  // ---------------------------------------------------------------
  // PUERTOS (transporte marítimo)
  // ---------------------------------------------------------------
  p("art-009", "puerto-chancay-primeras-operaciones-comerciales",
    "El Puerto de Chancay inicia sus primeras operaciones comerciales a gran escala",
    {
      subtitle: "El megapuerto busca posicionar al Perú como nodo logístico entre Sudamérica y Asia-Pacífico",
      excerpt:
        "El Puerto de Chancay recibe sus primeras naves portacontenedores de gran calado, marcando el inicio de operaciones del megaproyecto portuario.",
      content:
        "El Puerto de Chancay ha iniciado sus primeras operaciones comerciales a gran escala, con la llegada de naves portacontenedores de gran calado capaces de operar directamente rutas transpacíficas sin escalas intermedias.\n\nEl megapuerto, desarrollado mediante una inversión conjunta entre capital peruano y asiático, cuenta con una terminal de contenedores totalmente automatizada y un calado que permite recibir a los buques portacontenedores más grandes que navegan actualmente el Pacífico.\n\nLa Autoridad Portuaria Nacional (APN) destacó que Chancay tiene el potencial de reducir en varios días el tiempo de tránsito de la carga peruana hacia mercados asiáticos, al eliminar la necesidad de trasbordo en puertos de otros países de la región.\n\nGremios exportadores del sector agroindustrial y minero han señalado que el nuevo puerto podría reducir de forma significativa los costos logísticos de las exportaciones peruanas hacia China y otros mercados del Asia-Pacífico.\n\nEl proyecto contempla una segunda fase de expansión que ampliaría la capacidad de la terminal de contenedores en los próximos años, consolidando a Chancay como un nodo logístico clave de la costa oeste de Sudamérica.",
      category: "puertos",
      date: "2026-09-26",
      author: AUTORES[0],
      tags: ["Puerto de Chancay", "Puertos", "Comercio exterior", "Logística"],
      featured: true,
    }),

  p("art-010", "puerto-callao-ampliacion-muelle-sur",
    "El Terminal Portuario del Callao amplía su muelle sur para naves de mayor calado",
    {
      subtitle: "La obra busca reducir la congestión del principal puerto de contenedores del país",
      excerpt:
        "La ampliación del muelle sur del Callao permitirá atender simultáneamente a más naves portacontenedores, reduciendo los tiempos de espera en rada.",
      content:
        "El concesionario del muelle sur del Terminal Portuario del Callao ha iniciado obras de ampliación que permitirán atender simultáneamente a un mayor número de naves portacontenedores de gran calado, reduciendo los tiempos de espera en rada que se han incrementado en los últimos años.\n\nLa obra contempla la extensión del frente de atraque y la incorporación de nuevas grúas pórtico de muelle, con el objetivo de elevar la capacidad de movimiento de contenedores del principal puerto del país.\n\nLa Autoridad Portuaria Nacional señaló que el Callao concentra cerca del 75% del movimiento de carga contenedorizada del Perú, por lo que su capacidad operativa es determinante para la competitividad del comercio exterior nacional.\n\nLa Asociación Marítima del Perú ha valorado positivamente la ampliación, aunque ha señalado la necesidad de acelerar también las mejoras en la conectividad vial de acceso al puerto, hoy uno de los principales cuellos de botella logísticos de Lima y Callao.\n\nLa ampliación del muelle sur se suma a otros proyectos de modernización en curso en los distintos terminales del Callao, en el marco del plan de competitividad portuaria impulsado por el MTC.",
      category: "puertos",
      date: "2026-09-17",
      author: AUTORES[1],
      tags: ["Puerto del Callao", "Puertos", "Comercio exterior"],
      featured: false,
    }),

  p("art-011", "puerto-paita-modernizacion-terminal",
    "El Terminal Portuario de Paita completa la modernización de su patio de contenedores",
    {
      subtitle: "La obra consolida al puerto piurano como principal salida de las exportaciones del norte",
      excerpt:
        "La modernización del patio de contenedores de Paita mejora la capacidad de almacenamiento y los tiempos de despacho de la carga agroexportadora del norte del país.",
      content:
        "El Terminal Portuario de Paita, en la región Piura, ha completado la modernización de su patio de contenedores, una obra que amplía la capacidad de almacenamiento y mejora los tiempos de despacho de la carga agroexportadora proveniente del norte del país.\n\nLa obra incluyó la pavimentación de nuevas áreas de almacenamiento, la incorporación de grúas de patio de mayor capacidad y la implementación de un sistema de gestión portuaria que permite programar con mayor precisión el ingreso y salida de camiones de carga.\n\nPaita es el principal puerto de salida de las exportaciones de banano orgánico, mango y otros productos agroindustriales del norte del Perú, un sector que ha crecido de forma sostenida en la última década.\n\nLa Autoridad Portuaria Nacional señaló que la modernización reducirá los tiempos de espera de camiones de carga en más de un 30%, un factor crítico para productos perecibles que requieren mantener la cadena de frío.\n\nGremios agroexportadores de Piura han destacado la importancia de la obra para mantener la competitividad de sus envíos frente a otros países productores de la región.",
      category: "puertos",
      date: "2026-09-03",
      author: AUTORES[2],
      tags: ["Puerto de Paita", "Puertos", "Agroexportación"],
      featured: false,
    }),

  p("art-012", "puerto-matarani-terminal-granel-mineral",
    "Matarani estrena una nueva terminal especializada en graneles minerales",
    {
      subtitle: "La infraestructura atenderá el creciente volumen de exportación minera del sur del país",
      excerpt:
        "El Puerto de Matarani inaugura una terminal especializada que mejora el manejo y reduce el impacto ambiental de la exportación de minerales del sur peruano.",
      content:
        "El Puerto de Matarani, en la región Arequipa, ha inaugurado una nueva terminal especializada en el manejo de graneles minerales, diseñada para atender el creciente volumen de exportación proveniente de las operaciones mineras del sur del país.\n\nLa nueva infraestructura incorpora sistemas de carga encapsulados que reducen de forma significativa la dispersión de polvo mineral durante las operaciones de embarque, una demanda histórica de la población del entorno portuario.\n\nEl concesionario del terminal señaló que la nueva instalación permitirá duplicar la capacidad de movimiento de minerales como cobre y zinc, provenientes principalmente de operaciones mineras de las regiones Arequipa, Puno y Cusco.\n\nLa Autoridad Portuaria Nacional destacó que la inversión responde a la necesidad de modernizar la infraestructura portuaria del sur del país ante el crecimiento sostenido de la producción minera nacional.\n\nOrganizaciones ambientales de la zona han solicitado un monitoreo independiente de la calidad del aire en el entorno portuario durante los primeros meses de operación de la nueva terminal.",
      category: "puertos",
      date: "2026-08-22",
      author: AUTORES[3],
      tags: ["Puerto de Matarani", "Puertos", "Minería", "Comercio exterior"],
      featured: false,
    }),

  // ---------------------------------------------------------------
  // TELECOMUNICACIONES
  // ---------------------------------------------------------------
  p("art-013", "subasta-espectro-5g-resultados",
    "OSIPTEL adjudica las bandas de espectro para el despliegue de 5G en el Perú",
    {
      subtitle: "Los operadores adjudicatarios deberán iniciar el despliegue comercial en los próximos 18 meses",
      excerpt:
        "La subasta de espectro para 5G marca el inicio formal del despliegue de la nueva generación de redes móviles en el país.",
      content:
        "El Organismo Supervisor de Inversión Privada en Telecomunicaciones (OSIPTEL) ha concluido el proceso de subasta de las bandas de espectro radioeléctrico destinadas al despliegue de redes 5G en el Perú, adjudicando los bloques a los principales operadores del mercado.\n\nLos operadores adjudicatarios se han comprometido a iniciar el despliegue comercial de redes 5G en las principales ciudades del país dentro de los próximos 18 meses, con metas progresivas de cobertura en capitales de región.\n\nEl Ministerio de Transportes y Comunicaciones señaló que la disponibilidad de 5G permitirá impulsar aplicaciones de alta demanda de datos en sectores como la industria, la salud y la educación, además de mejorar sustancialmente la experiencia de los usuarios móviles.\n\nAnalistas del sector destacan que el despliegue de 5G en el Perú llega después que en otros países de la región, por lo que los operadores buscarán acelerar el proceso de instalación de estaciones base en los próximos trimestres.\n\nOSIPTEL indicó que supervisará de cerca el cumplimiento de las metas de cobertura comprometidas por los operadores, bajo riesgo de sanciones en caso de incumplimiento de los plazos establecidos en las bases de la subasta.",
      category: "telecomunicaciones",
      date: "2026-09-29",
      author: AUTORES[0],
      tags: ["5G", "OSIPTEL", "Redes", "Operadores"],
      featured: true,
    }),

  p("art-014", "red-dorsal-fibra-optica-ampliacion-regiones",
    "La Red Dorsal Nacional de Fibra Óptica se amplía a 40 nuevas provincias",
    {
      subtitle: "El proyecto busca cerrar la brecha digital entre Lima y el interior del país",
      excerpt:
        "La ampliación de la Red Dorsal Nacional de Fibra Óptica llevará conectividad de alta velocidad a 40 provincias que hoy dependen de enlaces satelitales limitados.",
      content:
        "El Ministerio de Transportes y Comunicaciones, a través del Programa Nacional de Telecomunicaciones (Pronatel), ha anunciado la ampliación de la Red Dorsal Nacional de Fibra Óptica hacia 40 nuevas provincias del interior del país.\n\nLa ampliación permitirá sustituir los enlaces satelitales de baja capacidad, hoy utilizados en buena parte de estas provincias, por conexiones de fibra óptica de alta velocidad, beneficiando a instituciones públicas, centros educativos y establecimientos de salud.\n\nEl proyecto, que combina inversión pública con participación de operadores privados para la última milla, forma parte de la estrategia nacional para cerrar la brecha digital entre Lima y el interior del país.\n\nAutoridades regionales han señalado que la llegada de fibra óptica es clave para el desarrollo de telemedicina, educación virtual y trámites digitales en localidades donde la conectividad ha sido históricamente deficiente.\n\nSe estima que la ampliación de la red dorsal esté completamente operativa en las 40 provincias dentro de los próximos dos años, en coordinación con los gobiernos regionales involucrados.",
      category: "telecomunicaciones",
      date: "2026-09-20",
      author: AUTORES[1],
      tags: ["Fibra óptica", "Conectividad", "MTC", "Infraestructura digital"],
      featured: false,
    }),

  p("art-015", "internet-para-todos-nuevas-localidades-rurales",
    "El programa Internet para Todos lleva conectividad móvil a 500 nuevos centros poblados",
    {
      subtitle: "La iniciativa prioriza localidades rurales de la selva y la sierra sin cobertura previa",
      excerpt:
        "El programa de conectividad rural amplía su cobertura a centros poblados de la Amazonía y la sierra peruana que antes carecían de señal móvil.",
      content:
        "El programa Internet para Todos ha anunciado la activación de cobertura móvil en 500 nuevos centros poblados rurales, priorizando localidades de la Amazonía y la sierra peruana que hasta ahora carecían de cualquier tipo de señal móvil.\n\nLa iniciativa, desarrollada mediante un modelo de infraestructura compartida entre el Estado y operadores privados, ha instalado estaciones base alimentadas con energía solar en las localidades de más difícil acceso, donde no existe red eléctrica convencional.\n\nEl Ministerio de Transportes y Comunicaciones señaló que la conectividad móvil en estas zonas facilita el acceso a programas sociales digitales, telemedicina y educación a distancia, servicios que durante años estuvieron fuera del alcance de estas poblaciones.\n\nLíderes comunales de comunidades nativas de la selva han destacado el impacto de contar por primera vez con comunicación móvil, especialmente para la coordinación de emergencias de salud y seguridad.\n\nEl programa tiene como meta alcanzar a más de 30.000 centros poblados rurales en todo el país hacia el final de la década, en lo que constituye uno de los mayores esfuerzos de conectividad rural de la región.",
      category: "telecomunicaciones",
      date: "2026-09-08",
      author: AUTORES[2],
      tags: ["Conectividad", "Internet para Todos", "Zonas rurales"],
      featured: false,
    }),

  p("art-016", "cable-submarino-sudamerica-conexion-asia",
    "Un nuevo cable submarino conectará al Perú directamente con Asia-Pacífico",
    {
      subtitle: "El proyecto reduciría la latencia de las conexiones internacionales de datos del país",
      excerpt:
        "El nuevo cable submarino busca reducir la dependencia de rutas de datos que hoy transitan por otros países antes de llegar a los mercados asiáticos.",
      content:
        "Un consorcio internacional de operadores ha anunciado el estudio de factibilidad de un nuevo cable submarino de fibra óptica que conectaría al Perú de forma directa con mercados de Asia-Pacífico, aprovechando la posición del Puerto de Chancay como punto de aterrizaje.\n\nActualmente, buena parte del tráfico de datos internacional del Perú hacia Asia transita por rutas que pasan por otros países de la región, lo que incrementa la latencia de las conexiones y limita la competitividad del país como centro de datos regional.\n\nEl Ministerio de Transportes y Comunicaciones ha mostrado interés en el proyecto, señalando que una conexión submarina directa podría posicionar al Perú como un punto de interconexión relevante en la costa oeste de Sudamérica.\n\nOperadores de centros de datos y empresas tecnológicas han expresado respaldo a la iniciativa, destacando que menores latencias favorecerían la instalación de nueva infraestructura digital en el país.\n\nEl estudio de factibilidad del proyecto deberá concluir en los próximos doce meses, tras lo cual se definiría el cronograma de tendido del cable submarino.",
      category: "telecomunicaciones",
      date: "2026-08-25",
      author: AUTORES[3],
      tags: ["Fibra óptica", "Internet", "Infraestructura digital"],
      featured: false,
    }),

  // ---------------------------------------------------------------
  // INFRAESTRUCTURA (de transporte y comunicaciones)
  // ---------------------------------------------------------------
  p("art-017", "carretera-central-tunel-alternativa-avance",
    "Avanza la construcción del túnel que dará una alternativa a la Carretera Central",
    {
      subtitle: "La obra busca reducir los cierres por huaicos y derrumbes que afectan la vía cada año",
      excerpt:
        "El nuevo túnel ofrecerá una ruta alternativa a uno de los corredores logísticos más importantes del país, hoy vulnerable a eventos climáticos.",
      content:
        "Las obras del túnel que dará una ruta alternativa a la Carretera Central han alcanzado un avance significativo, según el último reporte del Ministerio de Transportes y Comunicaciones (MTC).\n\nLa Carretera Central conecta Lima con la sierra central y la selva del país, y es la principal vía de transporte de carga minera e industrial hacia el puerto del Callao, pero sufre cierres recurrentes por huaicos y derrumbes durante la temporada de lluvias.\n\nEl nuevo túnel, de varios kilómetros de longitud, permitirá evitar uno de los tramos más vulnerables de la vía, reduciendo significativamente los cierres que cada año generan pérdidas millonarias al sector transporte y logística.\n\nGremios de transportistas de carga pesada han señalado que los cierres de la Carretera Central generan sobrecostos logísticos que afectan la competitividad de las exportaciones mineras del centro del país.\n\nEl MTC estima que el túnel entre en operación en los próximos tres años, como parte de un plan más amplio de modernización de la Carretera Central que incluye otros tramos en estudio.",
      category: "infraestructura",
      date: "2026-09-24",
      author: AUTORES[0],
      tags: ["Carretera Central", "Obras públicas", "MTC", "Infraestructura"],
      featured: false,
    }),

  p("art-018", "torres-telecomunicaciones-corredor-vial-sur",
    "Instalan 80 nuevas torres de telecomunicaciones a lo largo del corredor vial sur",
    {
      subtitle: "El proyecto busca garantizar cobertura móvil continua en carreteras interprovinciales",
      excerpt:
        "Las nuevas torres de telecomunicaciones eliminarán zonas sin señal a lo largo de uno de los principales corredores viales del sur del Perú.",
      content:
        "Un operador de telecomunicaciones ha completado la instalación de 80 nuevas torres a lo largo del corredor vial sur, que conecta Lima con Arequipa, Puno y la frontera con Bolivia, eliminando varios tramos que hasta ahora carecían de cobertura móvil.\n\nLa falta de señal en determinados tramos de este corredor había sido señalada repetidamente como un riesgo de seguridad vial, al dificultar la comunicación en caso de accidentes o emergencias en zonas alejadas de centros poblados.\n\nEl Ministerio de Transportes y Comunicaciones ha promovido este tipo de proyectos de infraestructura compartida entre operadores, reduciendo la duplicación de torres y acelerando la cobertura en corredores viales estratégicos.\n\nTransportistas de carga y pasajeros interprovinciales han valorado positivamente la medida, destacando la importancia de contar con comunicación constante durante los largos trayectos por zonas altoandinas.\n\nEl operador indicó que replicará este modelo de despliegue en otros corredores viales del norte y centro del país durante los próximos dos años.",
      category: "infraestructura",
      date: "2026-09-13",
      author: AUTORES[1],
      tags: ["Infraestructura digital", "Conectividad", "Redes de comunicación"],
      featured: false,
    }),

  p("art-019", "centro-datos-hiperescala-lima-inauguracion",
    "Inaugurado el primer centro de datos hiperescala del Perú en Lima",
    {
      subtitle: "La instalación busca posicionar al país como nodo regional de servicios en la nube",
      excerpt:
        "El nuevo centro de datos hiperescala en Lima atenderá la creciente demanda de servicios en la nube e inteligencia artificial en el país.",
      content:
        "Un operador internacional de infraestructura digital ha inaugurado el primer centro de datos de categoría hiperescala construido en el Perú, ubicado en Lima, con capacidad para albergar miles de servidores dedicados a servicios en la nube.\n\nLa instalación busca reducir la dependencia de centros de datos ubicados en otros países de la región para alojar aplicaciones y servicios digitales utilizados por empresas y entidades públicas peruanas.\n\nEl Ministerio de Transportes y Comunicaciones destacó que contar con infraestructura de datos de este nivel es clave para atraer inversión en servicios de inteligencia artificial y computación en la nube al país.\n\nEl centro de datos se conecta directamente a la Red Dorsal Nacional de Fibra Óptica, lo que permitirá ofrecer baja latencia a empresas de regiones conectadas a la red troncal.\n\nEl proyecto contempla una segunda fase de ampliación en los próximos años, en línea con el crecimiento esperado de la demanda de servicios digitales en el país.",
      category: "infraestructura",
      date: "2026-08-30",
      author: AUTORES[2],
      tags: ["Centros de datos", "Infraestructura digital", "Lima"],
      featured: false,
    }),

  p("art-020", "puente-tablachaca-reconstruccion-avance",
    "Reconstrucción del puente Tablachaca garantizará conectividad vial permanente en Ayacucho",
    {
      subtitle: "El puente es clave para el transporte de carga y pasajeros entre la sierra y la selva central",
      excerpt:
        "La reconstrucción del puente Tablachaca busca asegurar una conexión vial permanente tras años de interrupciones por daños estructurales.",
      content:
        "El Ministerio de Transportes y Comunicaciones ha avanzado con la reconstrucción del puente Tablachaca, una estructura clave para el transporte de carga y pasajeros entre las regiones de Ayacucho y Huancavelica, hacia la selva central del país.\n\nEl puente, que en años anteriores sufrió cierres parciales por daños estructurales, será reconstruido con nuevos estándares de ingeniería antisísmica y mayor capacidad de carga, adecuada al creciente tránsito de vehículos de transporte pesado.\n\nAutoridades regionales han señalado que la interrupción del tránsito por este puente en el pasado generó sobrecostos logísticos significativos para productores agrícolas de la zona, que debían utilizar rutas alternativas mucho más largas.\n\nEl MTC ha señalado que la obra incorpora un sistema de monitoreo estructural permanente, que permitirá anticipar cualquier riesgo futuro antes de que derive en el cierre de la vía.\n\nSe espera que la reconstrucción concluya en los próximos 18 meses, restableciendo una conexión vial que gremios de transportistas consideran estratégica para la economía de la sierra sur-centro del país.",
      category: "infraestructura",
      date: "2026-08-18",
      author: AUTORES[3],
      tags: ["Obras públicas", "MTC", "Infraestructura", "Carreteras"],
      featured: false,
    }),
];

// Asigna imagen (placeholder SVG generado) a cada artículo.
for (const article of A) {
  article.image = `/images/${article.slug}.svg`;
  article.imageAlt = `${article.title} — imagen ilustrativa (contenido de demostración)`;
}

for (const article of A) {
  const file = path.join(ARTICLES_DIR, `${article.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(article, null, 2) + "\n", "utf-8");
}

// Genera las imágenes placeholder correspondientes.
const jobs = A.map((a, i) => ({ slug: a.slug, category: a.category, seed: i }));
const jobsFile = path.join(process.cwd(), "scripts", ".placeholder-jobs.json");
fs.writeFileSync(jobsFile, JSON.stringify(jobs));
execFileSync("node", ["scripts/generate-placeholders.mjs", jobsFile], { stdio: "inherit" });
fs.unlinkSync(jobsFile);

console.log(`Creados ${A.length} artículos de demostración en ${ARTICLES_DIR}`);
