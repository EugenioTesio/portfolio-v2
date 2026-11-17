*Convertí la guía de ingeniería en evaluaciones repetibles, probá el evaluador y entendé qué demuestra un resultado aprobado.*

Un equipo escribe sus reglas de oro: lógica de negocio independiente, dependencias inyectadas, comportamiento observable. El asistente las recibe, la respuesta parece razonable y el informe queda en verde.

La confianza depende de qué se haya aprobado. Una regla puede ser clara y, aun así, no servir para la tarea. Un asistente puede repetirla mientras la incumple en el código. Un evaluador puede aprobar el vocabulario correcto sin comprobar el comportamiento que describe.

El repositorio privado [`flutter-golden-rules`](https://github.com/EugenioTesio/flutter-golden-rules) ofrece reglas escritas, escenarios, respuestas guardadas y un programa que puntúa. Los ejemplos usan Flutter, pero el problema vale para cualquier asistente. Los fragmentos de abajo son adaptaciones autónomas. Los enlaces van al código revisado el 17 de noviembre de 2026, para quien tenga acceso. Las mejoras propuestas están marcadas como tales.

## Empezá con una regla que puedas observar

Una regla de oro es una expectativa documentada. Le da al asistente un criterio: dónde van las responsabilidades, qué dependencias se permiten o qué debe mostrar una prueba útil.

> La lógica de aplicación recibe sus dependencias externas mediante contratos. El arranque de la aplicación aporta las implementaciones concretas y las pruebas pueden reemplazarlas por *fakes*.

Es más comprobable que “usar arquitectura limpia”: se puede inspeccionar un constructor, seguir una dependencia y repetir la operación con un fake.

El arranque tiene que construir dependencias concretas. Prohibir esa construcción en todos lados rechazaría el cableado que la regla exige. Antes de los escenarios, registrá dónde se aplica, para qué existe y qué excepciones son válidas.

Después, separá tres preguntas:

- **Cumplimiento:** ¿el asistente respeta el límite documentado?
- **Utilidad:** ¿ese límite ayuda a producir una solución correcta y mantenible?
- **Precisión del evaluador:** ¿la comprobación acepta soluciones válidas y rechaza incumplimientos?

Una puntuación alta de cumplimiento no resuelve las otras dos. Podés exigir una abstracción innecesaria con total consistencia, o medir una regla útil con una comprobación débil.

## Convertí la expectativa en una evaluación

Una evaluación, o **eval**, le da una tarea al asistente y comprueba la respuesta contra expectativas definidas. La tarea, el entorno y el método deciden qué significa el resultado.

Para la inyección de dependencias, pedí un checkout con un contrato de pagos existente. Definí el éxito antes: checkout recibe la pasarela, cobra el importe y se puede probar sin un servicio real.

Este YAML abreviado toma la [estructura de escenarios](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/golden_rules/evals/datasets/ioc.eval.yaml) del repositorio. Ilustra una definición. No es un conjunto de datos que la herramienta pueda ejecutar tal cual.

```yaml
id: "architecture.checkout.inject_gateway"
input:
  prompt: >
    Implementá checkout usando el contrato PaymentGateway existente.
    Incluí una prueba unitaria con un fake.
  context: "El arranque de la aplicación construye las dependencias."
expected:
  behavior: >
    Checkout recibe PaymentGateway mediante su constructor.
    Una prueba aporta un fake y verifica el pedido de cobro.
  must_contain:
    - "PaymentGateway"
    - "constructor"
criteria:
  - description: "Checkout no construye ni busca su pasarela"
    type: "must_pass"
    weight: 1.0
```

Mencionar `PaymentGateway` y `constructor` dice muy poco sobre la implementación. La descripción del comportamiento es el objetivo, y el evaluador tiene que demostrar que puede representarla. Dejá esa respuesta esperada fuera de la entrada del asistente. Dale la tarea y las reglas que vería en el trabajo habitual.

## Cubrí las decisiones, incluidas las excepciones

Un checkout aprobado es una sola observación. Pedí una implementación válida, la revisión de un incumplimiento y la revisión de código que ya cumple la regla. La pasarela concreta del arranque es una excepción legítima: si no, un revisor que marca todo tipo concreto parece eficaz.

Cambiá las palabras sin cambiar la intención. “Hacé que el checkout se pueda probar sin el servicio de pagos” debería ejercer el mismo límite sin el vocabulario de la regla. Una tarea que además pida manejo de errores puede perder una regla al armar la funcionalidad.

Explicar por qué una búsqueda global es un problema evalúa la revisión. Reemplazarla sin romper el checkout evalúa la implementación. También separá la **aplicación de la regla** de su **entrega**. Un escenario que incluye la regla evalúa la aplicación. Para evaluar la entrega, partí de una tarea representativa y confirmá que la guía configurada llega de verdad al asistente. La selección de archivos puede fallar antes de cualquier razonamiento de diseño.

## Seguí el proceso real del repositorio

Las reglas están en archivos `.mdc` y los escenarios en YAML, con la regla, las entradas, el comportamiento esperado, las comprobaciones de texto y los criterios. El [README](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/README.md) documenta los comandos. Con las dependencias de Python instaladas, desde la raíz:

```bash
./eval list
./eval extract .
```

La extracción escribe `eval-test-runner/eval_prompts.json` y, si falta, un `eval_responses.json` inicial. **La extracción no llama a un modelo.** Otro paso tiene que generar cada respuesta a partir de la regla, el pedido, el contexto y cualquier fragmento de código.

Guardá la respuesta como texto bajo el identificador del escenario. Esto muestra la forma del archivo, no una respuesta completa:

```json
{
  "flutter.ioc.no_injector_in_build": "Pass the use case through the constructor; build uses the supplied dependency."
}
```

Después, ejecutá:

```bash
./eval score .
```

El [programa](https://github.com/EugenioTesio/flutter-golden-rules/blob/main/eval-test-runner/run_evals.py) lee esas respuestas guardadas y escribe informes Markdown en `golden_rules/evals/reports/`. Las comprobaciones comparan fragmentos sin distinguir mayúsculas. Toda frase de `must_contain` debe aparecer y ninguna de `must_not_contain` puede estar. Los `common_anti_patterns` de cada conjunto se suman a la lista prohibida.

En los conjuntos actuales la puntuación es binaria: 100 o 0. Los informes listan criterios con peso, pero esos juicios quedan aprobados por defecto cuando pasan las comprobaciones de texto. La herramienta no compila código, no ejecuta pruebas ni decide si la arquitectura es correcta.

## Probá el evaluador antes de confiar en su puntuación

Puntuá ejemplos cuyo veredicto ya conozcas: una respuesta correcta, un incumplimiento evidente, una reformulación válida y una respuesta incorrecta con todas las frases esperadas. Revisá los desacuerdos antes de editar la regla para subir la puntuación.

Hay un **falso aprobado** cuando se acepta un incumplimiento. “El constructor debe buscar PaymentGateway globalmente” contiene los dos términos del ejemplo y recomienda el comportamiento que la regla rechaza.

Hay un **falso rechazo** cuando se descarta una respuesta válida. La inyección por constructor puede expresarse solo con código, sin la palabra “constructor”. Los conjuntos también prohíben frases como “looks good”, así que citarla para criticar una revisión superficial puede hacer fallar una conclusión correcta.

Las pruebas arman una trampa parecida. Este fragmento usa vocabulario conocido y nunca llama a checkout ni comprueba un resultado:

```python
def test_checkout_charges_gateway():
    # GIVEN / WHEN / THEN
    gateway = FakeGateway()
    checkout = Checkout(gateway)
```

Una prueba útil actúa y verifica el resultado:

```python
checkout.pay(amount=25)
assert gateway.charges == [25]
```

Para los evaluadores que juzgan, compará sus decisiones con ejemplos etiquetados por separado y registrá tanto los errores omitidos como las falsas alarmas. Hamel Husain y Shreya Shankar explican cómo separar los ejemplos de desarrollo de la prueba final en [su guía para confiar en las evaluaciones automatizadas](https://hamel.dev/blog/posts/evals-faq/how-do-i-know-if-i-can-trust-my-automated-eval.html).

## Construí evidencia en capas

Estas comprobaciones van más allá de la herramienta actual. Una inspección puede detectar una pasarela construida dentro de checkout, y una prueba ejecutable puede pasar un fake, verificar el cobro y cubrir un pago rechazado. En un fixture aislado, eliminá esa llamada. Si la prueba sigue pasando, no protege el requisito, y un resultado en verde no alcanza.

Una persona puede juzgar si una abstracción nueva es proporcionada. Un modelo puede revisar una decisión de diseño abierta si tiene una rúbrica y sus decisiones se calibran contra el criterio de expertos. Otro modelo no es, por defecto, una autoridad independiente. Anthropic describe cómo se complementan los evaluadores de código, de modelos y humanos en [su guía de evaluaciones](https://www.anthropic.com/research/demystifying-evals-for-ai-agents).

Para ver si las reglas ayudan, corré las mismas tareas sin reglas extra, con las actuales y con una revisión. Fijá el modelo, las herramientas, el repositorio inicial y los requisitos, y sacá las pistas que revelan la respuesta. Usá sesiones nuevas, repetí tareas para ver los fallos y reservá casos nunca vistos hasta cerrar la revisión. Puntuar otra vez una respuesta guardada solo vuelve a probar el programa. Si esos casos reservados motivan otro cambio, guardá un conjunto nuevo.

## Informá lo que la puntuación no dice

Decí qué probaste, cuántas tareas e intentos planeaste, cuántos terminaron y qué falló. Mostrá los fallos por regla. Un promedio alto puede ocultar un límite que siempre se rompe.

En esta herramienta, los identificadores sin respuesta se omiten y quedan fuera del total, y los informes individuales no arrastran esas omisiones. Compará el informe con el conjunto antes de dar la corrida por completa. Registrá el modelo, la generación, las revisiones de reglas y datos, la versión del evaluador y el entorno junto con las salidas. La etiqueta opcional de modelo solo renombra archivos: no llama ni verifica ese modelo, y un intento nuevo no debería pisar uno anterior.

Para la utilidad, mirá más allá del cumplimiento: ¿la funcionalidad anda?, ¿se puede reemplazar la dependencia sin reescribir la lógica de aplicación?, ¿cuánta revisión hizo falta? Las tareas conocidas dicen poco sobre un trabajo nuevo, y las repeticiones miden consistencia, no cobertura.

## Ponelo en práctica

Empezá con una regla que importe y un conjunto chico y variado de tareas realistas:

1. Escribí su alcance, el comportamiento observable y las excepciones válidas.
2. Definí el éxito y creá ejemplos que sepas correctos e incorrectos.
3. Comprobá que el evaluador separe esos ejemplos con justicia.
4. Corré intentos nuevos con y sin la regla, en condiciones equivalentes.
5. Leé el código, los resultados de las pruebas y los fallos junto a las puntuaciones.
6. Cambiá la regla o el evaluador según la causa que hayas encontrado y después probá tareas nunca vistas.

Una regla de oro es una decisión de ingeniería con evidencia detrás. La confianza que vale la pena afirmar es específica: qué comportamientos mejoran, en qué condiciones y qué fallos puede detectar de verdad la evaluación.
