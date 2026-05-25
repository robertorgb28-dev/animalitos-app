export type AnimalCategory =
  | 'Aves'
  | 'Mamíferos'
  | 'Reptiles'
  | 'Anfibios'
  | 'Peces'
  | 'Insectos'
  | 'Arácnidos'
  | 'Moluscos'
  | 'Crustáceos'
  | 'Otros';

export interface Sighting {
  id: string;
  animalId: string;
  animalName: string;
  location: string;
  timestamp: string; // date e.g. "25 May 2026"
  time: string; // e.g. "18:30 hrs"
  context: 'Andando' | 'Coche' | 'Moto' | 'Bici' | 'Otro';
  notes: string;
  photos: string[];
  mapImage?: string;
  coords?: { top: string; left: string }; // Position percentage on the interactive map
  outingId?: string; // Reference to outing session
  latitude?: number;
  longitude?: number;
  locationSource?: 'GPS' | 'manual';
}

export interface OutingAnimal {
  animalId: string;
  animalName: string;
  scientificName: string;
  imageUrl: string;
  type: AnimalCategory;
  count: number;
  notes?: string;
  photo?: string;
  time?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  locationSource?: 'gps' | 'manual' | 'inherited' | null;
}

export interface Outing {
  id: string;
  date: string; // e.g., "25 May 2026"
  time: string; // e.g., "08:32"
  location: string;
  context:
    | 'Andando'
    | 'En coche'
    | 'En moto'
    | 'En bici'
    | 'En el campo'
    | 'En ciudad'
    | 'En parque'
    | 'En río o lago'
    | 'En playa'
    | 'Otro';
  notes: string;
  animals: OutingAnimal[];
  status?: 'en_progreso' | 'borrador' | 'finalizado';
  latitude?: number;
  longitude?: number;
  locationSource?: 'GPS' | 'manual';
}

export interface Animal {
  id: string;
  name: string;
  scientificName: string;
  type: AnimalCategory;
  imageUrl: string;
  gallery: string[];
  seenCount: number;
  description?: string;
  imageVerified?: boolean;
  fallbackIcon?: string;
  categoryIcon?: string;
  habitatTags?: string[];
  cadizCommon?: boolean;
}

