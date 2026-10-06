"use strict";

var WIKI = {

  estrellas: [
    {n:"Sirius",ic:"*",t:"Estrella",ra:"06h 45m",dec:"-16 43",
     mag:"-1.46",dist:"8.6 al",
     desc:"La estrella mas brillante del cielo nocturno. Es un sistema binario: Sirius A (la que vemos) y Sirius B, una enana blanca muy densa. Forma parte de la constelacion del Can Mayor.",
     ver:"Visible desde casi todo el planeta. En el sur se ve en verano y otono; en el norte en invierno. Imposible confundirla por su brillo y su centelleo caracteristico.",
     cur:"Los egipcios la usaban para predecir la crecida del Nilo. Su nombre viene del griego y significa 'brillante'."},

    {n:"Canopus",ic:"*",t:"Estrella",ra:"06h 24m",dec:"-52 42",
     mag:"-0.72",dist:"310 al",
     desc:"La segunda estrella mas brillante del cielo. Es una supergigante blanco-amarillenta, mucho mas grande y luminosa que el Sol.",
     ver:"Solo visible desde el hemisferio sur y latitudes bajas del norte. En Argentina y Chile es circumpolar en el sur del pais.",
     cur:"Es usada como referencia de navegacion espacial por su brillo estable y su posicion fuera del plano de la ecliptica."},

    {n:"AlfaCen",ic:"*",t:"Estrella triple",ra:"14h 39m",dec:"-60 50",
     mag:"-0.27",dist:"4.4 al",
     desc:"El sistema estelar mas cercano al Sol. Formado por tres estrellas: Alfa Centauri A, B y Proxima Centauri, una enana roja con planetas conocidos.",
     ver:"Visible desde el hemisferio sur, en la constelacion del Centauro. Una de las estrellas que apunta hacia la Cruz del Sur.",
     cur:"Proxima Centauri es la estrella mas cercana al Sol, a solo 4.24 anos luz. Tiene al menos un planeta en zona habitable."},

    {n:"Proxima Centauri",ic:"*",t:"Enana roja",ra:"14h 29m",dec:"-62 40",
     mag:"11.13",dist:"4.24 al",
     desc:"La estrella mas cercana al Sol. Es una enana roja muy tenue, invisible a simple vista. Tiene al menos tres planetas confirmados.",
     ver:"Solo visible con telescopios medianos desde el hemisferio sur.",
     cur:"Su planeta Proxima b esta en la zona habitable, pero la estrella emite llamaradas que probablemente arrasarian su atmosfera."},

    {n:"Arturo",ic:"*",t:"Gigante naranja",ra:"14h 15m",dec:"+19 10",
     mag:"-0.05",dist:"37 al",
     desc:"La estrella mas brillante del hemisferio norte celeste. Es una gigante naranja, mas vieja y grande que el Sol.",
     ver:"Se encuentra siguiendo el arco de la cola de la Osa Mayor (arco a Arturo). Visible en primavera y verano del hemisferio norte, otono en el sur.",
     cur:"Se mueve muy rapido por el cielo, a 122 km/s respecto al Sol."},

    {n:"Vega",ic:"*",t:"Estrella blanca",ra:"18h 36m",dec:"+38 47",
     mag:"0.03",dist:"25 al",
     desc:"Una de las estrellas mas brillantes del cielo y la quinta mas luminosa. Esta rodeada por un disco de polvo y posiblemente planetas.",
     ver:"En el hemisferio norte es visible en verano formando el Triangulo de Verano junto a Deneb y Altair.",
     cur:"Fue la estrella polar hace unos 12.000 anos y lo volvera a ser en unos 13.000 anos por la precesion."},

    {n:"Capella",ic:"*",t:"Sistema multiple",ra:"05h 16m",dec:"+45 59",
     mag:"0.08",dist:"43 al",
     desc:"En realidad son cuatro estrellas en dos pares. La mas brillante es una gigante amarilla.",
     ver:"Muy visible en el hemisferio norte durante el invierno. Es la estrella mas brillante de la constelacion del Cochero.",
     cur:"Esta a punto de convertirse en gigante roja y luego en enana blanca, similar a lo que le pasara al Sol."},

    {n:"Rigel",ic:"*",t:"Supergigante azul",ra:"05h 14m",dec:"-08 12",
     mag:"0.13",dist:"860 al",
     desc:"Una supergigante azul extremadamente luminosa: brilla como 120.000 soles. Es el pie de Orion.",
     ver:"Visible en invierno del hemisferio norte y verano del sur. Es la mas brillante de Orion, mas que Betelgeuse.",
     cur:"Terminara su vida como supernova en unos millones de anos."},

    {n:"Procyon",ic:"*",t:"Estrella doble",ra:"07h 39m",dec:"+05 13",
     mag:"0.34",dist:"11.5 al",
     desc:"Una de las estrellas mas cercanas al Sol. Sistema binario con una enana blanca tenue.",
     ver:"Forma el Triangulo de Invierno con Sirius y Betelgeuse.",
     cur:"Su nombre significa 'antes del perro' porque sale poco antes que Sirius, la estrella del perro."},

    {n:"Betelgeuse",ic:"*",t:"Supergigante roja",ra:"05h 55m",dec:"+07 24",
     mag:"0.42",dist:"640 al",
     desc:"Supergigante roja al final de su vida. Tan grande que si estuviera en el lugar del Sol llegaria hasta Jupiter.",
     ver:"Es el hombro de Orion. Su color rojizo es evidente a simple vista.",
     cur:"En 2019-2020 sufrio un oscurecimiento por polvo expulsado. Explotara como supernova en los proximos 100.000 anos."},

    {n:"Achernar",ic:"*",t:"Estrella azul",ra:"01h 37m",dec:"-57 14",
     mag:"0.46",dist:"139 al",
     desc:"Una de las estrellas mas achatadas conocidas: gira tan rapido que su diametro ecuatorial es 1.5 veces el polar.",
     ver:"Visible desde el hemisferio sur. Es el final del rio Eridano.",
     cur:"Su nombre arabe significa 'el final del rio'."},

    {n:"Altair",ic:"*",t:"Estrella blanca",ra:"19h 50m",dec:"+08 52",
     mag:"0.77",dist:"16.7 al",
     desc:"Una de las estrellas mas cercanas visibles a simple vista. Es el vertice del Triangulo de Verano.",
     ver:"Se ve en verano del hemisferio norte, en la constelacion del Aguila.",
     cur:"Gira tan rapido que esta achatada, similar a Achernar."},

    {n:"Aldebaran",ic:"*",t:"Gigante naranja",ra:"04h 35m",dec:"+16 30",
     mag:"0.85",dist:"65 al",
     desc:"El ojo del Toro. Gigante naranja, la estrella mas brillante de la constelacion de Tauro.",
     ver:"En invierno del hemisferio norte. Se ve facil porque esta rodeada por el cumulo de las Hyades.",
     cur:"Su nombre significa 'el seguidor', porque sigue a las Pleyades."},

    {n:"Antares",ic:"*",t:"Supergigante roja",ra:"16h 29m",dec:"-26 25",
     mag:"0.96",dist:"550 al",
     desc:"El corazon del Escorpion. Supergigante roja, similar a Betelgeuse, 700 veces mas grande que el Sol.",
     ver:"Visible en verano del hemisferio sur y en verano del norte en latitudes bajas.",
     cur:"Su nombre significa 'rival de Marte' por su color rojizo."},

    {n:"Espiga",ic:"*",t:"Estrella azul",ra:"13h 25m",dec:"-11 09",
     mag:"0.98",dist:"250 al",
     desc:"Estrella binaria muy caliente. Es la mas brillante de Virgo.",
     ver:"En el hemisferio norte en primavera, en el sur en otono.",
     cur:"Gira tan rapido que esta cerca de romperse."},

    {n:"Pollux",ic:"*",t:"Gigante naranja",ra:"07h 45m",dec:"+28 01",
     mag:"1.14",dist:"34 al",
     desc:"La mas brillante de Geminis. Tiene un planeta confirmado, Pollux b, un gigante gaseoso.",
     ver:"Invierno del hemisferio norte.",
     cur:"Es la estrella gigante mas cercana a nosotros."},

    {n:"Fomalhaut",ic:"*",t:"Estrella blanca",ra:"22h 57m",dec:"-29 37",
     mag:"1.16",dist:"25 al",
     desc:"Rodeada por un anillo de polvo y escombros donde se forman planetas.",
     ver:"Otono del hemisferio norte, en el sur del cielo. En el sur es visible en primavera.",
     cur:"Es la 'estrella solitaria' del otono: esta en una zona con pocas estrellas brillantes."},

    {n:"Deneb",ic:"*",t:"Supergigante blanca",ra:"20h 41m",dec:"+45 16",
     mag:"1.25",dist:"2600 al",
     desc:"Una de las estrellas mas luminosas conocidas: brilla como 200.000 soles. Es la cola del Cisne.",
     ver:"Verano del hemisferio norte. Vertice del Triangulo de Verano.",
     cur:"Es la estrella mas lejana visible a simple vista con ese brillo."},

    {n:"Regulo",ic:"*",t:"Estrella azul",ra:"10h 08m",dec:"+11 58",
     mag:"1.35",dist:"79 al",
     desc:"El corazon del Leon. Muy caliente y joven, solo unos cientos de millones de anos.",
     ver:"Primavera del hemisferio norte.",
     cur:"Gira muy rapido, casi a velocidad de ruptura."},

    {n:"Bellatrix",ic:"*",t:"Gigante azul",ra:"05h 25m",dec:"+06 20",
     mag:"1.64",dist:"250 al",
     desc:"El hombro izquierdo de Orion. Gigante azul muy caliente.",
     ver:"Invierno del hemisferio norte.",
     cur:"Su nombre significa 'la guerrera'."},

    {n:"Polaris",ic:"*",t:"Supergigante amarilla",ra:"02h 31m",dec:"+89 15",
     mag:"1.98",dist:"430 al",
     desc:"La estrella polar. Esta casi exactamente sobre el polo norte celeste, por lo que no se mueve casi nada en el cielo.",
     ver:"Siempre visible en el hemisferio norte. Su altura sobre el horizonte es igual a tu latitud norte.",
     cur:"En realidad es un sistema triple. No siempre fue la polar: por la precesion, la polar cambia cada miles de anos."},

    {n:"Alphard",ic:"*",t:"Gigante naranja",ra:"09h 27m",dec:"-08 39",
     mag:"1.98",dist:"177 al",
     desc:"La mas brillante de la Hidra. Gigante naranja.",
     ver:"Primavera del hemisferio norte.",
     cur:"Su nombre significa 'la solitaria de la serpiente'."},

    {n:"Castor",ic:"*",t:"Sistema sextuple",ra:"07h 34m",dec:"+31 53",
     mag:"1.58",dist:"51 al",
     desc:"En realidad es un sistema de seis estrellas ligadas. Una de las gemelas de Geminis.",
     ver:"Invierno del hemisferio norte.",
     cur:"Es un excelente objeto para telescopios pequenos: se distinguen las dos principales."},

    {n:"Elnath",ic:"*",t:"Gigante azul",ra:"05h 26m",dec:"+28 36",
     mag:"1.65",dist:"130 al",
     desc:"El cuerno norte del Toro. Gigante azul.",
     ver:"Invierno del hemisferio norte.",
     cur:"Originalmente pertenecia a Tauro pero hoy tambien se le considera parte del Cochero."},

    {n:"Shaula",ic:"*",t:"Gigante azul",ra:"17h 33m",dec:"-37 06",
     mag:"1.62",dist:"570 al",
     desc:"El aguijon del Escorpion. Una de las estrellas mas brillantes cerca del centro galactico.",
     ver:"Verano del hemisferio sur.",
     cur:"Su nombre significa 'el aguijon' en arabe."},

    {n:"Alnilam",ic:"*",t:"Supergigante azul",ra:"05h 36m",dec:"-01 12",
     mag:"1.69",dist:"1300 al",
     desc:"La estrella central del Cinturon de Orion.",
     ver:"Invierno del hemisferio norte, verano del sur.",
     cur:"Es la mas brillante de las tres del cinturon."},

    {n:"Adhara",ic:"*",t:"Estrella azul",ra:"06h 58m",dec:"-28 58",
     mag:"1.50",dist:"430 al",
     desc:"La segunda mas brillante del Can Mayor, detras de Sirius.",
     ver:"Verano del hemisferio sur.",
     cur:"Hace unos 4 millones de anos fue la estrella mas brillante del cielo, cuando estaba mucho mas cerca."},

    {n:"Albireo",ic:"*",t:"Estrella doble",ra:"19h 30m",dec:"+27 57",
     mag:"3.1",dist:"430 al",
     desc:"Una de las dobles mas bellas del cielo. Un componente es dorado y el otro azul, formando un contraste precioso.",
     ver:"Verano del hemisferio norte, en la cabeza del Cisne. Con telescopios pequenos ya se separan los colores.",
     cur:"Es el objeto favorito de muchos aficionados por su belleza."},

    {n:"Mizar",ic:"*",t:"Estrella multiple",ra:"13h 24m",dec:"+54 55",
     mag:"2.23",dist:"83 al",
     desc:"La estrella del centro del Carro de la Osa Mayor. Es un sistema cuádruple. Alcor, su companera, es visible a simple vista en cielos oscuros.",
     ver:"Todo el ano en el hemisferio norte.",
     cur:"Mizar y Alcor eran usadas como test de vista en la antiguedad."},

    {n:"Algol",ic:"*",t:"Estrella variable",ra:"03h 08m",dec:"+40 57",
     mag:"2.1-3.4",dist:"90 al",
     desc:"La 'estrella del demonio'. Es una binaria eclipsante: cada 2.87 dias una estrella tapa parcialmente a la otra y su brillo cae visiblemente.",
     ver:"Visible desde el hemisferio norte en otono e invierno. Se puede ver el cambio de brillo a simple vista.",
     cur:"Los arabes ya conocian su variabilidad en el siglo X."},

    {n:"Estrella de Barnard",ic:"*",t:"Enana roja",ra:"17h 58m",dec:"+04 41",
     mag:"9.5",dist:"5.96 al",
     desc:"La estrella con mayor movimiento propio del cielo. Se mueve muy rapido respecto al fondo.",
     ver:"Con telescopios medianos, en Ofiuco.",
     cur:"En 10.000 anos habra cambiado de posicion apreciablemente respecto a las otras estrellas."},

    {n:"Tau Ceti",ic:"*",t:"Enana amarilla",ra:"01h 44m",dec:"-15 56",
     mag:"3.5",dist:"11.9 al",
     desc:"Una estrella muy parecida al Sol, a solo 12 anos luz. Tiene al menos cinco planetas conocidos.",
     ver:"Visible a simple vista desde el hemisferio sur, en la Ballena.",
     cur:"Fue candidata a tener civilizaciones extraterrestres en los anos 60."}
  ],

  constelaciones: [
    {n:"Orion",ic:"O",t:"Constelacion",ra:"05h 30m",dec:"+00",
     mag:"Varias",dist:"-",
     desc:"La constelacion mas reconocible del cielo. El cazador Orion con su cinturon de tres estrellas (Alnitak, Alnilam y Mintaka) es inconfundible. Tiene dos supergigantes brillantes: Betelgeuse y Rigel.",
     ver:"Invierno del hemisferio norte, verano del sur. Ademas de las estrellas principales, tiene la nebulosa M42 debajo del cinturon.",
     cur:"Su cinturon apunta hacia Sirius (un lado) y hacia Aldebaran (el otro). Es un excelente punto de partida para orientarse."},

    {n:"Osa Mayor",ic:"O",t:"Constelacion",ra:"12h 00m",dec:"+55",
     mag:"Varias",dist:"-",
     desc:"La constelacion del hemisferio norte mas famosa. Sus siete estrellas mas brillantes forman el 'Carro' o 'Cazo': Dubhe, Merak, Phecda, Megrez, Alioth, Mizar y Alkaid.",
     ver:"Circumpolar en gran parte del hemisferio norte. Visible todo el ano.",
     cur:"Si trazas una linea desde Merak hasta Dubhe y la extendes 5 veces, llegas a Polaris."},

    {n:"Osa Menor",ic:"O",t:"Constelacion",ra:"15h 00m",dec:"+75",
     mag:"Varias",dist:"-",
     desc:"Contiene a Polaris, la estrella polar. Tiene forma de cazo pequeno pero sus estrellas son mas debiles que las de la Osa Mayor.",
     ver:"Siempre visible en el hemisferio norte.",
     cur:"Su principal utilidad es encontrar el norte: Polaris es la ultima estrella del mango del cazo."},

    {n:"Casiopea",ic:"O",t:"Constelacion",ra:"01h 00m",dec:"+60",
     mag:"Varias",dist:"-",
     desc:"Su forma de W la hace inconfundible. Es la reina sentada en su trono. Se encuentra al otro lado de Polaris respecto a la Osa Mayor.",
     ver:"Circumpolar en el hemisferio norte.",
     cur:"En su interior esta la Nebulosa del Corazon (IC 1805) y la Nebulosa del Alma (IC 1848)."},

    {n:"Cruz del Sur",ic:"O",t:"Constelacion",ra:"12h 30m",dec:"-60",
     mag:"Varias",dist:"-",
     desc:"La constelacion mas pequena pero una de las mas famosas del hemisferio sur. Formada por cuatro estrellas brillantes: Acrux, Becrux, Gacrux y Delta Crucis.",
     ver:"Visible desde el hemisferio sur y latitudes bajas del norte.",
     cur:"Su eje mayor apunta hacia el polo sur celeste. Ayuda a encontrar el sur."},

    {n:"Escorpio",ic:"O",t:"Constelacion zodiacal",ra:"16h 30m",dec:"-30",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con forma de escorpion. En su corazon esta Antares, una supergigante roja. Su cola termina en Shaula y Lesath.",
     ver:"Verano del hemisferio sur, verano del norte en latitudes bajas.",
     cur:"Cerca de su cola esta el centro de la Via Lactea."},

    {n:"Sagitario",ic:"O",t:"Constelacion zodiacal",ra:"19h 00m",dec:"-25",
     mag:"Varias",dist:"-",
     desc:"Apunta hacia el centro de la Via Lactea. Tiene forma de tetera. Contiene gran cantidad de objetos Messier.",
     ver:"Invierno del hemisferio sur, verano del norte en latitudes bajas.",
     cur:"Aqui esta Sagitario A*, el agujero negro supermasivo del centro galactico."},

    {n:"Capricornio",ic:"O",t:"Constelacion zodiacal",ra:"21h 00m",dec:"-20",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con forma triangular. Es una de las mas debiles del zodiaco.",
     ver:"Verano del hemisferio sur, otono del norte.",
     cur:"En la antiguedad marcaba el solsticio de invierno para el hemisferio norte."},

    {n:"Acuario",ic:"O",t:"Constelacion zodiacal",ra:"22h 30m",dec:"-10",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal grande pero con estrellas debiles. Contiene el radiante de las Eta Acuaridas y Delta Acuaridas.",
     ver:"Otono del hemisferio sur, otono del norte.",
     cur:"Es la era astrologica actual (Era de Acuario)."},

    {n:"Piscis",ic:"O",t:"Constelacion zodiacal",ra:"00h 30m",dec:"+10",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con dos peces unidos por una cuerda. Contiene el punto Aries, referencia de la astronomia.",
     ver:"Otono del hemisferio norte.",
     cur:"El punto vernal (donde el Sol cruza el ecuador celeste) esta en Piscis, aunque se llama punto Aries."},

    {n:"Aries",ic:"O",t:"Constelacion zodiacal",ra:"02h 30m",dec:"+20",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal pequena. Su estrella mas brillante es Hamal.",
     ver:"Otono e invierno del hemisferio norte.",
     cur:"En la antiguedad contenia el punto vernal, del cual tomo su nombre."},

    {n:"Tauro",ic:"O",t:"Constelacion zodiacal",ra:"04h 30m",dec:"+17",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con Aldebaran como ojo del toro. Contiene las Hyades y las Pleyades (M45).",
     ver:"Invierno del hemisferio norte.",
     cur:"Las Pleyades son visibles a simple vista y son un cumulo abierto de unas 1.000 estrellas."},

    {n:"Geminis",ic:"O",t:"Constelacion zodiacal",ra:"07h 00m",dec:"+22",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con las dos estrellas brillantes Castor y Pollux, los gemelos mitologicos.",
     ver:"Invierno del hemisferio norte.",
     cur:"Es el radiante de las Geminidas, una de las mejores lluvias de meteoros del ano."},

    {n:"Cancer",ic:"O",t:"Constelacion zodiacal",ra:"08h 30m",dec:"+20",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal debil. Contiene el Pesebre (M44), un cumulo abierto visible a simple vista.",
     ver:"Invierno y primavera del hemisferio norte.",
     cur:"Es la constelacion zodiacal mas debil."},

    {n:"Leo",ic:"O",t:"Constelacion zodiacal",ra:"10h 30m",dec:"+15",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con forma de leon agachado. Regulo es su corazon.",
     ver:"Primavera del hemisferio norte.",
     cur:"Contiene muchas galaxias brillantes del Cumulo de Leo."},

    {n:"Virgo",ic:"O",t:"Constelacion zodiacal",ra:"13h 00m",dec:"-02",
     mag:"Varias",dist:"-",
     desc:"La segunda constelacion mas grande del cielo. Contiene el Cumulo de Virgo, con miles de galaxias.",
     ver:"Primavera del hemisferio norte.",
     cur:"En su centro esta M87, la galaxia del agujero negro fotografiado en 2019."},

    {n:"Libra",ic:"O",t:"Constelacion zodiacal",ra:"15h 00m",dec:"-15",
     mag:"Varias",dist:"-",
     desc:"Constelacion zodiacal con forma de balanza. Antiguamente era parte de Escorpio.",
     ver:"Verano del hemisferio sur.",
     cur:"Sus estrellas mas brillantes tienen nombres arabes: Zubenelgenubi y Zubeneschamali."},

    {n:"Ofiuco",ic:"O",t:"Constelacion zodiacal",ra:"17h 00m",dec:"-05",
     mag:"Varias",dist:"-",
     desc:"La constelacion 13 del zodiaco. El Sol la atraviesa durante 18 dias al ano, aunque historicamente no se considera signo.",
     ver:"Verano del hemisferio norte.",
     cur:"Fue agregada al zodiaco en 1930, causando polemica con los astrologos."},

    {n:"Andromeda",ic:"O",t:"Constelacion",ra:"01h 00m",dec:"+38",
     mag:"Varias",dist:"-",
     desc:"Contiene la galaxia de Andromeda (M31), la mas cercana a la Via Lactea. Tiene forma de cadena.",
     ver:"Otono del hemisferio norte.",
     cur:"Su nombre viene de la mitologia griega: la princesa rescatada por Perseo."},

    {n:"Perseo",ic:"O",t:"Constelacion",ra:"03h 00m",dec:"+45",
     mag:"Varias",dist:"-",
     desc:"Constelacion en forma de Y. Contiene el Doble Cumulo (NGC 869 y 884) y es el radiante de las Perseidas.",
     ver:"Otono e invierno del hemisferio norte.",
     cur:"Es una constelacion rica en objetos para prismaticos."},

    {n:"Cochero",ic:"O",t:"Constelacion",ra:"06h 00m",dec:"+42",
     mag:"Varias",dist:"-",
     desc:"Contiene la estrella Capella. Tiene forma de pentagono.",
     ver:"Invierno del hemisferio norte.",
     cur:"Contiene tres cumulos abiertos brillantes: M36, M37 y M38."},

    {n:"Can Mayor",ic:"O",t:"Constelacion",ra:"06h 30m",dec:"-20",
     mag:"Varias",dist:"-",
     desc:"Contiene a Sirius, la estrella mas brillante del cielo. Tiene forma de perro.",
     ver:"Invierno del hemisferio norte, verano del sur.",
     cur:"Es una de las constelaciones mas antiguas identificadas."},

    {n:"Can Menor",ic:"O",t:"Constelacion",ra:"07h 30m",dec:"+05",
     mag:"Varias",dist:"-",
     desc:"Constelacion pequena con Procyon como estrella principal.",
     ver:"Invierno del hemisferio norte.",
     cur:"Junto a Can Mayor, representa los perros de Orion."},

    {n:"Hidra",ic:"O",t:"Constelacion",ra:"10h 00m",dec:"-20",
     mag:"Varias",dist:"-",
     desc:"La constelacion mas grande del cielo. Serpiente marina que se extiende por 100 grados.",
     ver:"Primavera del hemisferio norte.",
     cur:"Tarda mas de 6 horas en salir completamente por el horizonte."},

    {n:"Lira",ic:"O",t:"Constelacion",ra:"18h 50m",dec:"+36",
     mag:"Varias",dist:"-",
     desc:"Constelacion pequena pero con la brillante Vega. Contiene la Nebulosa del Anillo (M57).",
     ver:"Verano del hemisferio norte.",
     cur:"La Nebulosa del Anillo es una estrella moribunda que expulso sus capas exteriores."},

    {n:"Cisne",ic:"O",t:"Constelacion",ra:"20h 30m",dec:"+42",
     mag:"Varias",dist:"-",
     desc:"Tiene forma de cruz. Su estrella principal, Deneb, es una de las mas luminosas conocidas. Contiene la Nebulosa Norteamerica.",
     ver:"Verano del hemisferio norte.",
     cur:"La Via Lactea pasa por el Cisne: es una de las zonas mas ricas de la boveda celeste."},

    {n:"Aguila",ic:"O",t:"Constelacion",ra:"19h 30m",dec:"+03",
     mag:"Varias",dist:"-",
     desc:"Contiene la brillante Altair y la Nebulosa del Aguila (M16), famosa por los Pilares de la Creacion.",
     ver:"Verano del hemisferio norte.",
     cur:"Los Pilares de la Creacion son columnas de gas donde nacen estrellas."},

    {n:"Bootes",ic:"O",t:"Constelacion",ra:"14h 30m",dec:"+30",
     mag:"Varias",dist:"-",
     desc:"Contiene a Arturo, la estrella mas brillante del hemisferio norte celeste. Forma de cometa o papalote.",
     ver:"Primavera y verano del hemisferio norte.",
     cur:"Es el radiante de las Cuadrantidas, la mejor lluvia de meteoros de enero."},

    {n:"Centauro",ic:"O",t:"Constelacion",ra:"13h 00m",dec:"-50",
     mag:"Varias",dist:"-",
     desc:"Contiene Alfa Centauri, el sistema estelar mas cercano, y Omega Centauri, el cumulo globular mas grande.",
     ver:"Hemisferio sur.",
     cur:"Es una constelacion muy grande y rica en objetos interesantes."},

    {n:"Carina",ic:"O",t:"Constelacion",ra:"08h 00m",dec:"-60",
     mag:"Varias",dist:"-",
     desc:"Contiene a Canopus y la Nebulosa de Carina (NGC 3372), una de las mas grandes del cielo.",
     ver:"Hemisferio sur.",
     cur:"Antiguamente era parte de la constelacion de Argo Navis."}
  ],

  planetas: [
    {n:"Mercurio",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"-2 a +7",dist:"0.4-1.5 UA",
     desc:"El planeta mas cercano al Sol. Su superficie esta cubierta de crateres, parecida a la Luna. Tiene temperaturas extremas: de -170 a +430 grados.",
     ver:"Nunca se aleja mucho del Sol, asi que solo se ve al amanecer o al atardecer, cerca del horizonte. Requiere cielo despejado y horizonte libre.",
     cur:"Un dia en Mercurio dura 176 dias terrestres. No tiene atmosfera real, solo una exosfera muy debil."},

    {n:"Venus",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"-4.9 a -3",dist:"0.3-1.7 UA",
     desc:"El objeto mas brillante del cielo despues del Sol y la Luna. Esta cubierto por nubes de acido sulfurico que reflejan mucha luz. El efecto invernadero lo hace el planeta mas caliente.",
     ver:"Se ve al amanecer o al atardecer. Cuando esta cerca de la Tierra tiene fases como la Luna, visibles con prismaticos.",
     cur:"Gira al reves: el Sol sale por el oeste. Su dia es mas largo que su ano."},

    {n:"Marte",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"-2.9 a +1.8",dist:"0.5-2.7 UA",
     desc:"El planeta rojo. Su color rojizo viene del oxido de hierro del suelo. Tiene casquetes polares, volcanes gigantes y canyones enormes.",
     ver:"Variable: cada 26 meses esta en oposicion y brilla mucho. En telescopios pequenos se ve como un disco rojizo.",
     cur:"Monte Olimpo es el volcan mas grande del sistema solar, tres veces mas alto que el Everest."},

    {n:"Jupiter",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"-2.9 a -1.6",dist:"4-6 UA",
     desc:"El planeta mas grande del sistema solar. Sus bandas de nubes y la Gran Mancha Roja son visibles con telescopios pequenos. Tiene 95 lunas conocidas.",
     ver:"Muy brillante, se ve casi todo el ano. Con prismaticos se ven las cuatro lunas mayores (Io, Europa, Ganymede, Calisto).",
     cur:"La Gran Mancha Roja es una tormenta mas grande que la Tierra que lleva siglos girando."},

    {n:"Saturno",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"-0.5 a +1.5",dist:"8-11 UA",
     desc:"El senor de los anillos. Los anillos son visibles incluso con telescopios de juguete. Esta formado sobre todo de hidrogeno y helio.",
     ver:"Su brillo es similar a las estrellas mas brillantes. Con aumentos de 30x ya se distinguen los anillos.",
     cur:"Sus anillos estan desapareciendo lentamente: la gravedad del planeta los atrae. En 100 millones de anos no existiran."},

    {n:"Urano",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"5.7 a 6",dist:"18-21 UA",
     desc:"El septimo planeta. Tiene un color verde-azulado por el metano de su atmosfera. Gira casi acostado, con el eje inclinado 98 grados.",
     ver:"Apenas visible a simple vista desde cielos muy oscuros. Con prismaticos o telescopios se ve como un pequeno disco verdoso.",
     cur:"Fue el primer planeta descubierto con telescopio, por William Herschel en 1781."},

    {n:"Neptuno",ic:"o",t:"Planeta",ra:"Variable",dec:"Variable",
     mag:"7.8 a 8",dist:"29-31 UA",
     desc:"El octavo planeta. Es azul intenso por el metano. Tiene los vientos mas rapidos del sistema solar, hasta 2.100 km/h.",
     ver:"Requiere telescopio o prismaticos con cielo muy oscuro. Se ve como un punto azulado.",
     cur:"Fue descubierto en 1846 por calculos matematicos antes de ser observado."},

    {n:"Pluton",ic:"o",t:"Planeta enano",ra:"Variable",dec:"Variable",
     mag:"13.6 a 16",dist:"29-49 UA",
     desc:"Fue considerado el noveno planeta hasta 2006, cuando la Union Astronomica Internacional lo reclasifico como planeta enano.",
     ver:"Solo visible con telescopios medianos y cartas estelares precisas. Se ve como un punto muy debil.",
     cur:"Tiene cinco lunas conocidas, siendo Caronte la mas grande (la mitad de su tamano)."}
  ],

  luna: [
    {n:"La Luna",ic:"(",t:"Satelite natural",ra:"Variable",dec:"Variable",
     mag:"-12.7",dist:"384.400 km",
     desc:"El unico satelite natural de la Tierra. Su diametro es de 3.476 km, un cuarto del terrestre. Su gravedad causa las mareas y estabiliza el eje de la Tierra.",
     ver:"Visible desde cualquier lugar. Con prismaticos ya se distinguen crateres y mares. Con telescopios pequenos se ven detalles de la superficie.",
     cur:"Se aleja de la Tierra 3.8 cm por ano. En 50.000 anos desaparecera de nuestra vista (eones, en realidad)."},

    {n:"Fases lunares",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La Luna no emite luz propia: refleja la del Sol. Las fases son las distintas porciones iluminadas que vemos desde la Tierra. El ciclo completo dura 29.5 dias.",
     ver:"A simple vista, durante cualquier noche despejada. La Luna nueva no se ve; la llena sale al atardecer y se pone al amanecer.",
     cur:"Cuando ves la Luna de dia, tambien tiene fase. Las fases siempre van de oeste a este."},

    {n:"Cráteres lunares",ic:"(",t:"Formacion",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La Luna esta cubierta de crateres formados por impactos de meteoritos. Los mas famosos: Tycho (con rayos brillantes), Copernico, Kepler, Aristarco, Clavius, Plato.",
     ver:"Mejor durante los cuartos (no en Luna llena) porque las sombras revelan el relieve. Con telescopios pequenos ya se ven detalles.",
     cur:"El crater Tycho tiene 85 km de diametro y un sistema de rayos de 1.500 km."},

    {n:"Mares lunares",ic:"(",t:"Formacion",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Las zonas oscuras de la Luna son antiguos mares de lava basáltica. No tienen agua: son llanuras solidificadas. Los principales: Mar de la Tranquilidad, Mar de la Serenidad, Mar Imbrium, Oceanus Procellarum.",
     ver:"A simple vista, son las manchas oscuras que forman el 'conejo' o la 'cara' de la Luna.",
     cur:"El Mar de la Tranquilidad es donde aterrizo el Apollo 11 en 1969."},

    {n:"Eclipses lunares",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La Tierra se interpone entre el Sol y la Luna. La Luna toma un color rojizo (Luna de sangre) por la luz que atraviesa la atmosfera terrestre.",
     ver:"Visibles a simple vista, sin proteccion. Solo ocurren en Luna llena. Duran varias horas.",
     cur:"La Luna se ve roja porque la atmosfera terrestre dispersa la luz azul y deja pasar la roja."},

    {n:"Eclipses solares",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La Luna pasa entre el Sol y la Tierra, tapando total o parcialmente el disco solar. Solo ocurren en Luna nueva.",
     ver:"Requiere proteccion ocular especial. Nunca mires al Sol directamente sin filtro. Los totales duran pocos minutos.",
     cur:"En un eclipse total, la temperatura baja varios grados y se ven estrellas al mediodia."},

    {n:"Superluna",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Una Luna llena cerca de su punto mas cercano a la Tierra (perigeo). Se ve hasta un 14% mas grande y 30% mas brillante.",
     ver:"A simple vista. Es especialmente espectacular al salir o ponerse, cerca del horizonte.",
     cur:"Ocurren varias veces al ano. No es un evento raro, pero si muy fotogenico."},

    {n:"Luna azul",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"El nombre tiene dos significados: la segunda Luna llena en un mismo mes, o la tercera Luna llena en una estacion con cuatro.",
     ver:"A simple vista. El color no cambia: sigue siendo blanca o amarillenta.",
     cur:"Ocurre aproximadamente cada 2.7 anos."},

    {n:"Libración lunar",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La Luna oscila ligeramente respecto a la Tierra, permitiendonos ver hasta el 59% de su superficie a lo largo del tiempo.",
     ver:"Observando durante varias semanas con telescopio, notas que aparecen detalles en los bordes que antes no se veian.",
     cur:"Se debe a la excentricidad de su orbita y a su inclinacion respecto a la Tierra."},

    {n:"Mareas",ic:"(",t:"Fenomeno",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"La gravedad de la Luna (y en menor medida del Sol) atrae el agua de los oceanos, creando dos mareas altas y dos bajas por dia.",
     ver:"En la costa, observando el nivel del mar a lo largo del dia.",
     cur:"Las mareas vivas ocurren en Luna nueva y llena; las muertas en cuartos."}
  ],

  sol: [
    {n:"El Sol",ic:"@",t:"Estrella",ra:"-",dec:"-",
     mag:"-26.7",dist:"1 UA",
     desc:"La estrella del centro del sistema solar. Es una esfera de plasma que fusiona hidrogeno en helio en su nucleo. Contiene el 99.86% de la masa del sistema solar.",
     ver:"Nunca mires al Sol directamente sin filtro. Con filtro solar especial se pueden ver manchas solares.",
     cur:"La luz del Sol tarda 8 minutos 20 segundos en llegar a la Tierra. En su nucleo, la energia tarda 100.000 anos en salir a la superficie."},

    {n:"Manchas solares",ic:"@",t:"Fenomeno solar",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Zonas mas frias de la superficie solar (unos 4.000 grados, frente a los 5.500 del resto). Aparecen y desaparecen siguiendo un ciclo de 11 anos.",
     ver:"Solo con filtro solar especial o proyectando la imagen con un telescopio sobre papel. Nunca sin proteccion.",
     cur:"Galileo las observo en 1610 y demostro que el Sol rota."},

    {n:"Ciclo solar",ic:"@",t:"Fenomeno solar",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"La actividad del Sol varia en un ciclo de aproximadamente 11 anos. Durante el maximo hay mas manchas y llamaradas; en el minimo casi desaparecen.",
     ver:"Con filtro solar, contando manchas a lo largo de los anos.",
     cur:"El proximo maximo solar sera alrededor de 2025-2026."},

    {n:"Aurora boreal y austral",ic:"@",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Luces de colores en el cielo polar, causadas por particulas solares que chocan con la atmosfera. Verdes, rojas, rosadas y violetas.",
     ver:"En zonas polares (aurora boreal al norte, austral al sur). Durante maximos solares pueden verse en latitudes medias.",
     cur:"Su nombre viene de Aurora, la diosa romana del amanecer."}
  ],

  messier: [
    {n:"M42 Orion",ic:"*",t:"Nebulosa",ra:"05h 35m",dec:"-05 23",
     mag:"4.0",dist:"1.344 al",
     desc:"La nebulosa mas brillante del cielo. Es una region de formacion estelar donde nacen estrellas. Visible a simple vista como una manchita difusa debajo del cinturon de Orion.",
     ver:"Con prismaticos se ve su forma de nube. Con telescopios se distinguen detalles y el Trapecio, cuatro estrellas jovenes en el centro.",
     cur:"Tiene unas 30 anos luz de diametro. Esta iluminada por estrellas recien formadas."},

    {n:"M31 Andromeda",ic:"*",t:"Galaxia",ra:"00h 42m",dec:"+41 16",
     mag:"3.4",dist:"2.500.000 al",
     desc:"La galaxia grande mas cercana a la Via Lactea. Visible a simple vista como una mancha alargada. Contiene un billon de estrellas.",
     ver:"Otono del hemisferio norte. Con prismaticos se ve su nucleo y sus dos galaxias satelite (M32 y M110).",
     cur:"Se esta acercando a la Via Lactea y en 4.500 millones de anos colisionaran."},

    {n:"M45 Pleiades",ic:"*",t:"Cumulo abierto",ra:"03h 47m",dec:"+24 07",
     mag:"1.6",dist:"444 al",
     desc:"El cumulo abierto mas famoso. Conocido como las Siete Hermanas. A simple vista se ven 6 o 7 estrellas, con prismaticos mas de 50.",
     ver:"Invierno del hemisferio norte. En el hemisferio sur se ve en verano en latitudes bajas.",
     cur:"Es uno de los objetos mas jovenes del catalogo: solo 100 millones de anos."},

    {n:"M104 Sombrero",ic:"*",t:"Galaxia",ra:"12h 40m",dec:"-11 37",
     mag:"8.0",dist:"29 millones al",
     desc:"Galaxia con forma de sombrero: un disco con banda de polvo y un halo esferico. Muy fotografiada.",
     ver:"Requiere telescopio mediano. En el hemisferio sur se ve en otono.",
     cur:"Tiene un agujero negro central de 1.000 millones de masas solares."},

    {n:"M8 Laguna",ic:"*",t:"Nebulosa",ra:"18h 04m",dec:"-24 23",
     mag:"6.0",dist:"5.200 al",
     desc:"Nebulosa de emision grande y brillante en Sagitario. Visible a simple vista desde cielos oscuros. Tiene una laguna oscura en su interior.",
     ver:"Verano del hemisferio sur. Con prismaticos se ve su forma y color.",
     cur:"Es una region de formacion estelar muy activa. Al lado esta la Nebulosa Trifida (M20)."},

    {n:"M16 Aguila",ic:"*",t:"Nebulosa",ra:"18h 19m",dec:"-13 47",
     mag:"6.0",dist:"7.000 al",
     desc:"Contiene los famosos Pilares de la Creacion, columnas de gas donde nacen estrellas, inmortalizadas por el Hubble.",
     ver:"Con telescopios y cielos oscuros. Requiere filtros para ver bien la nebulosidad.",
     cur:"Los pilares miden anos luz de largo. La luz del Hubble los hizo famosos en 1995."},

    {n:"M20 Trifida",ic:"*",t:"Nebulosa",ra:"18h 02m",dec:"-22 58",
     mag:"6.3",dist:"5.200 al",
     desc:"Nebulosa dividida en tres partes por bandas de polvo. Combina emision, reflexion y absorcion en un solo objeto.",
     ver:"Verano del hemisferio sur. Con prismaticos se ve como una manchita; con telescopios se aprecian las divisiones.",
     cur:"Es una de las pocas nebulosas con las tres clases juntas: emision (roja), reflexion (azul) y oscura."},

    {n:"M87 Virgo",ic:"*",t:"Galaxia",ra:"12h 30m",dec:"+12 24",
     mag:"8.6",dist:"53 millones al",
     desc:"Galaxia eliptica gigante en el centro del Cumulo de Virgo. Famosa por la primera imagen de un agujero negro en 2019.",
     ver:"Requiere telescopio mediano y cielo oscuro.",
     cur:"Su agujero negro central pesa 6.500 millones de soles."},

    {n:"M4 Escorpio",ic:"*",t:"Cumulo globular",ra:"16h 23m",dec:"-26 31",
     mag:"5.6",dist:"7.200 al",
     desc:"Cumulo globular brillante cerca de Antares. Facil de encontrar y muy bonito con telescopios pequenos.",
     ver:"Verano del hemisferio sur. Con prismaticos se ve como una bolita difusa.",
     cur:"Es uno de los cumulos globulares mas cercanos. Contiene decenas de miles de estrellas."},

    {n:"M1 Cangrejo",ic:"*",t:"Resto de supernova",ra:"05h 34m",dec:"+22 01",
     mag:"8.4",dist:"6.500 al",
     desc:"Los restos de una supernova observada por astronomos chinos en 1054. En su centro hay una estrella de neutrones que gira 30 veces por segundo.",
     ver:"Requiere telescopio. Esta en Tauro, cerca de Zeta Tauri.",
     cur:"En 1054 fue tan brillante que se vio de dia durante semanas."},

    {n:"M13 Hercules",ic:"*",t:"Cumulo globular",ra:"16h 41m",dec:"+36 28",
     mag:"5.8",dist:"25.000 al",
     desc:"El cumulo globular mas famoso del hemisferio norte. Contiene unos 300.000 soles en un espacio de 145 anos luz.",
     ver:"Primavera y verano del hemisferio norte. Con prismaticos se ve como una estrella borrosa; con telescopios se resuelven sus estrellas.",
     cur:"En 1974 se envio un mensaje de radio hacia M13 con informacion sobre la humanidad."},

    {n:"M57 Anillo",ic:"*",t:"Nebulosa planetaria",ra:"18h 53m",dec:"+33 01",
     mag:"8.8",dist:"2.300 al",
     desc:"Una estrella moribunda que expulso sus capas. Se ve como un anillo o donut. Muy fotografiada.",
     ver:"Verano del hemisferio norte. Con telescopios de 100mm ya se ve el anillo.",
     cur:"No tiene nada que ver con planetas: el nombre viene de que los primeros astronomos las confundieron con planetas."},

    {n:"M27 Dumbbell",ic:"*",t:"Nebulosa planetaria",ra:"19h 59m",dec:"+22 43",
     mag:"7.4",dist:"1.360 al",
     desc:"Otra nebulosa planetaria, mas grande que M57. Forma de mancuerna o reloj de arena.",
     ver:"Verano del hemisferio norte. Facil con prismaticos desde cielos oscuros.",
     cur:"Es una de las nebulosas planetarias mas brillantes."},

    {n:"M33 Triangulo",ic:"*",t:"Galaxia",ra:"01h 33m",dec:"+30 39",
     mag:"5.7",dist:"3 millones al",
     desc:"La tercera galaxia mas grande del Grupo Local. Visible a simple vista solo desde cielos muy oscuros.",
     ver:"Otono e invierno del hemisferio norte. Necesita cielos oscuros para ver su estructura.",
     cur:"Es mas dificil de ver que M31 pese a tener magnitud similar, porque su brillo esta repartido en una superficie grande."},

    {n:"M51 Remolino",ic:"*",t:"Galaxia espiral",ra:"13h 30m",dec:"+47 12",
     mag:"8.4",dist:"23 millones al",
     desc:"Galaxia espiral clasica, con una companera con la que interactua. Muy fotografiada.",
     ver:"Primavera del hemisferio norte. Con telescopios medianos se ven sus brazos.",
     cur:"Fue la primera galaxia en la que se observo estructura espiral, en 1845."},

    {n:"M6 Mariposa",ic:"*",t:"Cumulo abierto",ra:"17h 40m",dec:"-32 13",
     mag:"4.2",dist:"1.600 al",
     desc:"Cumulo abierto con forma de mariposa, en Escorpio. Visible a simple vista desde cielos oscuros.",
     ver:"Verano del hemisferio sur. Ideal con prismaticos.",
     cur:"Su estrella mas brillante es una supergigante naranja."},

    {n:"M7 Tolomeo",ic:"*",t:"Cumulo abierto",ra:"17h 54m",dec:"-34 49",
     mag:"3.3",dist:"980 al",
     desc:"Uno de los cumulos mas brillantes del cielo, conocido desde la antiguedad. Ptolomeo lo catalogo en el siglo II.",
     ver:"Verano del hemisferio sur. A simple vista como una mancha difusa.",
     cur:"Ocupa una superficie mayor que la Luna llena."},

    {n:"M11 Patos",ic:"*",t:"Cumulo abierto",ra:"18h 51m",dec:"-06 16",
     mag:"6.3",dist:"6.200 al",
     desc:"Cumulo abierto muy denso, con cientos de estrellas. Llamado 'el cumulo de los patos salvajes'.",
     ver:"Verano del hemisferio norte. Con prismaticos se ve como una nube alargada.",
     cur:"Es uno de los cumulos abiertos mas ricos y densos conocidos."},

    {n:"M15",ic:"*",t:"Cumulo globular",ra:"21h 30m",dec:"+12 10",
     mag:"6.2",dist:"33.600 al",
     desc:"Cumulo globular compacto y brillante, en Pegaso. Muy denso hacia el centro.",
     ver:"Otono del hemisferio norte. Con telescopios medianos ya se ve granulado.",
     cur:"Es uno de los cumulos globulares mas antiguos: 12.000 millones de anos."},

    {n:"M22",ic:"*",t:"Cumulo globular",ra:"18h 36m",dec:"-23 54",
     mag:"5.1",dist:"10.400 al",
     desc:"Uno de los cumulos globulares mas brillantes del cielo. Cerca de la Nebulosa de la Laguna.",
     ver:"Verano del hemisferio sur. Visible a simple vista desde cielos oscuros.",
     cur:"Fue el primer cumulo globular descubierto, en 1665."},

    {n:"M44 Pesebre",ic:"*",t:"Cumulo abierto",ra:"08h 40m",dec:"+19 59",
     mag:"3.7",dist:"577 al",
     desc:"Cumulo abierto en Cancer, visible a simple vista. Los antiguos lo usaban como indicador del tiempo atmosferico.",
     ver:"Primavera del hemisferio norte. Con prismaticos se ve todo su esplendor.",
     cur:"Tambien se llama el Pesebre o Nido de Abejas."},

    {n:"M81 Bode",ic:"*",t:"Galaxia",ra:"09h 55m",dec:"+69 04",
     mag:"6.9",dist:"12 millones al",
     desc:"Galaxia espiral brillante en la Osa Mayor. Forma pareja con M82, con la que interactua.",
     ver:"Primavera del hemisferio norte. Con prismaticos se ve como una mancha ovalada.",
     cur:"Es una de las galaxias mas brillantes que se pueden ver con prismaticos."},

    {n:"M82 Cigarro",ic:"*",t:"Galaxia irregular",ra:"09h 56m",dec:"+69 41",
     mag:"8.4",dist:"12 millones al",
     desc:"Galaxia con forma de cigarro, deformada por la interaccion con M81. Tiene gran actividad de formacion estelar.",
     ver:"Primavera del hemisferio norte. Cerca de M81.",
     cur:"En su centro hay una galaxia enana devorada por M82."},

    {n:"M101 Pinwheel",ic:"*",t:"Galaxia espiral",ra:"14h 03m",dec:"+54 21",
     mag:"7.9",dist:"23 millones al",
     desc:"Galaxia espiral vista de frente, en la Osa Mayor. Grande pero de bajo brillo superficial.",
     ver:"Primavera del hemisferio norte. Requiere cielos oscuros.",
     cur:"Es una de las galaxias espirales mas grandes conocidas."},

    {n:"M64 Ojo Negro",ic:"*",t:"Galaxia",ra:"12h 56m",dec:"+21 41",
     mag:"8.5",dist:"17 millones al",
     desc:"Galaxia con una banda oscura de polvo frente a su nucleo, dandole aspecto de ojo.",
     ver:"Primavera del hemisferio norte. Con telescopios medianos se ve la banda.",
     cur:"El polvo gira en direccion contraria al resto de la galaxia, probablemente por una fusion."},

    {n:"M97 Buho",ic:"*",t:"Nebulosa planetaria",ra:"11h 14m",dec:"+55 01",
     mag:"9.9",dist:"2.030 al",
     desc:"Nebulosa planetaria en la Osa Mayor. Su forma recuerda a la cara de un buho.",
     ver:"Primavera del hemisferio norte. Requiere telescopios medianos.",
     cur:"Es una de las nebulosas planetarias mas grandes conocidas."}
  ],

  ngc: [
    {n:"NGC 7000 Norteamerica",ic:"*",t:"Nebulosa",ra:"20h 59m",dec:"+44 31",
     mag:"4.0",dist:"2.590 al",
     desc:"Nebulosa de emision con la forma del continente norteamericano. Visible a simple vista con filtro desde cielos oscuros.",
     ver:"Verano del hemisferio norte. Requiere cielo muy oscuro o filtro H-beta.",
     cur:"Esta cerca de Deneb, en el Cisne."},

    {n:"IC 1396 Cabeza de Elefante",ic:"*",t:"Nebulosa",ra:"21h 39m",dec:"+57 30",
     mag:"3.5",dist:"2.400 al",
     desc:"Nebulosa de emision con una trompa oscura con forma de cabeza de elefante. En Cefeo.",
     ver:"Verano y otono del hemisferio norte. Requiere filtros y cielos oscuros.",
     cur:"Es un objeto muy popular en astrofotografia."},

    {n:"Barnard 33 Cabeza de Caballo",ic:"*",t:"Nebulosa oscura",ra:"05h 40m",dec:"-02 27",
     mag:"-",dist:"1.500 al",
     desc:"Una nube oscura de polvo recortada contra la nebulosa de emision IC 434. Tiene forma de cabeza de caballo.",
     ver:"Requiere telescopios medianos y filtros. Debajo de Alnitak, en Orion.",
     cur:"Es una de las nebulosas oscuras mas famosas."},

    {n:"NGC 2237 Roseta",ic:"*",t:"Nebulosa",ra:"06h 33m",dec:"+05 00",
     mag:"9.0",dist:"5.200 al",
     desc:"Enorme nebulosa de emision en Unicornio. Rodea al cumulo NGC 2244.",
     ver:"Invierno del hemisferio norte. Con filtros o cielos oscuros.",
     cur:"Es una de las regiones de formacion estelar mas grandes visibles."},

    {n:"IC 1805 Corazon",ic:"*",t:"Nebulosa",ra:"02h 32m",dec:"+61 27",
     mag:"6.5",dist:"7.500 al",
     desc:"Nebulosa de emision en Casiopea. Forma de corazon. Contiene el cumulo Melotte 15 en su centro.",
     ver:"Otono e invierno del hemisferio norte. Con filtros.",
     cur:"Es muy fotografiada junto a la Nebulosa del Alma."},

    {n:"IC 1848 Alma",ic:"*",t:"Nebulosa",ra:"02h 51m",dec:"+60 26",
     mag:"6.5",dist:"7.500 al",
     desc:"Nebulosa de emision en Casiopea, vecina de la del Corazon. Enorme region de formacion estelar.",
     ver:"Otono e invierno del hemisferio norte. Con filtros.",
     cur:"Su forma recuerda a un feto o a un alma, de ahi su nombre."},

    {n:"NGC 6960 Velos",ic:"*",t:"Resto de supernova",ra:"20h 45m",dec:"+30 43",
     mag:"7.0",dist:"2.400 al",
     desc:"Restos de una supernova que exploto hace unos 10.000 anos. Tiene forma de cirrus o encaje. Es enorme, abarca varias lunas llenas.",
     ver:"Verano y otono del hemisferio norte. Requiere filtro O-III y cielos oscuros.",
     cur:"La supernova original era visible a simple vista durante semanas."},

    {n:"NGC 869 y 884 Doble Perseo",ic:"*",t:"Cumulo doble",ra:"02h 20m",dec:"+57 08",
     mag:"4.3",dist:"7.500 al",
     desc:"Dos cumulos abiertos brillantes muy cercanos entre si. Forman uno de los objetos mas bonitos del cielo.",
     ver:"Otono e invierno del hemisferio norte. Impresionante con prismaticos o telescopios de baja potencia.",
     cur:"Cada cumulo tiene cientos de estrellas jovenes."},

    {n:"NGC 3372 Carina",ic:"*",t:"Nebulosa",ra:"10h 45m",dec:"-59 52",
     mag:"1.0",dist:"7.500 al",
     desc:"Una de las nebulosas mas grandes y brillantes del cielo. Mas grande que la de Orion pero menos conocida por estar en el hemisferio sur.",
     ver:"Verano del hemisferio sur. Visible a simple vista desde cielos oscuros.",
     cur:"Contiene a Eta Carinae, una estrella variable inestable que podria explotar como supernova en cualquier momento."},

    {n:"NGC 5128 Centaurus A",ic:"*",t:"Galaxia",ra:"13h 25m",dec:"-43 01",
     mag:"6.8",dist:"13 millones al",
     desc:"Galaxia eliptica con una banda oscura de polvo que la atraviesa. Una de las radiogalaxias mas cercanas.",
     ver:"Otono del hemisferio sur. Con prismaticos o telescopios pequenos.",
     cur:"En su centro hay un agujero negro supermasivo muy activo."},

    {n:"Cumulo de las Hyades",ic:"*",t:"Cumulo abierto",ra:"04h 27m",dec:"+15 52",
     mag:"0.5",dist:"153 al",
     desc:"El cumulo abierto mas cercano a la Tierra. Forma la cara del Toro, con Aldebaran al frente (aunque Aldebaran no pertenece al cumulo).",
     ver:"Invierno del hemisferio norte. A simple vista, forma una V.",
     cur:"Sus estrellas tienen unos 625 millones de anos."},

    {n:"Galaxias de Magallanes",ic:"*",t:"Galaxia satelite",ra:"Variable",dec:"Variable",
     mag:"0.9 y 2.7",dist:"160.000 al",
     desc:"Dos galaxias satelites de la Via Lactea, visibles a simple vista desde el hemisferio sur: la Gran Nube y la Pequena Nube de Magallanes.",
     ver:"Hemisferio sur, todo el ano. Son manchas lechosas grandes.",
     cur:"Fueron clave para medir distancias cosmicas en el siglo XX."}
  ],

  sistema: [
    {n:"Ceres",ic:".",t:"Planeta enano",ra:"Variable",dec:"Variable",
     mag:"6.7 a 9.3",dist:"2.77 UA",
     desc:"El objeto mas grande del cinturon de asteroides. Fue considerado planeta durante 50 anos tras su descubrimiento en 1801. Tiene agua bajo la superficie.",
     ver:"Con prismaticos o telescopios pequenos, en cielos oscuros.",
     cur:"Contiene un tercio de la masa total del cinturon de asteroides."},

    {n:"Vesta",ic:".",t:"Asteroide",ra:"Variable",dec:"Variable",
     mag:"5.2 a 8.5",dist:"2.36 UA",
     desc:"El segundo asteroide mas grande. En sus oposiciones puede verse a simple vista.",
     ver:"Con prismaticos en sus oposiciones. Requiere carta estelar.",
     cur:"Su superficie tiene crateres de impacto gigantes, uno de ellos cubre casi todo un hemisferio."},

    {n:"Cinturon de asteroides",ic:".",t:"Region",ra:"-",dec:"-",
     mag:"-",dist:"2.2-3.2 UA",
     desc:"Region entre Marte y Jupiter con millones de asteroides. Es un resto de la formacion del sistema solar que no se unio en un planeta.",
     ver:"Los asteroides mas brillantes (Ceres, Vesta, Pallas, Juno) son visibles con prismaticos.",
     cur:"La masa total del cinturon es solo el 4% de la Luna."},

    {n:"Cinturon de Kuiper",ic:".",t:"Region",ra:"-",dec:"-",
     mag:"-",dist:"30-50 UA",
     desc:"Region de cuerpos helados mas alla de Neptuno. Pluton, Haumea, Makemake y Eris son algunos de sus miembros.",
     ver:"Invisible desde la Tierra a simple vista. Solo algunos objetos con telescopios grandes.",
     cur:"Es la fuente de muchos cometas de corto periodo."},

    {n:"Nube de Oort",ic:".",t:"Region",ra:"-",dec:"-",
     mag:"-",dist:"2.000-100.000 UA",
     desc:"Enorme nube esferica de cometas en el limite del sistema solar. Es la fuente de los cometas de largo periodo.",
     ver:"Invisible. Solo se infiere por los cometas que llegan.",
     cur:"Es hasta 1.000 veces mas lejana que el cinturon de Kuiper."},

    {n:"Io",ic:".",t:"Luna de Jupiter",ra:"-",dec:"-",
     mag:"5.0",dist:"628 millones km",
     desc:"La luna mas cercana a Jupiter. Tiene la mayor actividad volcanica del sistema solar, con mas de 400 volcanes activos.",
     ver:"Con telescopios medianos se ve como un punto. Con grandes se distinguen manchas.",
     cur:"Sus volcanes lanzan azufre a 500 km de altura."},

    {n:"Europa",ic:".",t:"Luna de Jupiter",ra:"-",dec:"-",
     mag:"5.3",dist:"671 millones km",
     desc:"La luna mas lisa del sistema solar. Bajo su corteza de hielo hay un oceano de agua liquida que podria contener vida.",
     ver:"Con telescopios medianos.",
     cur:"Es uno de los objetivos principales de la busqueda de vida extraterrestre."},

    {n:"Ganimedes",ic:".",t:"Luna de Jupiter",ra:"-",dec:"-",
     mag:"4.6",dist:"1.070 millones km",
     desc:"La luna mas grande del sistema solar, mas grande que Mercurio. Es el unico satelite con campo magnetico propio.",
     ver:"Con prismaticos ya es visible como punto junto a Jupiter.",
     cur:"Tiene un oceano subterraneo de agua salada."},

    {n:"Calisto",ic:".",t:"Luna de Jupiter",ra:"-",dec:"-",
     mag:"5.6",dist:"1.880 millones km",
     desc:"La cuarta luna de Jupiter. Es un mundo helado cubierto de crateres, el mas craterizado del sistema solar.",
     ver:"Con prismaticos, la mas externa de las cuatro galileanas.",
     cur:"Podria tener un oceano profundo bajo su superficie."},

    {n:"Titan",ic:".",t:"Luna de Saturno",ra:"-",dec:"-",
     mag:"8.4",dist:"1.220 millones km",
     desc:"La segunda luna mas grande del sistema solar. Es el unico satelite con atmosfera densa, rica en nitrogeno y metano.",
     ver:"Con telescopios medianos. Aparece como un punto naranja.",
     cur:"Tiene lagos y rios de metano liquido en su superficie."},

    {n:"Encelado",ic:".",t:"Luna de Saturno",ra:"-",dec:"-",
     mag:"11.7",dist:"1.270 millones km",
     desc:"Luna helada de Saturno con geiseres de agua en su polo sur. Bajo el hielo hay un oceano global.",
     ver:"Con telescopios medianos, muy cerca de los anillos.",
     cur:"Los geiseres expulsan particulas que forman el anillo E de Saturno."},

    {n:"Cometa Halley",ic:".",t:"Cometa periodico",ra:"Variable",dec:"Variable",
     mag:"-1 a +30",dist:"0.59-35 UA",
     desc:"El cometa mas famoso. Orbita el Sol cada 76 anos. Su ultima visita fue en 1986 y la proxima sera en 2061.",
     ver:"Solo visible en sus pasos cercanos al Sol. Las lluvias de meteoros Eta Acuaridas y Orionidas son sus restos.",
     cur:"Edmond Halley predijo su regreso en 1758 usando la ley de Newton."},

    {n:"Cometa NEOWISE",ic:".",t:"Cometa",ra:"Variable",dec:"Variable",
     mag:"1.0",dist:"0.3-500 UA",
     desc:"El cometa brillante de 2020. Visible a simple vista desde cielos oscuros. Tiene un periodo orbital de unos 6.800 anos.",
     ver:"Ya no es visible. Se recuerda por su gran cola en 2020.",
     cur:"Fue descubierto por el telescopio espacial NEOWISE en marzo de 2020."},

    {n:"Cometa Hale-Bopp",ic:".",t:"Cometa",ra:"Variable",dec:"Variable",
     mag:"-1.8",dist:"0.9-370 UA",
     desc:"El cometa mas brillante de las ultimas decadas. Visible a simple vista durante 18 meses en 1996-1997.",
     ver:"Ya no es visible. Volvera en unos 2.500 anos.",
     cur:"Su brillo inusual fue porque su nucleo era muy grande (60 km)."}
  ],

  eventos: [
    {n:"Lluvias de meteoros",ic:"*",t:"Evento anual",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Restos de cometas que la Tierra cruza cada ano. Los meteoros parecen salir de un punto llamado radiante.",
     ver:"Mejor despues de medianoche, sin Luna y lejos de ciudades. No necesitas telescopio.",
     cur:"Las principales: Cuadrantidas (enero), Perseidas (agosto), Leonidas (noviembre) y Geminidas (diciembre)."},

    {n:"Conjunciones",ic:"*",t:"Evento regular",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Dos o mas astros parecen estar muy cerca en el cielo. Pueden ser entre planetas, planetas y la Luna, o planetas y estrellas.",
     ver:"A simple vista. Se ven como dos o tres puntos brillantes muy cerca. Ocurren varias veces al ano.",
     cur:"La Gran Conjuncion de Jupiter y Saturno en 2020 fue la mas cercana en 400 anos."},

    {n:"Oposiciones",ic:"*",t:"Evento regular",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Un planeta exterior (Marte, Jupiter, Saturno) esta en el lado opuesto al Sol visto desde la Tierra. Es el mejor momento para observarlo.",
     ver:"A simple vista o con telescopios. Los planetas brillan mas y estan visibles toda la noche.",
     cur:"Las oposiciones de Marte ocurren cada 26 meses. Las de Jupiter cada 13 meses."},

    {n:"Transitos planetarios",ic:"*",t:"Evento raro",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Mercurio o Venus pasan por delante del disco solar. Solo Mercurio (cada 13-14 anos) y Venus (cada 105-122 anos).",
     ver:"Requiere telescopio con filtro solar especial. Nunca mires al Sol directamente.",
     cur:"El ultimo transito de Venus fue en 2012. El proximo sera en 2117."},

    {n:"Solsticios y equinoccios",ic:"*",t:"Evento anual",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Los solsticios marcan el dia mas largo y el mas corto del ano. Los equinoccios, cuando dia y noche duran igual. Marcan el inicio de las estaciones.",
     ver:"No se observan directamente, pero afectan la posicion del Sol y las horas de luz.",
     cur:"En el solsticio de junio el Sol esta sobre el tropico de Cancer; en diciembre sobre el de Capricornio."},

    {n:"Alineaciones planetarias",ic:"*",t:"Evento ocasional",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Varios planetas se alinean en el cielo y son visibles simultaneamente. Pueden ser 3, 4, 5 o mas planetas.",
     ver:"A simple vista, en una misma noche. Los mas brillantes (Venus, Jupiter, Marte, Saturno) destacan facil.",
     cur:"En 2022 se alinearon los 5 planetas visibles a simple vista, un evento que ocurre cada 18 anos aproximadamente."},

    {n:"Cometas",ic:"*",t:"Evento ocasional",ra:"Variable",dec:"Variable",
     mag:"-",dist:"-",
     desc:"Cuerpos helados que desarrollan una coma y una cola al acercarse al Sol. Pueden ser visibles a simple vista cuando son grandes.",
     ver:"Con prismaticos desde cielos oscuros. Su brillo es impredecible.",
     cur:"El cometa Halley nos visita cada 76 anos. El proximo paso sera en 2061."}
  ],

  fenomenos: [
    {n:"Aurora boreal",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Luces verdes, rojas y violetas en el cielo polar norte. Causadas por particulas solares que chocan con la atmosfera.",
     ver:"En zonas del norte (Escandinavia, Canada, Alaska, Islandia). Durante maximos solares puede verse en latitudes medias.",
     cur:"El oxigeno emite luz verde y roja; el nitrogeno, azul y violeta."},

    {n:"Aurora austral",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Equivalente a la boreal pero en el hemisferio sur. Se ve desde la Antartida, sur de Argentina, Chile, Australia y Nueva Zelanda.",
     ver:"En latitudes australes, preferentemente en invierno.",
     cur:"En Tierra del Fuego, Ushuaia y El Calafate se ve durante maximos solares."},

    {n:"Luz zodiacal",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Una luz debil triangular visible al este antes del amanecer o al oeste tras el atardecer. Es polvo en el plano del sistema solar iluminado por el Sol.",
     ver:"Requiere cielos muy oscuros, sin Luna. Mejor en primavera por la tarde o en otono por la manana.",
     cur:"Fue descrita por el astronomo italiano Giovanni Cassini en 1683."},

    {n:"Gegenschein",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Un punto debil de luz en el cielo opuesto al Sol. Es luz solar reflejada en el polvo interplanetario.",
     ver:"Requiere cielos extremadamente oscuros. Muy dificil de ver.",
     cur:"Su nombre aleman significa 'resplandor opuesto'."},

    {n:"Halos solares",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Anillos de luz alrededor del Sol o la Luna, causados por cristales de hielo en la atmosfera. El mas comun es el halo de 22 grados.",
     ver:"En cualquier dia con nubes altas. No mires directamente al Sol.",
     cur:"Su aparicion suele anunciar cambio de tiempo atmosferico."},

    {n:"Parhelios",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Puntos brillantes a ambos lados del Sol, como soles falsos. Causados por refraccion en cristales de hielo.",
     ver:"Con el Sol bajo, en dias frios con nubes altas.",
     cur:"Tambien existen paraselenes: puntos brillantes junto a la Luna."},

    {n:"Pilares solares",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Columnas verticales de luz que parecen salir del Sol o de la Luna. Causadas por reflejo en cristales de hielo.",
     ver:"Al amanecer o atardecer, en dias frios.",
     cur:"Son frecuentes en zonas polares."},

    {n:"Rayos crepusculares",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Rayos de luz que parecen salir del Sol cuando esta bajo el horizonte. Son sombras de nubes proyectadas en el aire.",
     ver:"Al amanecer o atardecer, cuando hay nubes cerca del horizonte.",
     cur:"En ingles se llaman 'sunbeams' o 'crepuscular rays'."},

    {n:"Nubes noctilucentes",ic:"~",t:"Fenomeno atmosferico",ra:"-",dec:"-",
     mag:"-",dist:"-",
     desc:"Nubes brillantes visibles al anochecer en verano, a 80 km de altura. Estan formadas por cristales de hielo en la mesosfera.",
     ver:"En verano, en latitudes entre 50 y 70 grados. No confundir con cirros."},
 
    {n:"Estacion Espacial Internacional",ic:"~",t:"Satelite artificial",ra:"Variable",dec:"Variable",
     mag:"-4 a -1",dist:"400 km",
     desc:"La ISS orbita la Tierra cada 90 minutos. Es visible a simple vista como un punto muy brillante que cruza el cielo en pocos minutos.",
     ver:"Pasa varias veces por semana. Brilla como Venus y no parpadea. Puedes consultar los pases en webs de seguimiento.",
     cur:"Pesa 420 toneladas y lleva tripulacion humana desde el ano 2000."},

    {n:"Starlink",ic:"~",t:"Satelites artificiales",ra:"Variable",dec:"Variable",
     mag:"Variable",dist:"550 km",
     desc:"Constelacion de miles de satelites de SpaceX. Al principio de su vida se ven como un 'tren' de puntos brillantes.",
     ver:"Tras su lanzamiento, durante unos dias, al anochecer o amanecer.",
     cur:"Generan contaminacion luminica y afectan a la astrofotografia profesional."},

    {n:"Bolidos",ic:"~",t:"Fenomeno atmosferico",ra:"Variable",dec:"Variable",
     mag:"-4 a -20",dist:"-",
     desc:"Meteoros mas brillantes que Venus, a veces con estela persistente y fragmentacion. Pueden durar varios segundos.",
     ver:"Espontaneos. Pueden aparecer en cualquier noche despejada.",
     cur:"Si dejan restos que llegan al suelo, se llaman meteoritos."}
  ],

  conceptos: [
    {n:"Magnitud estelar",ic:"?",t:"Concepto",
     desc:"Es la medida del brillo de un objeto celeste. Cuanto mas bajo el numero, mas brillante. La escala es logaritmica: una diferencia de 5 magnitudes equivale a un factor de 100 en brillo.",
     ejemplos:"Sirio: -1.46. Venus: -4.9. Luna llena: -12.7. Sol: -26.7. Estrellas visibles en ciudad: hasta 3 o 4. Cielo oscuro: hasta 6.5."},

    {n:"Ascension recta y declinacion",ic:"?",t:"Concepto",
     desc:"Son las coordenadas de un objeto en el cielo. La ascension recta (AR o RA) es como la longitud, medida en horas (0 a 24). La declinacion (Dec) es como la latitud, medida en grados (-90 a +90).",
     ejemplos:"El polo norte celeste esta en Dec +90. La estrella Polaris esta en AR 02h 31m, Dec +89 15. La Cruz del Sur esta alrededor de AR 12h 30m, Dec -60."},

    {n:"Contaminacion luminica",ic:"?",t:"Concepto",
     desc:"Es la luz artificial que se dispersa en la atmosfera y borra las estrellas debiles. En una ciudad grande solo ves unas pocas decenas de estrellas. En un cielo rural ves miles.",
     ejemplos:"Escala Bortle: 1 es cielo perfecto (desierto), 9 es centro de ciudad. Un pueblo con algo de luz suele estar en 4 o 5."},

    {n:"Escala Bortle",ic:"?",t:"Concepto",
     desc:"Es una escala del 1 al 9 para medir la calidad del cielo nocturno. Fue creada por John Bortle en 2001.",
     ejemplos:"1-2: cielo excelente, Via Lactea muy marcada. 3-4: cielo rural, Via Lactea visible. 5-6: suburbano, Via Lactea debil. 7-8: ciudad. 9: centro urbano."},

    {n:"Seeing y transparencia",ic:"?",t:"Concepto",
     desc:"Son dos medidas de la calidad atmosferica. El seeing es la estabilidad de la imagen: buen seeing permite altos aumentos. La transparencia es cuanta luz pasa: buena transparencia permite ver estrellas debiles.",
     ejemplos:"Un buen seeing hace que la Luna se vea nitida en el telescopio. Una buena transparencia permite ver la Via Lactea."},

    {n:"Hora sideral",ic:"?",t:"Concepto",
     desc:"Es el sistema horario que usan los astronomos. Se basa en el movimiento de las estrellas, no del Sol. Un dia sideral dura 23h 56m 4s, casi 4 minutos menos que un dia solar.",
     ejemplos:"Cuando la hora sideral local es 0h, el meridiano superior pasa por el punto Aries. La hora sideral se usa para saber que objetos estan sobre el horizonte."},

    {n:"Ano luz",ic:"?",t:"Concepto",
     desc:"Es la distancia que recorre la luz en un ano: 9.46 billones de kilometros. Se usa para medir distancias estelares porque el kilometro es muy pequeno para el cosmos.",
     ejemplos:"La Luna esta a 1.3 segundos luz. El Sol a 8.3 minutos luz. Proxima Centauri a 4.24 anos luz. La galaxia de Andromeda a 2.5 millones de anos luz."},

    {n:"Unidad astronomica",ic:"?",t:"Concepto",
     desc:"Es la distancia media entre la Tierra y el Sol: 149.6 millones de kilometros. Se usa para medir distancias dentro del sistema solar.",
     ejemplos:"Mercurio esta a 0.39 UA del Sol. La Tierra a 1 UA. Jupiter a 5.2 UA. Pluton a 39 UA. La nube de Oort llega a 100.000 UA."},

    {n:"Paralaje",ic:"?",t:"Concepto",
     desc:"Es el cambio aparente de posicion de un objeto cercano respecto al fondo cuando se observa desde dos puntos distintos. Se usa para medir distancias estelares.",
     ejemplos:"La paralaje de Proxima Centauri es de 0.77 segundos de arco, lo que da 4.24 anos luz. La paralaje del Sol es de 8.8 segundos de arco."},

    {n:"Espectro electromagnetico",ic:"?",t:"Concepto",
     desc:"Es el conjunto de todas las longitudes de onda de la radiacion. Incluye radio, microondas, infrarrojo, visible, ultravioleta, rayos X y rayos gamma.",
     ejemplos:"Nuestros ojos solo ven el visible (400-700 nm). Los radioastronomos usan ondas de radio. Los astronomos infrarrojos estudian polvo frio."},

    {n:"Tipos de estrellas",ic:"?",t:"Concepto",
     desc:"Las estrellas se clasifican por temperatura en tipos espectrales: O, B, A, F, G, K, M (de mas calientes a mas frias). Se subdividen del 0 al 9.",
     ejemplos:"Nuestro Sol es una estrella G2 (amarilla). Sirius es A1 (blanca). Betelgeuse es M2 (roja). Vega es A0 (blanca azulada)."},

    {n:"Evolucion estelar",ic:"?",t:"Concepto",
     desc:"Las estrellas nacen, viven y mueren. Nacen de nebulosas, viven fusionando hidrogeno en helio, y mueren como enanas blancas, estrellas de neutrones o agujeros negros, segun su masa.",
     ejemplos:"El Sol morira como enana blanca tras convertirse en gigante roja. Betelgeuse terminara como supernova. Las estrellas muy masivas forman agujeros negros."},

    {n:"Agujeros negros",ic:"?",t:"Concepto",
     desc:"Son regiones del espacio donde la gravedad es tan fuerte que nada puede escapar, ni siquiera la luz. Se forman del colapso de estrellas muy masivas o por la fusion de otros agujeros negros.",
     ejemplos:"Sagitario A* esta en el centro de la Via Lactea y pesa 4 millones de soles. M87* pesa 6.500 millones de soles y fue fotografiado en 2019."},

    {n:"Materia oscura",ic:"?",t:"Concepto",
     desc:"Es materia que no emite ni refleja luz, pero se detecta por sus efectos gravitatorios. Constituye el 27% del universo. No sabemos que es.",
     ejemplos:"Explica por que las galaxias rotan mas rapido de lo esperado por su materia visible. Afecta la forma de los cumulos de galaxias."},

    {n:"Energia oscura",ic:"?",t:"Concepto",
     desc:"Es una fuerza misteriosa que acelera la expansion del universo. Constituye el 68% del universo. Fue descubierta en 1998 observando supernovas lejanas.",
     ejemplos:"Su naturaleza es uno de los mayores problemas abiertos de la fisica actual."},

    {n:"Galaxias y sus tipos",ic:"?",t:"Concepto",
     desc:"Las galaxias son conjuntos de estrellas, gas y polvo unidos por gravedad. Se clasifican en espirales, elipticas e irregulares. La Via Lactea es una espiral barrada.",
     ejemplos:"Andromeda: espiral. M87: eliptica. Nubes de Magallanes: irregulares. Se agrupan en cumulos y supercumulos."},

    {n:"Tipos de nebulosas",ic:"?",t:"Concepto",
     desc:"Las nebulosas son nubes de gas y polvo. Se clasifican en emision (brillan por estrellas cercanas), reflexion (reflejan luz), oscuras (bloquean la luz) y planetarias (restos de estrellas).",
     ejemplos:"M42: emision. M78: reflexion. Cabeza de Caballo: oscura. M57: planetaria."},

    {n:"Cumulos estelares",ic:"?",t:"Concepto",
     desc:"Son grupos de estrellas ligadas por gravedad. Los abiertos tienen decenas a miles de estrellas jovenes; los globulares tienen cientos de miles de estrellas viejas muy densas.",
     ejemplos:"Pleyades: abierto joven. M13: globular viejo. Las Hyades: abierto cercano."},

    {n:"Tipos de telescopios",ic:"?",t:"Concepto",
     desc:"Hay tres tipos principales: refractores (lentes), reflectores (espejos) y catadioptricos (combinacion). Para aficionados, los reflectores Newton ofrecen mas apertura por menos precio.",
     ejemplos:"Un reflector de 150 mm cuesta mucho menos que un refractor equivalente. Los catadioptricos son compactos y buenos para fotografia."},

    {n:"Monturas y tripodes",ic:"?",t:"Concepto",
     desc:"La montura sostiene el telescopio. Las altazimutales se mueven en altura y azimut; las ecuatoriales siguen el movimiento del cielo. Las motorizadas permiten astrofotografia.",
     ejemplos:"Una montura ecuatorial alemana es ideal para fotografia. Una altazimutal motorizada (tipo GoTo) es comoda para visual."},

    {n:"Oculares",ic:"?",t:"Concepto",
     desc:"Los oculares determinan los aumentos y el campo de vision. Se miden en milimetros: menor mm = mas aumentos. Para un telescopio de focal 900 mm, un ocular de 25 mm da 36 aumentos; uno de 10 mm da 90.",
     ejemplos:"Para ver planetas: 10-6 mm. Para cúmulos y nebulosas: 25-40 mm. Para la Luna: 25 a 6 mm segun el detalle."},

    {n:"Precesion",ic:"?",t:"Concepto",
     desc:"Es el movimiento lento del eje de la Tierra, como un trompo que se tambalea. Completa un ciclo cada 26.000 anos. Cambia cual estrella es la polar y desplaza las constelaciones.",
     ejemplos:"Hace 5.000 anos la polar era Thuban, en la constelacion del Dragon. En 13.000 anos sera Vega."},

    {n:"Estrella polar",ic:"?",t:"Concepto",
     desc:"Es la estrella que queda mas cerca del polo norte celeste. Actualmente es Polaris. Cambia con la precesion. No existe una estrella polar sur equivalente (Sigma Octantis es muy debil).",
     ejemplos:"Su altura sobre el horizonte es igual a la latitud del observador en el hemisferio norte. Es la referencia para orientarse de noche."},

    {n:"Fases lunares",ic:"?",t:"Concepto",
     desc:"La Luna no emite luz propia: refleja la del Sol. Las fases son las distintas porciones iluminadas que vemos desde la Tierra. Duran 29.5 dias en completar el ciclo.",
     ejemplos:"Luna nueva: no se ve. Cuarto creciente: mitad derecha. Luna llena: toda iluminada. Cuarto menguante: mitad izquierda."},

    {n:"Constelaciones zodiacales",ic:"?",t:"Concepto",
     desc:"Son 13 constelaciones que estan sobre el plano de la ecliptica, el camino aparente del Sol en el cielo. Los planetas y la Luna siempre se ven dentro de ellas.",
     ejemplos:"Aries, Tauro, Geminis, Cancer, Leo, Virgo, Libra, Escorpio, Ofiuco, Sagitario, Capricornio, Acuario, Piscis."},

    {n:"Estaciones del ano",ic:"?",t:"Concepto",
     desc:"Las estaciones no se deben a la distancia al Sol, sino a la inclinacion del eje terrestre (23.5 grados). Cuando un hemisferio esta inclinado hacia el Sol, es verano alli.",
     ejemplos:"En diciembre el hemisferio sur tiene verano y el norte invierno. En junio es al reves."},

    {n:"Via Lactea",ic:"?",t:"Concepto",
     desc:"Es nuestra galaxia, una espiral barrada con unos 200.000 millones de estrellas. Tiene unos 100.000 anos luz de diametro. La vemos como una banda lechosa que cruza el cielo.",
     ejemplos:"El centro galactico esta en Sagitario, a 26.000 anos luz. En cielos oscuros se ve como una nube con estructura."}
  ],

  historia: [
    {n:"Ptolomeo",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"siglo II",
     desc:"Astronomo griego de Alejandria. Escribio el Almagesto, que recopilo el conocimiento astronomico de la antiguedad y propuso el sistema geocentrico.",
     cur:"Su sistema geocentrico domino la astronomia durante 1.400 anos."},

    {n:"Copernico",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1473-1543",
     desc:"Propuso que el Sol, no la Tierra, era el centro del universo. Su obra 'De revolutionibus' cambio la astronomia para siempre.",
     cur:"Publico su obra el mismo ano de su muerte para evitar la persecucion."},

    {n:"Tycho Brahe",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1546-1601",
     desc:"Realizo las mediciones mas precisas de su epoca, sin telescopio. Sus datos permitieron a Kepler descubrir las leyes del movimiento planetario.",
     cur:"Perdio parte de la nariz en un duelo y usaba una protesis de metal."},

    {n:"Kepler",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1571-1630",
     desc:"Descubrio las tres leyes del movimiento planetario: orbitas elipticas, velocidad variable y relacion entre periodo y distancia.",
     cur:"Sus leyes fueron clave para que Newton formulara la ley de gravitacion universal."},

    {n:"Galileo Galilei",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1564-1642",
     desc:"Primero en usar el telescopio para observar el cielo. Descubrio las lunas de Jupiter, las fases de Venus, los crateres lunares y las manchas solares.",
     cur:"Fue condenado por la Inquisicion por defender el heliocentrismo."},

    {n:"Isaac Newton",ic:"H",t:"Fisico y astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1643-1727",
     desc:"Formulo la ley de gravitacion universal y las leyes del movimiento. Explico las orbitas planetarias y las mareas.",
     cur:"Su obra 'Principia' es uno de los libros mas influyentes de la historia."},

    {n:"William Herschel",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1738-1822",
     desc:"Descubrio el planeta Urano en 1781 y catalogo miles de nebulosas y cumulos. Construyo los telescopios mas grandes de su epoca.",
     cur:"Tambien descubrio la radiacion infrarroja."},

    {n:"Edwin Hubble",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1889-1953",
     desc:"Demostro que las nebulosas espirales eran galaxias fuera de la Via Lactea. Descubrio que el universo se expande.",
     cur:"El telescopio espacial Hubble lleva su nombre."},

    {n:"Carl Sagan",ic:"H",t:"Astronomo",ra:"-",dec:"-",
     mag:"-",dist:"1934-1996",
     desc:"Divulgador cientifico. Su serie 'Cosmos' inspiro a millones de personas. Trabajo en misiones espaciales y en la busqueda de vida extraterrestre.",
     cur:"Su frase 'Somos polvo de estrellas' resume la conexion entre el cosmos y la humanidad."}
  ]
};

if (typeof window !== "undefined"){
  window.WIKI = WIKI;
}