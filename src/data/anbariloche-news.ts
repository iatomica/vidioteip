import { NewsVideoProps } from '../compositions/NewsVideo/types';

export const anbarilocheNewsData: NewsVideoProps = {
  title: 'Resumen de Noticias // ANBariloche',
  subtitle: 'Las 5 novedades más importantes de Bariloche y la región patagónica',
  source: 'ANBARILOCHE.COM.AR',
  date: 'SEPTIEMBRE 2026',
  topic: 'Actualidad Regional',
  theme: 'editorial-calm',
  format: 'vertical',
  showSafeAreas: false,
  debug: false,
  scenes: [
    // 1. Noticia 1: Obras e Infraestructura en el Aeropuerto
    {
      id: 'bariloche-scene-1-aeropuerto',
      type: 'headline',
      durationInFrames: 135, // 4.5s @ 30fps
      transition: 'fade',
      content: {
        kicker: 'OBRAS PÚBLICAS',
        title: 'Invierten $4.475 millones para repavimentar el acceso al aeropuerto',
        subtitle: 'El gobierno provincial adjudicó la obra sobre la Ruta 80 para optimizar el tránsito turístico.',
        badgeText: 'INFRAESTRUCTURA',
        source: 'ANBariloche',
        backgroundImage: 'images/bariloche/ruta-aeropuerto.webp',
      },
    },

    // 2. Noticia 2: Nieve, Deporte y Comunidad en Cerro Catedral
    {
      id: 'bariloche-scene-2-catedral',
      type: 'headline',
      durationInFrames: 135, // 4.5s @ 30fps
      transition: 'fade',
      content: {
        kicker: 'NIEVE Y COMUNIDAD',
        title: 'Cerro Catedral: Esquí escolar y programas que integran a los barrios',
        subtitle: 'Cientos de jóvenes de la región acceden a la montaña a través del programa Painamal.',
        badgeText: 'CATEDRAL',
        source: 'ANBariloche',
        backgroundImage: 'images/bariloche/cerro-catedral.webp',
      },
    },

    // 3. Noticia 3: Cultura y Música Patagónica
    {
      id: 'bariloche-scene-3-musica',
      type: 'headline',
      durationInFrames: 135, // 4.5s @ 30fps
      transition: 'fade',
      content: {
        kicker: 'CULTURA REGIONAL',
        title: 'Cinco días de festival para proyectar la música patagónica al país',
        subtitle: 'Artistas regionales se reúnen en Bariloche con clínicas, shows en vivo y rondas culturales.',
        badgeText: 'FESTIVAL',
        source: 'ANBariloche',
        backgroundImage: 'images/bariloche/musica-patagonica.webp',
      },
    },

    // 4. Noticia 4: Educación y Comunidad en Virgen Misionera
    {
      id: 'bariloche-scene-4-amuyen',
      type: 'headline',
      durationInFrames: 135, // 4.5s @ 30fps
      transition: 'fade',
      content: {
        kicker: 'EDUCACIÓN',
        title: 'La Escuela Amuyén abre inscripciones para su ciclo secundario',
        subtitle: 'La institución de Virgen Misionera sigue consolidando su proyecto educativo comunitario.',
        badgeText: 'BARILOCHE',
        source: 'ANBariloche',
        backgroundImage: 'images/bariloche/escuela-amuyen.webp',
      },
    },

    // 5. Noticia 5: Conectividad Aérea Neuquén - Cordillera
    {
      id: 'bariloche-scene-5-vuelos',
      type: 'headline',
      durationInFrames: 135, // 4.5s @ 30fps
      transition: 'fade',
      content: {
        kicker: 'CONECTIVIDAD',
        title: 'Nueva ruta aérea directa unirá Neuquén con San Martín de los Andes',
        subtitle: 'Vuelos regulares buscan dinamizar el turismo y la integración del corredor de los lagos.',
        badgeText: 'TURISMO',
        source: 'ANBariloche',
        backgroundImage: 'images/bariloche/ruta-aerea.webp',
      },
    },

    // 6. Cierre Institucional ANBariloche
    {
      id: 'bariloche-scene-6-outro',
      type: 'outro',
      durationInFrames: 105, // 3.5s @ 30fps
      transition: 'fade',
      content: {
        title: 'Noticias de la Patagonia',
        callToAction: 'Noticias de la Patagonia',
      },
    },
  ],
};
