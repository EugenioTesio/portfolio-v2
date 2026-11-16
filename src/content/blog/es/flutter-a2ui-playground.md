*Cómo un agente aprende a usar tu catálogo de componentes, arma una interfaz y le pasa la descripción a Flutter para que la muestre.*

"Ayudame a elegir un plan".

Una aplicación podría responder con una comparación, varias opciones y un botón para continuar. Son elementos conocidos. Lo interesante es que un agente puede decidir cómo combinarlos según el pedido de la persona.

Si desarrollás con Flutter, surgen varias preguntas. ¿De dónde salen esos componentes? ¿Cómo sabe el modelo cuáles puede usar? ¿Quién convierte su respuesta en widgets? ¿Y qué pasa cuando alguien presiona el botón?

**A2UI conecta esas decisiones mediante una descripción compartida de la interfaz.** Tu aplicación define los componentes y su comportamiento. El agente los combina para responder al pedido. Flutter los muestra en pantalla.

Veamos cómo funciona, desde el catálogo hasta la primera interacción. Al final hay un playground para probarlo.

## Qué describe A2UI

A2UI ofrece un protocolo abierto y bibliotecas para describir interfaces interactivas mediante mensajes estructurados. El agente envía información sobre la disposición de los componentes, su contenido y sus enlaces a datos. La aplicación interpreta esa descripción usando componentes que ya implementa. [Introducción oficial a A2UI](https://a2ui.org/concepts/overview/).

- Un **catálogo** define qué tipos de componentes puede usar el agente, qué propiedades aceptan y qué funciones e instrucciones tiene a disposición.
- Una **superficie** es una interfaz con su propia estructura de componentes y su propio modelo de datos. Puede aparecer como respuesta en un chat o dentro de una pantalla existente.
- Un **mensaje** puede crear una superficie, actualizar sus componentes o sus datos, o comunicar una interacción a la aplicación o al agente.

Una superficie para elegir un plan podría incluir un título, tarjetas con los detalles de cada plan, un selector y un botón para continuar. El agente elige qué piezas usar y cómo organizarlas. Tu aplicación implementa esas piezas y decide qué pasa cuando alguien las usa.

## Cómo se reparten el trabajo las bibliotecas de Flutter

La implementación en Dart separa el protocolo, la integración con el agente y el renderizado en Flutter.

**`a2ui_core` administra la descripción de la interfaz y su estado.** Su `MessageProcessor` valida y aplica los mensajes del protocolo y mantiene las superficies, sus componentes y sus datos. La capa de resolución sigue las referencias entre componentes y resuelve los enlaces al modelo de datos. [Paquete de Dart](https://pub.dev/packages/a2ui_core).

**`a2ui_flutter` convierte esa descripción en widgets.** Incluye el widget `A2uiSurface`, constructores de componentes y un catálogo básico con implementaciones de Material. Cada superficie se integra en el árbol de widgets de tu aplicación. [Paquete de Flutter](https://pub.dev/packages/a2ui_flutter).

**`a2ui_agent` prepara al modelo para generar A2UI.** Identifica qué catálogos configurados admite el cliente, genera las instrucciones para el modelo y analiza la respuesta para convertirla en mensajes del protocolo. Tu agente hace la llamada al modelo mediante la biblioteca del proveedor que uses. [Paquete del agente](https://pub.dev/packages/a2ui_agent).

El ejemplo que acompaña el artículo usa `dartantic_ai` para conectarse a Gemini. Los paquetes de A2UI se encargan del contrato que permite interpretar la interfaz descrita en la respuesta.

Los ejemplos usan el protocolo **1.0** con `a2ui_core` **0.7.0**, `a2ui_flutter` **0.3.0** y `a2ui_agent` **0.3.0**. El formato de los mensajes y la sintaxis de los enlaces a datos cambian según la versión del protocolo.

## De dónde salen los componentes

Podés usar el catálogo básico de Flutter, registrar componentes propios o combinar ambos.

### Empezá con el catálogo básico

La función `basicCatalog()` trae componentes listos para usar. Incluye `Column`, `Row`, `Text`, `Card` y `Button`, además de campos y otros controles.

Podés derivar un catálogo centrado en una tarea. En este ejemplo, alcanza con los componentes necesarios para armar comparaciones y formularios.

```dart
const catalogId = 'https://example.com/catalogs/onboarding-v1.json';

final catalog = basicCatalog().derive(
  catalogId: catalogId,
  components: const {
    'Column', 'Row', 'Text', 'Card', 'Button',
    'TextField', 'ChoicePicker', 'Divider',
  },
  functions: const [],
  instructions:
      'Use ChoicePicker for plan selection. '
      'Bind input values with @path. '
      'Use event actions for buttons.',
);
```

El parámetro `components` determina qué implementaciones se conservan. Con `functions: const []`, el catálogo queda sin funciones. Las instrucciones indican cómo usar los componentes y el nuevo `catalogId` identifica el contrato que comparten el agente y el cliente.

El catálogo se registra en el código de la aplicación. Cuando un mensaje incluye su identificador, el renderizador busca el catálogo registrado con ese ID. Aunque tenga forma de URL, en este flujo el ID funciona como referencia local.

### Integrá tu propio sistema de diseño

Supongamos que tu app ya tiene una tarjeta para mostrar un plan. Podés exponerla como `PlanCard`, con propiedades para el nombre, el precio y los beneficios.

1. **Describí su interfaz pública.** Definí un esquema con el nombre del componente, las propiedades que acepta, los valores obligatorios y una descripción de cada uno.
2. **Registrá su implementación en Flutter.** Proporcioná un constructor que reciba esas propiedades y devuelva el widget de tu aplicación.

En el SDK de Flutter, `ComponentImplementation` reúne el esquema y el constructor. Podés incorporar esa implementación a un catálogo derivado con `addComponents`. [Guía de catálogos](https://a2ui.org/concepts/catalogs/).

El registro te permite elegir qué widgets querés exponer y qué puede configurar el modelo. Por ejemplo, tu `PlanCard` puede conservar la tipografía, los espaciados y el comportamiento de accesibilidad de tu sistema de diseño. El agente decide dónde ubicarla dentro de su respuesta.

## Cómo sabe el agente qué componentes puede usar

El renderizador registra las implementaciones. El agente recibe las descripciones públicas de esos componentes y las instrucciones para combinarlos.

Así se configura el SDK del agente en Dart con el catálogo del ejemplo anterior.

```dart
final generator = A2uiGenerator(
  catalogs: [CatalogConfig(catalog)],
  inferenceFormatFactory: const DirectJsonFormatFactory(),
);

final agentProcessor = generator.createProcessor(
  A2uiRendererCapabilities.forCatalogIds(
    [catalogId],
    version: A2uiProtocolVersion.v1_0,
  ),
);

final catalogInstructions = agentProcessor.promptSnippet;
```

Las capacidades del renderizador indican qué catálogos y qué versión del protocolo admite el cliente. El generador selecciona los catálogos compatibles entre los que tiene configurados. `promptSnippet` describe los componentes y las funciones disponibles e incluye las instrucciones y el formato de salida. Tu aplicación incorpora ese fragmento al prompt del modelo junto con el pedido del usuario y los datos pertinentes.

Ante "ayudame a elegir un plan", el modelo podría combinar tarjetas, texto y un selector. Si registraste `PlanCard`, también puede elegir ese componente más específico. Para decidir, el modelo usa las descripciones del catálogo.

**Las instrucciones orientan al modelo. La validación comprueba el resultado.** El análisis de la respuesta y el renderizador verifican que los mensajes respeten el contrato. La aplicación debe manejar las respuestas incompletas o rechazadas.

El formato de inferencia determina cómo escribe su respuesta el modelo. Este ejemplo usa Direct JSON y la analiza con `openStream()`, que puede emitir mensajes A2UI a medida que llegan las partes de la respuesta.

## Cómo se convierten los mensajes en widgets de Flutter

Una vez que el agente describe la interfaz, el renderizador necesita saber en qué superficie mostrarla y cómo se relacionan sus componentes.

En este ejemplo, `createSurface` crea una superficie e identifica el catálogo que usará. `updateComponents` envía las descripciones de los componentes. `updateDataModel` modifica los valores que esos componentes pueden usar mediante enlaces. [Mensajes de A2UI](https://a2ui.org/concepts/messages/).

Después de crear una superficie llamada `planAnswer` con el catálogo anterior, el agente podría enviar esta estructura.

```json
{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "planAnswer",
    "components": [
      { "id": "root", "component": "Column", "children": ["title", "plan"] },
      { "id": "title", "component": "Text", "text": "Tus opciones de plan", "variant": "body" },
      { "id": "plan", "component": "Card", "child": "planName" },
      { "id": "planName", "component": "Text", "text": "Studio", "variant": "body" }
    ]
  }
}
```

Los componentes vienen en una lista plana. Las referencias entre ellos forman un árbol. `root` contiene a `title` y `plan`, y la tarjeta `plan` contiene a `planName`. El ID distingue cada instancia. El campo `component` indica su tipo en el catálogo.

1. **Aplicar el mensaje.** `MessageProcessor` comprueba el contenido y actualiza los registros de componentes de la superficie.
2. **Resolver las relaciones.** A partir de la raíz, la capa de resolución sigue los IDs de los hijos y conecta las propiedades con sus datos.
3. **Construir los widgets.** `A2uiSurface` usa los constructores registrados para armar el subárbol de Flutter y responder a los cambios.

El renderizador busca una implementación para cada tipo de componente y ejecuta el código que tu aplicación ya registró.

Los mensajes pueden referirse a las superficies y a los componentes por sus IDs. Así, un mensaje posterior puede convertir un formulario en una confirmación dentro de la misma superficie.

## Cómo responden los campos y las acciones

A2UI separa la estructura de los componentes de los valores que cambian cuando alguien usa la interfaz.

Cada superficie tiene un modelo de datos. Un campo de texto puede enlazar su valor a una ruta como `{"@path": "/name"}`. La aplicación o el agente define los valores iniciales. Cuando alguien edita el campo, su implementación escribe en esa ruta, y los demás componentes enlazados al valor pueden reflejar el cambio. [Guía del modelo de datos y sus enlaces](https://a2ui.org/concepts/data-binding/).

En un formulario para elegir un plan, el modelo de datos podría guardar el nombre y el plan seleccionado. Mientras la persona escribe, los cambios se aplican al estado local de la superficie.

El botón define el momento en que se comunica una interacción. Su acción puede incluir enlaces a los valores del formulario.

```json
{
  "event": {
    "name": "choosePlan",
    "context": {
      "name": { "@path": "/name" },
      "plan": { "@path": "/plan" }
    }
  }
}
```

Al presionar el botón, el renderizador resuelve esas rutas y emite una acción con los valores actuales. La aplicación puede ejecutar una operación, reenviar la acción al agente o hacer ambas cosas antes de actualizar la superficie.

En una suscripción real, corresponde a la aplicación validar el pedido y los permisos, ejecutar la operación en el servidor y comunicar su resultado. El agente puede usar ese resultado para componer la siguiente respuesta.

## Diseñá el catálogo para la tarea

Para una selección de planes, definí qué información necesita el usuario, qué opciones puede elegir y qué resultado debería ver al terminar. Después, elegí los componentes que mejor representen esas decisiones.

Los componentes básicos te dan flexibilidad. Los componentes propios permiten encapsular decisiones de diseño en una interfaz pública más chica. Por ejemplo, el agente puede ordenar varias instancias de `PlanCard` y dejar la disposición interna a cargo de cada tarjeta.

Describí con precisión las propiedades de los componentes y agregá ejemplos. Vinculá los datos del negocio con una fuente confiable para que un precio bien presentado también sea correcto. Probá la interacción completa, incluso cuando una opción ya no está disponible, una respuesta es inválida o una operación falla.

Para empezar, elegí una tarea concreta que puedas resolver con pocos componentes. Seguí el recorrido desde el pedido inicial hasta el resultado de una acción. Así vas a ver qué puede expresar el agente con tu catálogo y qué propiedades o componentes conviene ajustar.

## Probá cómo funciona

El playground de abajo usa ocho componentes del catálogo básico, suma un gráfico de barras para el tablero de ventas y muestra la superficie de Flutter junto a los mensajes A2UI que la describen.

Presioná **Iniciar demo** y elegí el tablero, la comparación de auriculares o el formulario de registro. El modo **REPRODUCCIÓN · Grabado** aplica mensajes preparados sin consultar a un modelo. Si enviás el formulario, el botón emite un evento y la app actualiza la misma superficie con una confirmación. Los datos son ilustrativos y el formulario no crea una cuenta.

Para probar tus propios pedidos, elegí **Usar mi clave de Gemini**. Las consultas en vivo se hacen con tu cuenta de Google y pueden generar cargos. Los valores que envíes mediante el formulario también llegan al modelo. La clave se mantiene en memoria hasta que reinicies la demo o recargues la página. En pantallas angostas, **UI / A2UI** alterna entre la interfaz y sus mensajes.

Podés ver el catálogo, las instrucciones del agente, el renderizador y el manejo de acciones en la misma implementación. [Abrí el playground completo](/blog/flutter-a2ui-playground/demo?lng=es) o [descargá el código fuente](/downloads/flutter-a2ui-playground.zip).