// Extensive animal database focusing on Spain, Western Andalusia and Cádiz (Urband, fields, coast, lagoons...)
export const INITIAL_ANIMALS: Animal[] = [
  // --- AVES URBANAS Y COMUNES ---
  {
    id: 'gorrion-comun',
    name: 'Gorrión común',
    scientificName: 'Passer domesticus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El ave urbana por excelencia. Vital, ruidosa y muy gregaria en calles, plazas y jardines.',
    habitatTags: ['urbano'],
    cadizCommon: true
  },
  {
    id: 'gorrion-moruno',
    name: 'Gorrión moruno',
    scientificName: 'Passer hispaniolensis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Similar al común pero con moteado negro muy denso en el pecho. Común en campiñas andaluzas.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'paloma-bravia',
    name: 'Paloma bravía',
    scientificName: 'Columba livia',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ancestro de las palomas domésticas, habita riscos costeros y entornos urbanos.',
    habitatTags: ['urbano'],
    cadizCommon: true
  },
  {
    id: 'paloma-torcaz',
    name: 'Paloma torcaz',
    scientificName: 'Columba palumbus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La paloma más grande de la península, reconocible por sus manchas blancas en el cuello.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'tortola-turca',
    name: 'Tórtola turca',
    scientificName: 'Streptopelia decaocto',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De color ocre grisáceo con un collar negro distintivo en la nuca. Excepcional colonizadora urbana.',
    habitatTags: ['urbano'],
    cadizCommon: true
  },
  {
    id: 'mirlo-comun',
    name: 'Mirlo común',
    scientificName: 'Turdus merula',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De plumaje negro mate con pico amarillo anaranjado brillante en machos. Canto melodioso al amanecer.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'estornino-negro',
    name: 'Estornino negro',
    scientificName: 'Sturnus unicolor',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gala negra de reflejos metálicos purpúreos. Ruidoso imitador en tejados de pueblos andaluces.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'estornino-pinto',
    name: 'Estornino pinto',
    scientificName: 'Sturnus vulgaris',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Visitante invernal con plumaje densamente moteado de blanco. Espectacular en vuelos coordinados.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'golondrina-comun',
    name: 'Golondrina común',
    scientificName: 'Hirundo rustica',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante viajera de cola ahorquillada y garganta rojiza. Nidifica bajo porches y cortijos.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'vencejo-comun',
    name: 'Vencejo común',
    scientificName: 'Apus apus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Acróbata incansable que pasa meses volando sin posarse. Chillidos estivales en cielos gaditanos.',
    habitatTags: ['urbano'],
    cadizCommon: true
  },
  {
    id: 'avion-comun',
    name: 'Avión común',
    scientificName: 'Delichon urbicum',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeño acróbata de obispillo blanco puro y cola corta. Construye nidos semiesféricos de barro.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'urraca',
    name: 'Urraca',
    scientificName: 'Pica pica',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Córvido de llamativo plumaje blanco y negro con irisaciones verdes y azuladas. Lista e inteligente.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: false
  },
  {
    id: 'grajilla',
    name: 'Grajilla',
    scientificName: 'Corvus monedula',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Córvido pequeño de ojos gris plateado y nuca cenicienta. Muy común en monumentos de Jérez o Cádiz.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'cuervo',
    name: 'Cuervo',
    scientificName: 'Corvus corax',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El córvido más grande de Europa, negro brillante con pico robusto. Habitante de roquedos e interior.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'jilguero',
    name: 'Jilguero',
    scientificName: 'Carduelis carduelis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Precioso fringílido de cara roja y bandas amarillas vivas en las alas. Famoso por su alegre canto.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'verderon-comun',
    name: 'Verderón común',
    scientificName: 'Chloris chloris',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Fuerte silueta verde oliva con bordes de las alas y cola amarillentos. Robusto comedor de semillas.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'verdecillo',
    name: 'Verdecillo',
    scientificName: 'Serinus serinus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El fringílido más pequeño, de tonos amarillentos y rayados. Canta con giros rápidos desde antenas.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'pinzon-vulgar',
    name: 'Pinzón vulgar',
    scientificName: 'Fringilla coelebs',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Habitante forestal de pecho asalmonado en machos y llamativas bandas blancas al volar.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'petirrojo',
    name: 'Petirrojo',
    scientificName: 'Erithacus rubecula',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Inconfundible por su gran mancha naranja en pecho y cara. Curioso y territorial en sotobosques.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'carbonero-comun',
    name: 'Carbonero común',
    scientificName: 'Parus major',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cabecita negra brillante, mejillas blancas contrastadas y pecho amarillo con corbata negra.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'herrerillo-comun',
    name: 'Herrerillo común',
    scientificName: 'Cyanistes caeruleus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Acróbata forestal de gorrita azul cobalto y pecho amarillo. Muy activo buscando orugas.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'lavandera-blanca',
    name: 'Lavandera blanca',
    scientificName: 'Motacilla alba',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Estilizada silueta pía de andares rítmicos agitando la cola. Frecuente al borde del agua y asfalto.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'lavandera-boyera',
    name: 'Lavandera boyera',
    scientificName: 'Motacilla flava',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lavandera estival de pecho amarillo limón intenso. Fiel seguidora del ganado en dehesas y marismas.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'colirrojo-tizon',
    name: 'Colirrojo tizón',
    scientificName: 'Phoenicurus ochruros',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Plumaje oscuro cenizo con cola de un vivo color canela-anaranjado que agita continuamente.',
    habitatTags: ['urbano', 'campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'ruisenor-bastardo',
    name: 'Ruiseñor bastardo',
    scientificName: 'Cettia cetti',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ave pequeña y escurridiza que habita carrizales. Se delata por su potente y repentino canto explosivo.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },
  {
    id: 'buitron',
    name: 'Buitrón',
    scientificName: 'Cisticola juncidis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Minúscula ave de vuelo ondulante que emite un monótono "zic, zic..." sobre trigales y marisma.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'cogujada-comun',
    name: 'Cogujada común',
    scientificName: 'Galerida cristata',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Marrón terrosa con una conspicua y puntiaguda cresta en la cabeza. Habitual a pie de caminos.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'alondra-comun',
    name: 'Alondra común',
    scientificName: 'Alauda arvensis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Famosa por sus cantos torrenciales emitidos en pleno vuelo ascensional sobre campiñas abiertas.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'totovia',
    name: 'Totovía',
    scientificName: 'Lullula arborea',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Habitante de linderos forestales secos, reconocible por su ceja blanquecina que rodea la nuca.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'alcaudón-comun',
    name: 'Alcaudón común',
    scientificName: 'Lanius senator',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeño cazador de pico curvo y antifaz negro, conocido por empalar sus presas en espinos.',
    habitatTags: ['campo'],
    cadizCommon: true
  },

  // --- AVES ACUÁTICAS Y DE MARISMA ---
  {
    id: 'flamenco-comun',
    name: 'Flamenco común',
    scientificName: 'Phoenicopterus roseus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rosa pálido de elegantísimas patas y largo cuello. Símbolo de Doñana y la Bahía de Cádiz.',
    habitatTags: ['marisma', 'costa'],
    cadizCommon: true
  },
  {
    id: 'garza-real',
    name: 'Garza real',
    scientificName: 'Ardea cinerea',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gran zancuda grisácea de vuelo pausado y pico en forma de arpón. Paciente pescadora costera.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'garceta-comun',
    name: 'Garceta común',
    scientificName: 'Egretta garzetta',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Blanca inmaculada con gracioso pico negro y pies amarillos contrastando en el fango.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'garceta-grande',
    name: 'Garceta grande',
    scientificName: 'Ardea alba',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De tamaño equiparable a la garza real pero plumaje enteramente blanco y pico amarillo invernal.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'garcilla-bueyera',
    name: 'Garcilla bueyera',
    scientificName: 'Bubulcus ibis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Frecuenta rebaños de vacas comiendo parásitos. Blanca, amarillenta en época reproductora.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'espatula-comun',
    name: 'Espátula común',
    scientificName: 'Platalea leucorodia',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Impresionante plumaje blanco con pico espatulado que barre el cieno rítmicamente buscando alimento.',
    habitatTags: ['marisma', 'costa'],
    cadizCommon: true
  },
  {
    id: 'ciguenuela-comun',
    name: 'Cigüeñuela común',
    scientificName: 'Himantopus himantopus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Preciosa andarina de plumaje blanquinegro con desproporcionadas y finas patas rosadas.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'avoceta-comun',
    name: 'Avoceta común',
    scientificName: 'Recurvirostra avosetta',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante plumaje pío negro y blanco con un fino pico curvado hacia arriba característico.',
    habitatTags: ['marisma', 'costa'],
    cadizCommon: true
  },
  {
    id: 'chorlitejo-patinegro',
    name: 'Chorlitejo patinegro',
    scientificName: 'Charadrius alexandrinus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Emblemático de dunas gaditanas. Pequeño corredor amenazado por el turismo de playa.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'chorlitejo-grande',
    name: 'Chorlitejo grande',
    scientificName: 'Charadrius hiaticula',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De collar negro continuo y patas naranjas. Común en fangos intermareales en migración.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'chorlitejo-chico',
    name: 'Chorlitejo chico',
    scientificName: 'Charadrius dubius',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Anillo ocular amarillo oro brillante, prefiere graveras e interior de arroyos y ríos.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },
  {
    id: 'chorlito-gris',
    name: 'Chorlito gris',
    scientificName: 'Pluvialis squatarola',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Limícola robusto moteado de gris que recorre velozmente bajíos arenosos de la costa.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'ostrero-euroasiatico',
    name: 'Ostrero euroasiático',
    scientificName: 'Haematopus ostralegus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Reconocible por su plumaje blanquinegro, anillo ocular rojo y largo pico naranja para abrir bivalvos.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'andarrios-chico',
    name: 'Andarríos chico',
    scientificName: 'Actitis hypoleucos',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeño andariego fluvial que vuela a ras de agua emitiendo un agudo reclamo trino.',
    habitatTags: ['rio-laguna', 'costa'],
    cadizCommon: true
  },
  {
    id: 'vuelvepiedras-comun',
    name: 'Vuelvepiedras común',
    scientificName: 'Arenaria interpres',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Plumaje pardo-grisáceo de fuerte complexión. Voltea piedrecitas en escolleras buscando pulgas de mar.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'correlimos-tridactilo',
    name: 'Correlimos tridáctilo',
    scientificName: 'Calidris alba',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Corre incansable rozando la espuma de la marea en la misma orilla playera con paso vertiginoso.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'correlimos-comun',
    name: 'Correlimos común',
    scientificName: 'Calidris alpina',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De pico levemente arqueado, es la limícola invernal más abundante en caños salineros.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'correlimos-menudo',
    name: 'Correlimos menudo',
    scientificName: 'Calidris minuta',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El más diminuto de los correlimos. Corre ágilmente picoteando limos lodosos.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'correlimos-gordo',
    name: 'Correlimos gordo',
    scientificName: 'Calidris canutus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Grisáceo en invierno con complexión corpulenta, viaja en bandos apretados costeros.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'correlimos-zarapitin',
    name: 'Correlimos zarapitín',
    scientificName: 'Calidris ferruginea',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pico bien arqueado hacia abajo. En primavera adquiere un vistoso plumaje castaño rojizo.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'aguja-colipinta',
    name: 'Aguja colipinta',
    scientificName: 'Limosa lapponica',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gran limícola de largo pico levemente curvado hacia arriba, inverna en fangos marinos.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'aguja-colinegra',
    name: 'Aguja colinegra',
    scientificName: 'Limosa limosa',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cuerpo esbelto de patas muy largas, habitual en arrozales y lagunas temporales de Doñana.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'zarapito-real',
    name: 'Zarapito real',
    scientificName: 'Numenius arquata',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Limícola gigante de larguísimo pico arqueado hacia abajo para sondear galerías de cangrejos.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'zarapito-trinador',
    name: 'Zarapito trinador',
    scientificName: 'Numenius phaeopus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Algo más pequeño que el real, reconocible por su pileo listado oscuro en la cabeza.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'archibebe-comun',
    name: 'Archibebe común',
    scientificName: 'Tringa totanus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Habitante escrupuloso de salinas con patas de un rojo anaranjado muy vivo y voz de alarma estridente.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'archibebe-claro',
    name: 'Archibebe claro',
    scientificName: 'Tringa nebularia',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Esbelto y grisáceo de patas verdosas y pico robusto ligeramente curvado hacia arriba.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'archibebe-oscuro',
    name: 'Archibebe oscuro',
    scientificName: 'Tringa erythropus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Inverna en costas fluviales húmedas. En plumaje nupcial es enteramente negro carbón.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'agachadiza-comun',
    name: 'Agachadiza común',
    scientificName: 'Gallinago gallinago',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rebosa mimetismo sobre la vegetación ribereña, levantando el vuelo en zigzag ante la menor intrusión.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'focha-comun',
    name: 'Focha común',
    scientificName: 'Fulica atra',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cuerpo negro mate con escudete frontal y pico de un blanco puro contrastado. Muy territorial.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'gallineta-comun',
    name: 'Gallineta común',
    scientificName: 'Gallinula chloropus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De patas verdes con ligas rojas y pico rojo brillante de punta amarilla. Nada en lagunas y canales.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'calamon-comun',
    name: 'Calamón común',
    scientificName: 'Porphyrio porphyrio',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Inmenso rálido de maravilloso plumaje azul purpúreo, pico y patas rojas de larguísimos dedos.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'malvasia-cabeciblanca',
    name: 'Malvasía cabeciblanca',
    scientificName: 'Oxyura leucocephala',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Anátida amenazada de cola erguida fina y asombroso pico azul celeste hinchado en machos primaverales.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'zampullin-comun',
    name: 'Zampullín común',
    scientificName: 'Tachybaptus ruficollis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Diminuto zampullín que se sumerge velozmente ante alertas, emitiendo un agudo relincho.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'somormujo-lavanco',
    name: 'Somormujo lavanco',
    scientificName: 'Podiceps cristatus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante buceador de largo cuello blanco y asombrosas moñas castañas en la nuca reproductora.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'zampullin-cuellinegro',
    name: 'Zampullín cuellinegro',
    scientificName: 'Podiceps nigricollis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Con ojos de fuego rojo rubí y abanicos auriculares dorados llamativos en nupcial.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'cormoran-grande',
    name: 'Cormorán grande',
    scientificName: 'Phalacrocorax carbo',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Excelente buceador negro. Frecuente posado en postes secando las alas al sol en postura de heráldica.',
    habitatTags: ['rio-laguna', 'costa'],
    cadizCommon: true
  },
  {
    id: 'anade-azulon',
    name: 'Ánade azulón',
    scientificName: 'Anas platyrhynchos',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El pato más común, reconocible por la brillante cabeza verde metálica en el macho.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'anade-rabudo',
    name: 'Ánade rabudo',
    scientificName: 'Anas acuta',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Estilizado cuello blanco con cola terminada en largas plumas negras afiladas.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'anade-friso',
    name: 'Ánade friso',
    scientificName: 'Mareca strepera',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Marrón apagado con espejuelo alar blanco llamativo visible en vuelo.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'cerceta-comun',
    name: 'Cerceta común',
    scientificName: 'Anas crecca',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La anátida más pequeña de Europa, veloz al despegar del espejo de agua.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'cerceta-carretona',
    name: 'Cerceta carretona',
    scientificName: 'Spatula querquedula',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Estival con conspicua banda superciliar blanca arqueada en la cabeza del macho.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'pato-cuchara',
    name: 'Pato cuchara',
    scientificName: 'Spatula clypeata',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Inconfundible pico en forma de pala ensanchada para filtrar plancton de la superficie.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'silbon-europeo',
    name: 'Silbón europeo',
    scientificName: 'Mareca penelope',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Frente dorada sobre cabeza castaña, silba característicamente al invernar en lagunas.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'tarro-blanco',
    name: 'Tarro blanco',
    scientificName: 'Tadorna tadorna',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gran pato ganso tricolor de cabeza negra verdosa, banda castaña y carúncula roja en pico.',
    habitatTags: ['marisma', 'costa'],
    cadizCommon: true
  },
  {
    id: 'pato-colorado',
    name: 'Pato colorado',
    scientificName: 'Netta rufina',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gran cresta redonda canela-rojiza vestida en machos con pico rojo carmín brillante.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'negron-comun',
    name: 'Negrón común',
    scientificName: 'Melanitta nigra',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Enteramente negro, forma bandos flotantes distantes mar adentro de dunas costeras.',
    habitatTags: ['costa'],
    cadizCommon: true
  },

  // --- AVES MARINAS Y COSTERAS ---
  {
    id: 'gaviota-patiamarilla',
    name: 'Gaviota patiamarilla',
    scientificName: 'Larus michahellis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La gaviota residente más abundante, reconocible por sus patas amarillas brillantes y ojo anaranjado.',
    habitatTags: ['costa', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'gaviota-reidora',
    name: 'Gaviota reidora',
    scientificName: 'Chroicocephalus ridibundus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Con capucho veraniego marrón chocolate oscuro que muda a una manchita en el ojo en invierno.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'gaviota-sombria',
    name: 'Gaviota sombría',
    scientificName: 'Larus fuscus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De espalda ceniza oscura casi negra satinada y patas amarillas, muy abundante en puertos.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'gaviota-cabecinegra',
    name: 'Gaviota cabecinegra',
    scientificName: 'Ichthyaetus melanocephalus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Con capucho negro azabache continuo que se extiende por el cuello reproductor.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'gaviota-picofina',
    name: 'Gaviota picofina',
    scientificName: 'Chroicocephalus genei',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Esbelta gaviota de pecho rosado suave y pico rojizo fino y sutil, anida en salinas de Cádiz.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'gaviota-audouin',
    name: 'Gaviota de Audouin',
    scientificName: 'Ichthyaetus audouinii',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gaviota marina de pico rojo coral oscuro con banda negra y punta amarilla.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'gavion-atlantico',
    name: 'Gavión atlántico',
    scientificName: 'Larus marinus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Una gaviota gigante de pico descomunal y espalda de pizarra negra, visitante oceánico.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'charrancito',
    name: 'Charrancito común',
    scientificName: 'Sternula albifrons',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Diminuto charrán con frente blanca y pico amarillo de punta negra. Se cierne veloz para pescar.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'charran-patinegro',
    name: 'Charrán patinegro',
    scientificName: 'Thalasseus sandvicensis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Moño negro despeinado, pico negro de punta amarilla y vuelo rápido chillando en playas.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'charran-comun',
    name: 'Charrán común',
    scientificName: 'Sterna hirundo',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De cola muy ahorquillada "golondrina de mar", pico rojo de punta negra.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'pagaza-piquirroja',
    name: 'Pagaza piquirroja',
    scientificName: 'Hydroprogne caspia',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La pagaza más grande, con pico rojo descomunal en forma de zanahoria.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'pagaza-piconegra',
    name: 'Pagaza piconegra',
    scientificName: 'Gelochelidon nilotica',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Robusto pico negro corto, caza saltamontes sobre el cultivo campiñés lindando marismas.',
    habitatTags: ['marisma', 'campo'],
    cadizCommon: true
  },
  {
    id: 'fumarel-comun',
    name: 'Fumarel común',
    scientificName: 'Chlidonias niger',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Charrán palustre que adquiere un plumaje nupcial gris hollín casi negro plomizo.',
    habitatTags: ['rio-laguna', 'costa'],
    cadizCommon: true
  },
  {
    id: 'fumarel-cariblanco',
    name: 'Fumarel cariblanco',
    scientificName: 'Chlidonias hybrida',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Charrán palustre nidificante en juncales con mejillas blancas contrastando con el vientre oscuro.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'alcatraz',
    name: 'Alcatraz atlántico',
    scientificName: 'Morus bassanus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Espectacular pescador marino que realiza picados perfectos a calado vertical desde gran altura.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'alca-comun',
    name: 'Alca común',
    scientificName: 'Alca torda',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeño alcido parecido a un pingüino minúsculo, inverna flotando en alta mar del golfo.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'paino-europeo',
    name: 'Paíño europeo',
    scientificName: 'Hydrobates pelagicus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El ave marina más diminuta, negra con obispillo blanco, revolotea sobre el Atlántico bravío.',
    habitatTags: ['costa'],
    cadizCommon: true
  },

  // --- RAPACES Y AVES GRANDES ---
  {
    id: 'milano-negro',
    name: 'Milano negro',
    scientificName: 'Milvus migrans',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cola escotada triangular, silueta heráldica muy común patrullando vertederos y dehesas andaluzas.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'milano-real',
    name: 'Milano real',
    scientificName: 'Milvus milvus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cola fuertemente ahorquillada y asombrosas ventanas blancas en las alas del rapaz.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'halcon-peregrino',
    name: 'Halcón peregrino',
    scientificName: 'Falco peregrinus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cazador veloz con bigotera negra marcada. Habita desfiladeros serranos y torres elevadas.',
    habitatTags: ['sierra', 'campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'cernicalo-vulgar',
    name: 'Cernícalo vulgar',
    scientificName: 'Falco tinnunculus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Falcónido pequeño conocido por cernirse inmóvil en el aire batiendo alas como un helicóptero.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'cernicalo-primilla',
    name: 'Cernícalo primilla',
    scientificName: 'Falco naumanni',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Muy gregario nidifica en iglesias antiguas de pueblos. Dorso liso castaño sin motas en machos.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'aguilucho-lagunero',
    name: 'Aguilucho lagunero',
    scientificName: 'Circus aeruginosus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rapaz de carrizales, planea a baja altura con alas en "V" sobre marismas andaluzas.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'aguilucho-cenizo',
    name: 'Aguilucho cenizo',
    scientificName: 'Circus pygargus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gris ceniza con bandas negras en alas. Excelente limpiador de ratones de cereales.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'aguila-pescadora',
    name: 'Águila pescadora',
    scientificName: 'Pandion haliaetus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Caza peces zambulléndose con sus garras por delante en caños de la Bahía y embalses.',
    habitatTags: ['costa', 'rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'aguila-calzada',
    name: 'Águila calzada',
    scientificName: 'Hieraaetus pennatus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Una rapaz silvestre mediana de calzas emplumadas y dos fases de plumaje (clara y oscura).',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'aguila-perdicera',
    name: 'Águila perdicera',
    scientificName: 'Aquila fasciata',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Símbolo de las sierras andaluzas, cazadora implacable que sufre amenazas eléctricas graves.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'aguila-imperial',
    name: 'Águila imperial ibérica',
    scientificName: 'Aquila adalberti',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Joyas zoológicas ibéricas de hombros de color blanco nieve característicos en adultos.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'aguila-real',
    name: 'Águila real',
    scientificName: 'Aquila chrysaetos',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La reina de las rapaces del roquedo serrano de la cordillera subbética y Grazalema.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'gavilan-comun',
    name: 'Gavilán común',
    scientificName: 'Accipiter nisus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Minúscula rapaz forestal de alas redondeadas y vuelo esquivo entre copas persiguiendo pajarillos.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'azor-comun',
    name: 'Azor común',
    scientificName: 'Accipiter gentilis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El pirata forestal por excelencia, de pecho densamente barrado de gris y ceja blanca agresiva.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'buitre-leonado',
    name: 'Buitre leonado',
    scientificName: 'Gyps fulvus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Gigantesca silueta carroñera planeando sin batir las alas sobre tajos rocosos de la serranía.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'buitre-negro',
    name: 'Buitre negro',
    scientificName: 'Aegypius monachus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Inmenso planeador oscuro y silueta rectangular, anida en grandes alcornoques andaluces.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'alimoche',
    name: 'Alimoche común',
    scientificName: 'Neophron percnopterus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La rapaz sabia de cara amarilla que rompe huevos con piedras. Migradora estival alpina.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'elanio-azul',
    name: 'Elanio azul',
    scientificName: 'Elanus caeruleus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ojos rojos de rubí enmascarados, dorso grisáceo y vuelos que recuerdan a un cernícalo.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'halcon-abejero',
    name: 'Halcón abejero',
    scientificName: 'Pernis apivorus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cazador de nidos de avispas bajo tierra. Cruzador primaveral del Estrecho de Gibraltar.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'halcon-eleonora',
    name: 'Halcón de Eleonora',
    scientificName: 'Falco eleonorae',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Halcón marino migrador adaptado a cazar aves paseriformes cruzando el mar Mediterráneo.',
    habitatTags: ['costa'],
    cadizCommon: false
  },
  {
    id: 'lechuza-comun',
    name: 'Lechuza común',
    scientificName: 'Tyto alba',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Fantasma nocturno de inmaculado pecho blanco y silueta en forma de disco acorazonado.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'mochuelo-europeo',
    name: 'Mochuelo europeo',
    scientificName: 'Athene noctua',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ojos dorados fijos de mirada severa sobre majanos de piedra a plena luz del campo andaluz.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'buho-real',
    name: 'Búho real',
    scientificName: 'Bubo bubo',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La rapaz nocturna más grande del mundo de sutiles moñas cefálicas e impactante canto territorial de ultratumba.',
    habitatTags: ['sierra', 'campo'],
    cadizCommon: true
  },
  {
    id: 'buho-campestre',
    name: 'Búho campestre',
    scientificName: 'Asio flammeus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rapaz nocturna esteparia de ojos penetrantes amarillos rodeados de antifaz ceniciento.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'carabo-comun',
    name: 'Cárabo común',
    scientificName: 'Strix aluco',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Voz territorial forestal de ulular melancólico clásico en alcornocales y olivares viejos.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },

  // --- AVES DE CAMPO Y MONTE ---
  {
    id: 'perdiz-roja',
    name: 'Perdiz roja',
    scientificName: 'Alectoris rufa',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La gallinácea más cotizada del monte andaluz, reconocible por sus patas y pico rojo brillante.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'codorniz-comun',
    name: 'Codorniz común',
    scientificName: 'Coturnix coturnix',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeña y rechoncha saltadora mimética camuflada en siembras de trigo andaluz.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'faisan-comun',
    name: 'Faisán común',
    scientificName: 'Phasianus colchicus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Faisán exótico introducido de larga cola y pecho castaño con cabeza tornasolada verdosa.',
    habitatTags: ['campo'],
    cadizCommon: false
  },
  {
    id: 'abejaruco-europeo',
    name: 'Abejaruco europeo',
    scientificName: 'Merops apiaster',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El ave más colorida de Europa, experta capturadora de abejas al vuelo que cría en taludes terrosos.',
    habitatTags: ['campo', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'martin-pescador',
    name: 'Martín pescador',
    scientificName: 'Alcedo atthis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Dorso azul turquesa brillante destellante flechando ríos y caños de marea salinera.',
    habitatTags: ['rio-laguna', 'costa'],
    cadizCommon: true
  },
  {
    id: 'pico-picapinos',
    name: 'Pico picapinos',
    scientificName: 'Dendrocopos major',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El carpintero forestal más abundante, de plumaje blanquinegro con mancha roja en nuca de machos.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'abubilla',
    name: 'Abubilla',
    scientificName: 'Upupa epops',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Silueta inconfundible con cresta de plumas anaranjadas rematadas de negro y pico muy curvo.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'carraca-europea',
    name: 'Carraca europea',
    scientificName: 'Coracias garrulus',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pájaro azulón de rodillo de dehesas con asombroso plumaje azul turquesa-añil.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'calandria-comun',
    name: 'Calandria común',
    scientificName: 'Melanocorypha calandra',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Llamativas manchas oscuras en collar sobre el pecho, canta imitando decenas de especies.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'terrera-comun',
    name: 'Terrera común',
    scientificName: 'Calandrella brachydactyla',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pequeño pájaro terrero estepario de pecho claro satinado y tonos amarillentos.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'terrera-marismena',
    name: 'Terrera marismeña',
    scientificName: 'Alaudala rufescens',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Frecuenta llanos áridos salinos salitrosos circundantes de marisma arcillosa.',
    habitatTags: ['marisma', 'campo'],
    cadizCommon: true
  },
  {
    id: 'bisbita-comun',
    name: 'Bisbita común',
    scientificName: 'Anthus pratensis',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pardo estriado de andares nerviosos sobre praderas de pastizales húmedos.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'pechiazul',
    name: 'Pechiazul',
    scientificName: 'Luscinia svecica',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Joya de carrizales salineros con asombroso escudo azul de franjas rojizas en el pecho.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'curruca-cabecinegra',
    name: 'Curruca cabecinegra',
    scientificName: 'Curruca melanocephala',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ojo con asombroso anillo ocular rojo coral muy vivo contrastando con el capucho negro de machos.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'curruca-capirotada',
    name: 'Curruca capirotada',
    scientificName: 'Sylvia atricapilla',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Sombrerete negro en machos o castaño en hembras. Alegre habitante de matorrales.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'curruca-rabilarga',
    name: 'Curruca rabilarga',
    scientificName: 'Curruca undata',
    type: 'Aves',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cola muy larga erguida fina de brezal y ulex, plumaje gris hollín violáceo.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },

  // --- MAMÍFEROS DOMÉSTICOS O FÁCILES DE VER ---
  {
    id: 'perro',
    name: 'Perro',
    scientificName: 'Canis lupus familiaris',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Fiel compañero, abundante en dehesas protegiendo fincas o de paseo por entornos urbanos.',
    habitatTags: ['domestico', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'gato',
    name: 'Gato',
    scientificName: 'Felis catus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Silencioso cazador y mascota habitual, común en asfalto y establos rurales.',
    habitatTags: ['domestico', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'caballo',
    name: 'Caballo',
    scientificName: 'Equus caballus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Emblema andaluz de fuerza y estampa noble, sagrado en campiña de Jérez.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'burro',
    name: 'Burro',
    scientificName: 'Equus asinus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Asno doméstico vital e histórico para labores agrícolas, dócil y melancólico.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'vaca',
    name: 'Vaca',
    scientificName: 'Bos taurus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ganado vacuno abundante pastando en la baja comarca aluvial andaluza.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'toro',
    name: 'Toro bravo',
    scientificName: 'Bos taurus (toro)',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Símbolo del campo andaluz de colosal musculatura custodiando dehesas de alcornoque.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'oveja',
    name: 'Oveja',
    scientificName: 'Ovis aries',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lanar dócil pastando en campos agrícolas de secano andaluz.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'cabra',
    name: 'Cabra payoya',
    scientificName: 'Capra hircus (payoya)',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La raza caprina autóctona de la Sierra de Grazalema de cuya leche se hace el queso payoyo.',
    habitatTags: ['domestico', 'campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'cerdo',
    name: 'Cerdo ibérico',
    scientificName: 'Sus scrofa domesticus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De tonalidades oscuras, vital para limpieza de bellota en alcornocales serranos.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'gallina',
    name: 'Gallina',
    scientificName: 'Gallus gallus domesticus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Tradicional ave de corral de pico inquieto en huertas andaluzas.',
    habitatTags: ['domestico', 'campo'],
    cadizCommon: true
  },
  {
    id: 'pavo-real',
    name: 'Pavo real',
    scientificName: 'Pavo cristatus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante desplegador de abanicos cromáticos en grandes jardines públicos.',
    habitatTags: ['domestico', 'urbano'],
    cadizCommon: true
  },

  // --- MAMÍFEROS SILVESTRES ---
  {
    id: 'conejo',
    name: 'Conejo',
    scientificName: 'Oryctolagus cuniculus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lagomorfo fundamental en la cadena trófica, corre hacia hura al menor aviso.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'liebre-iberica',
    name: 'Liebre ibérica',
    scientificName: 'Lepus granatensis',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Estilizada andarina veloz de orejas colosales rematadas en punta de pincel negro.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'erizo-europeo',
    name: 'Erizo europeo',
    scientificName: 'Erinaceus europaeus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rechoncho espinoso buscador de larvas activo al atardecer en parques y setos silvestres.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'ardilla-roja',
    name: 'Ardilla roja',
    scientificName: 'Sciurus vulgaris',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Acróbata forestal abundante en pinares de Roche o San Fernando con graciosa cola tupida indómita.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'raton-campo',
    name: 'Ratón de campo',
    scientificName: 'Apodemus sylvaticus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Roedor nocturno de grandes orejas y ojos negros muy expresivos.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'rata-parda',
    name: 'Rata parda',
    scientificName: 'Rattus norvegicus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De tamaño robusto, habita canalizaciones rurales y rincones urbanos.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'topo-iberico',
    name: 'Topo ibérico',
    scientificName: 'Talpa occidentalis',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Anuncia su presencia mediante pequeños volcanes de tierra fértil excavada en pastos.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'murcielago-comun',
    name: 'Murciélago común',
    scientificName: 'Pipistrellus pipistrellus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El mamífero volador de vuelos erráticos devorador incansable de mosquitos estivales.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'zorro-rojo',
    name: 'Zorro rojo',
    scientificName: 'Vulpes vulpes',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cánido astuto oportunista rojizo de cola rematada en borla blanca.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'meloncillo',
    name: 'Meloncillo',
    scientificName: 'Herpestes ichneumon',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La única mangosta europea, de silueta alargada caminando con crías en perfecta hilera india.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'gineta',
    name: 'Gineta',
    scientificName: 'Genetta genetta',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Maravillosa silueta felina moteada de cola larguísima anillada con gran agilidad nocturna.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'nutria',
    name: 'Nutria paleártica',
    scientificName: 'Lutra lutra',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Excelente nadadora de ríos andaluces de bigotes sensitivos y pelaje impermeable.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'turon',
    name: 'Turón',
    scientificName: 'Mustela putorius',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Mustélido de antifaz blanco de hábitos discretos y montanos fluviales.',
    habitatTags: ['campo', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'comadreja',
    name: 'Comadreja',
    scientificName: 'Mustela nivalis',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El carnívoro más pequeño de cuerpo serpenteante capaz de colarse en madrigueras.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'tejon',
    name: 'Tejón europeo',
    scientificName: 'Meles meles',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Escavador concienzudo de rostro rayado blanco y negro de costumbres pacíficas.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'gato-montes',
    name: 'Gato montés',
    scientificName: 'Felis silvestris',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Felino indomable forestal más robusto de cola cortada abruptamente en punta negra.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'jabali',
    name: 'Jabalí',
    scientificName: 'Sus scrofa',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Impresionante suido salvaje nocturno buscador de tubérculos hozando el monte seco.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'ciervo',
    name: 'Ciervo común',
    scientificName: 'Cervus elaphus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Rey de los bosques serranos andaluces famoso por los bramidos roncos otoñales de berrea.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'corzo',
    name: 'Corzo andaluz',
    scientificName: 'Capreolus capreolus (garganta blanca)',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El duende forestal esquivo de Los Alcornocales, subespecie relíctica adaptada.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'gamo',
    name: 'Gamo',
    scientificName: 'Dama dama',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante ciervo moteado de cuerna palmeada introducido en Doñana y dehesas costeras.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'cabra-montes',
    name: 'Cabra montés',
    scientificName: 'Capra pyrenaica',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Acróbata asombrosa del roquedo escarpado de la Sierra de Grazalema.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'muflon',
    name: 'Muflón',
    scientificName: 'Ovis gmelini',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Carnero salvaje de grandes cuernos espiralados introducido con fines cinegéticos.',
    habitatTags: ['sierra'],
    cadizCommon: true
  },
  {
    id: 'liron-careto',
    name: 'Lirón careto',
    scientificName: 'Eliomys quercinus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Precioso roedor arbóreo de grandes "antifaces oscuros" en la cara y cola de pincel.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'musarana',
    name: 'Musaraña común',
    scientificName: 'Crocidura russula',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Insectívoro minúsculo de metabolismo hiperactivo que devora bichos entre hojarasca.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'lince-iberico',
    name: 'Lince ibérico',
    scientificName: 'Lynx pardinus',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El felino más amenazado del planeta, con icónicos pinceles negros en orejas. Presente en Doñana.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },

  // --- REPTILES ---
  {
    id: 'camaleon-comun',
    name: 'Camaleón común',
    scientificName: 'Chamaeleo chamaeleon',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Emblemático reptil lento de ojos independientes y asombrosa puntería con la lengua. Símbolo de pinares costeros de Rota y Tarifa.',
    habitatTags: ['costa', 'campo'],
    cadizCommon: true
  },
  {
    id: 'salamanquesa-comun',
    name: 'Salamanquesa común',
    scientificName: 'Tarentola mauritanica',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lagarto nocturno trepador de espectaculares lamelas adhesivas en pies, caza mosquitos de farolas.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'salamanquesa-rosada',
    name: 'Salamanquesa rosada',
    scientificName: 'Hemidactylus turcicus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Algo más pequeña traslúcida rosácea con tubérculos marcados.',
    habitatTags: ['urbano', 'campo'],
    cadizCommon: true
  },
  {
    id: 'lagartija-iberica',
    name: 'Lagartija ibérica',
    scientificName: 'Podarcis virescens',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Muy común trepando muros soleados de pueblos y ruinas andaluzas.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'lagartija-colilarga',
    name: 'Lagartija colilarga',
    scientificName: 'Psammodromus algirus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lagartija de gran tamaño de cola larguísima y costados rayados dorados, escurridiza bajo hojas secas de quercus.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'lagartija-colirroja',
    name: 'Lagartija colirroja',
    scientificName: 'Acanthodactylus erythrurus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Vive en dunas costeras arenosas. Juveniles con asombrosa cola rojo carmín vivo ondulando en huidas.',
    habitatTags: ['campo', 'costa'],
    cadizCommon: true
  },
  {
    id: 'lagartija-cenicienta',
    name: 'Lagartija cenicienta',
    scientificName: 'Psammodromus hispanicus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Minúscula lagartija de pastizales áridos y matorral bajo campiñés.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'lagarto-ocelado',
    name: 'Lagarto ocelado',
    scientificName: 'Timon lepidus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El lagarto más grande de Europa de asombrosos ocelos azules brillantes pintados en sus costados.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'eslizon-iberico',
    name: 'Eslizón ibérico',
    scientificName: 'Chalcides bedriagai',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Lagarto cilíndrico de patas minúsculas nadando literalmente sobre tierra suelta arenosa.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'eslizon-tridactilo',
    name: 'Eslizón tridáctilo',
    scientificName: 'Chalcides striatus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Aún más alargado con patitas reducidas a tres dedos imperceptibles, habita pastos húmedos.',
    habitatTags: ['campo', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'culebrilla-ciega',
    name: 'Culebrilla ciega',
    scientificName: 'Blanus cinereus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Reptil amfisbenio de vida subterránea que recuerda a una lombriz robusta rosada.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'culebra-herradura',
    name: 'Culebra de herradura',
    scientificName: 'Hemorrhois hippocrepis',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Elegante y rápida trepadora de asombroso diseño geométrico oscuro, común cerca de cortijos urbanos.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'culebra-escalera',
    name: 'Culebra de escalera',
    scientificName: 'Zamenis scalaris',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Juveniles exhiben un diseño en "H" que simula los peldaños de una escalera de mano.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'culebra-bastarda',
    name: 'Culebra bastarda',
    scientificName: 'Malpolon monspessulanus',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ofidio gigante de mirada fiera debido a cejas muy prominentes sobre el ojo.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'culebra-viperina',
    name: 'Culebra viperina',
    scientificName: 'Natrix maura',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Excelente nadadora fluvial totalmente inofensiva que imita a la víbora en silueta y marcas.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'culebra-collar',
    name: 'Culebra de collar',
    scientificName: 'Natrix astreptophora',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Semiacuática portadora de collar pálido en la nuca juvenil.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },
  {
    id: 'culebra-cogulla',
    name: 'Culebra de cogulla',
    scientificName: 'Macroprotodon brevis',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Ofidio minúsculo inofensivo de costumbres cavadoras bajo piedras.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'culebra-lisa-meridional',
    name: 'Culebra lisa meridional',
    scientificName: 'Coronella girondica',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De complexión dócil con marcas dorsales transversales oscuras.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },
  {
    id: 'vibora-hocicuda',
    name: 'Víbora hocicuda',
    scientificName: 'Vipera latastei',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La única víbora andaluza, reconocible por hocico levantado sutilmente y pupila vertical rasgada.',
    habitatTags: ['sierra', 'campo'],
    cadizCommon: true
  },
  {
    id: 'galapago-europeo',
    name: 'Galápago europeo',
    scientificName: 'Emys orbicularis',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Preciosa tortuga de agua moteada de chispas amarillas-doradas.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'galapago-leproso',
    name: 'Galápago leproso',
    scientificName: 'Mauremys leprosa',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El galápago ribereño nativo más abundante de ríos y arroyos temporales.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'tortoga-mora',
    name: 'Tortuga mora',
    scientificName: 'Testudo graeca',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Tortuga terrestre de caparazón abombado presente en pinares relicto.',
    habitatTags: ['campo'],
    cadizCommon: false
  },
  {
    id: 'tortuga-boba',
    name: 'Tortuga boba',
    scientificName: 'Caretta caretta',
    type: 'Reptiles',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Grandiosa tortuga marina que patrulla costas oceánicas ricas en medusas.',
    habitatTags: ['costa'],
    cadizCommon: true
  },

  // --- ANFIBIOS ---
  {
    id: 'rana-comun',
    name: 'Rana común',
    scientificName: 'Pelophylax perezi',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'La reina ruidosa indiscutible de lagunas y caños, de cantares potentes primaverales.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'ranita-meridional',
    name: 'Ranita meridional',
    scientificName: 'Hyla meridionalis',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Minúscula ranita de un verde fosforito espectacular trepadora de hojas de eneas y juncos.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'sapo-comun',
    name: 'Sapo de espuelas',
    scientificName: 'Pelobates cultripes',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Sapo cavador con acicates negros en las patas traseras que le permiten excavar en dunas costeras.',
    habitatTags: ['campo', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'sapo-corredor',
    name: 'Sapo corredor',
    scientificName: 'Epidalea calamita',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De andares rápidos sin saltar reconocible por una fina línea de color azufre en el lomo.',
    habitatTags: ['campo', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'sapillo-pintojo',
    name: 'Sapillo pintojo meridional',
    scientificName: 'Discoglossus jeanneae',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Silueta ágil anfibia parecida a una rana de piel moteada irregular.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },
  {
    id: 'gallipato',
    name: 'Gallipato',
    scientificName: 'Pleurodeles waltl',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'El tritón más grande de Europa conocido por sacar sus costillas defensivas perforando la piel.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },
  {
    id: 'salamandra',
    name: 'Salamandra común',
    scientificName: 'Salamandra salamandra (longirostris)',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Asombrosa coloración de advertencia amarilla y negra sobre charquitos de Grazalema lluviosa.',
    habitatTags: ['sierra', 'campo'],
    cadizCommon: true
  },
  {
    id: 'triton-pigmeo',
    name: 'Tritón pigmeo',
    scientificName: 'Triturus pygmaeus',
    type: 'Anfibios',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Exquisito tritón verde brillante y negro con línea dorsal naranja en hembras de Doñana.',
    habitatTags: ['rio-laguna', 'campo'],
    cadizCommon: true
  },

  // --- PECES CON HÁBITATS MARINOS O FLUVIALES ---
  {
    id: 'carpa-comun',
    name: 'Carpa común',
    scientificName: 'Cyprinus carpio',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pez de fondo de gran robustez adaptado a lagunas de aguas tranquilas.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'barbo',
    name: 'Barbo de Sclater',
    scientificName: 'Luciobarbus sclateri',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Pez de río nativo provisto de barbillas sensoriales buscando comida en graveras.',
    habitatTags: ['rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'anguila-europea',
    name: 'Anguila europea',
    scientificName: 'Anguilla anguilla',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Asombroso ciclo vital viajando al Mar de los Sargazos. Común en caños y esteros gaditanos.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'lubina',
    name: 'Lubina',
    scientificName: 'Dicentrarchus labrax',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Cazador plateado elegante que patrulla escolleras y canales salineros ricos en camarones.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'dorada',
    name: 'Dorada',
    scientificName: 'Sparus aurata',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Banda dorada en la frente interocular distintiva. Frecuenta esteros de la Bahía.',
    habitatTags: ['costa', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'sargo',
    name: 'Sargo',
    scientificName: 'Diplodus sargus',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De cuerpo redondeado con franjas negras verticales de litorales rocosos.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'lisa',
    name: 'Lisa',
    scientificName: 'Chelon ramada',
    type: 'Peces',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Muy abundante adaptada a caños salineros bajos pastando limos orgánicos.',
    habitatTags: ['marisma', 'rio-laguna'],
    cadizCommon: true
  },
  {
    id: 'cangrejo-violinista',
    name: 'Cangrejo violinista',
    scientificName: 'Afruca tangeri',
    type: 'Crustáceos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Símbolo del fango de la Bahía "boca de la isla". Machos agitan una enorme pinza gesticulando.',
    habitatTags: ['marisma', 'costa'],
    cadizCommon: true
  },

  // --- INSECTOS ---
  {
    id: 'abeja-miel',
    name: 'Abeja de la miel',
    scientificName: 'Apis mellifera',
    type: 'Insectos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Polinizadora vital fundamental abundante en campos de monte mediterráneo lidiando lavanda.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'abejorro',
    name: 'Abejorro común',
    scientificName: 'Bombus terrestris',
    type: 'Insectos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Corpulento himenóptero zumbador peludo tricolor de polinización eficaz.',
    habitatTags: ['campo', 'urbano'],
    cadizCommon: true
  },
  {
    id: 'mariposa-monarca',
    name: 'Mariposa monarca',
    scientificName: 'Danaus plexippus',
    type: 'Insectos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Grandiosa viajera naranja de venas negras con colonias relictas en humedales andaluces.',
    habitatTags: ['campo', 'costa'],
    cadizCommon: true
  },
  {
    id: 'libelula',
    name: 'Libélula emperador',
    scientificName: 'Anax imperator',
    type: 'Insectos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Veloz cazador aéreo de asombroso color azul turquesa patrullando charcas y arroyos.',
    habitatTags: ['rio-laguna', 'marisma'],
    cadizCommon: true
  },
  {
    id: 'mantis',
    name: 'Mantis religiosa',
    scientificName: 'Mantis religiosa',
    type: 'Insectos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Prepredador fascinante mimético de patas delanteras armadas en plegaria.',
    habitatTags: ['campo'],
    cadizCommon: true
  },

  // --- ARÁCNIDOS ---
  {
    id: 'arana-lobo',
    name: 'Araña lobo',
    scientificName: 'Lycosidae species',
    type: 'Arácnidos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Caza a la carrera por el suelo sin tejer telaraña carrying su saco de huevos detrás.',
    habitatTags: ['campo'],
    cadizCommon: true
  },
  {
    id: 'escorpion-comun',
    name: 'Escorpión común',
    scientificName: 'Buthus occitanus',
    type: 'Arácnidos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Alacrán amarillento de cola armada con ponzoña activo bajo piedras soleadas de campiña.',
    habitatTags: ['campo', 'sierra'],
    cadizCommon: true
  },

  // --- MOLUSCOS ---
  {
    id: 'pulpo-comun',
    name: 'Pulpo común',
    scientificName: 'Octopus vulgaris',
    type: 'Moluscos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Asombroso cefalópodo inteligente mimético abundante en fondos intermareales rocosos.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'coquina-cadiz',
    name: 'Coquina',
    scientificName: 'Donax trunculus',
    type: 'Moluscos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Exquisito bivalvo abundante recolectado en orillas arenosas gaditanas batidas por olas.',
    habitatTags: ['costa'],
    cadizCommon: true
  },

  // --- CETÁCEOS Y MARINOS COSTAS ---
  {
    id: 'delfin-comun',
    name: 'Delfín común',
    scientificName: 'Delphinus delphis',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'De lomos oscuros con dibujo lateral en "reloj de arena" amarillento. Gran saltador del Estrecho.',
    habitatTags: ['costa'],
    cadizCommon: true
  },
  {
    id: 'orca-estrecho',
    name: 'Orca del Estrecho',
    scientificName: 'Orcinus orca (Estrecho)',
    type: 'Mamíferos',
    imageUrl: '',
    gallery: [],
    seenCount: 0,
    description: 'Clan residente amenazado que compite por el atún rojo en aguas profundas del Estrecho.',
    habitatTags: ['costa'],
    cadizCommon: true
  }
];

export const INITIAL_OUTINGS: Outing[] = [];

export const INITIAL_SIGHTINGS: Sighting[] = [];
