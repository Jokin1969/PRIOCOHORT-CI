// Contenido completo de la Hoja de Información al Paciente
const INFORMATION_CONTENT = {
    // Página principal con datos del estudio
    intro: {
        id: 'intro',
        title: 'Hoja de información',
        showInIndex: false,
        content: `
            <div class="info-header-section">
                <h1>Cohorte prospectiva de familias con enfermedades priónicas: recopilación de muestras biológicas para el análisis de potenciales biomarcadores diagnósticos y pronósticos y caracterización de la historia natural</h1>
                <h2>(PRIOCOHORT)</h2>

                <div class="study-info">
                    <h3>INVESTIGADORES PRINCIPALES:</h3>
                    <ul>
                        <li>Dra. Izaro Kortazar - Hospital Universitario Araba (Coordinadora Clínica) - <a href="mailto:izaro.kortazarzubizarreta@osakidetza.eus">izaro.kortazarzubizarreta@osakidetza.eus</a></li>
                        <li>Dr. Joaquín Castilla - CIC bioGUNE (Coordinador Científico) - <a href="mailto:jcastilla@cicbiogune.es">jcastilla@cicbiogune.es</a></li>
                    </ul>
                </div>

                <div class="important-box">
                    <p>Este documento contiene toda la información que necesita conocer sobre el estudio. Le pedimos que lo lea con tranquilidad y que haga todas las preguntas que considere necesarias. No hay prisa para tomar la decisión. Puede consultar con sus familiares, amigos o su médico habitual.</p>

                    <p><strong>Su participación es completamente voluntaria.</strong> Puede decidir no participar sin que esto afecte en absoluto a la atención médica que reciba. Si decide participar, puede cambiar de opinión y retirarse del estudio en cualquier momento, sin dar explicaciones y sin que esto le perjudique de ninguna manera tanto en el presente como en el futuro.</p>
                </div>
            </div>
        `
    },

    // Sección 1
    section1: {
        id: 'section1',
        title: '¿Por qué es importante este estudio ahora?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿POR QUÉ ES IMPORTANTE ESTE ESTUDIO AHORA?</h2>

            <p>Las enfermedades priónicas están viviendo un momento histórico. Por primera vez, tenemos razones reales para ser optimistas:</p>

            <div class="highlight-box">
                <h4>💊 Hay tratamientos en desarrollo:</h4>
                <p>El primer medicamento específico para enfermedades priónicas (llamado ION717) ya se está probando en pacientes. Otros tratamientos innovadores, incluyendo terapias génicas, están muy avanzados.</p>
            </div>

            <div class="highlight-box">
                <h4>🔬 Podemos detectar la enfermedad mucho antes:</h4>
                <p>Nuevas técnicas de laboratorio nos permiten encontrar señales de la enfermedad en sangre, orina y otros fluidos corporales, incluso antes de que aparezcan los síntomas. No obstante, es necesario seguir investigando estos marcadores de enfermedad para mejorar su capacidad de predicción del inicio de la enfermedad.</p>
            </div>

            <div class="highlight-box">
                <h4>📊 Necesitamos entender mejor cómo evoluciona la enfermedad:</h4>
                <p>Para que estos nuevos tratamientos sean efectivos y el diagnóstico más precoz y certero, necesitamos conocer exactamente cómo y cuándo actuar. Su participación nos ayudará a responder estas preguntas.</p>
            </div>
        `
    },

    // Sección 2
    section2: {
        id: 'section2',
        title: '¿Cuál es el propósito del estudio?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿CUÁL ES EL PROPÓSITO DEL ESTUDIO?</h2>

            <h3>¿Qué queremos conseguir?</h3>
            <p>Nuestro objetivo principal es comprender en profundidad cómo evolucionan las enfermedades priónicas en cada persona, especialmente en las formas genéticas, para mejorar el diagnóstico, el seguimiento y preparar el desarrollo de futuras terapias.</p>

            <p>Para que esto sea posible, necesitamos:</p>

            <div class="objective-section">
                <h4>🎯 Desarrollar mejores métodos de diagnóstico temprano</h4>
                <p>Tradicionalmente, las enfermedades priónicas solo se podían diagnosticar con certeza después del fallecimiento del paciente, mediante el examen del cerebro. Esto ha cambiado radicalmente. Ahora sabemos que podemos detectar señales de la enfermedad en distintos fluidos y tejidos como sangre, orina, saliva, lágrimas, líquido cefalorraquídeo e, incluso, en pequeñas muestras de piel, aunque aún quedan incógnitas sobre su fiabilidad y su capacidad predictiva del inicio de la enfermedad.</p>
                <p><strong>¿Por qué es importante?</strong> Porque los nuevos tratamientos funcionarán mejor cuanto antes se empiecen, idealmente antes de que aparezcan los primeros síntomas.</p>
            </div>

            <div class="objective-section">
                <h4>📈 Entender cómo evoluciona la enfermedad en cada persona</h4>
                <p>Cada familia, e incluso cada persona dentro de la misma familia, puede tener una evolución diferente. Necesitamos entender:</p>
                <ul>
                    <li>¿A qué edad suelen aparecer los primeros síntomas?</li>
                    <li>¿Qué señales aparecen primero en los análisis?</li>
                    <li>¿Cómo de rápido progresa la enfermedad?</li>
                    <li>¿Qué factores pueden influir en esta evolución?</li>
                </ul>
                <p><strong>¿Por qué es importante?</strong> Para poder predecir cuál será el mejor momento para empezar un futuro tratamiento en cada persona específica.</p>
            </div>

            <div class="objective-section">
                <h4>🔍 Desarrollar y validar biomarcadores</h4>
                <p>Los biomarcadores son como "señales de alarma" que nos ayudan en múltiples aspectos:</p>
                <ul>
                    <li><strong>Para el diagnóstico:</strong> Confirmar si alguien tiene la enfermedad</li>
                    <li><strong>Para el pronóstico:</strong> Predecir cuándo pueden aparecer los síntomas y cómo evolucionarán estos</li>
                    <li><strong>Para el seguimiento:</strong> Monitorizar la progresión de la enfermedad</li>
                    <li><strong>Para futuros tratamientos:</strong> Evaluar si las terapias están funcionando (en los ensayos clínicos que vendrán)</li>
                </ul>
                <p>Necesitamos biomarcadores que sean: 1) Fiables y precisos, 2) Fáciles de medir, 3) Que detecten cambios tempranos, y 4) Útiles para múltiples propósitos (diagnóstico, pronóstico y monitorización).</p>
            </div>

            <div class="highlight-box">
                <h4>¿Qué hace especial a este estudio?</h4>
                <ul>
                    <li><strong>Es multicéntrico y coordinado:</strong> Participan los mejores especialistas de España en enfermedades priónicas, trabajando de forma coordinada.</li>
                    <li><strong>Tiene colaboraciones internacionales:</strong> Está conectado con centros de excelencia mundial, lo que significa acceso a las mejores tecnologías y conocimientos.</li>
                    <li><strong>Es longitudinal (a largo plazo):</strong> Le seguiremos durante años, lo que nos permite ver cómo evoluciona su situación personal.</li>
                    <li><strong>Incluye a toda la familia:</strong> Estudiamos tanto a personas portadoras como a familiares no portadores, lo que nos da una visión completa.</li>
                    <li><strong>Integra múltiples tecnologías:</strong> Combinamos análisis genéticos, biomarcadores en sangre y otros fluidos, neuroimagen y seguimiento clínico detallado, cuando se requiera.</li>
                </ul>
            </div>
        `
    },

    // Sección 3
    section3: {
        id: 'section3',
        title: '¿Quién puede participar?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUIÉN PUEDE PARTICIPAR?</h2>

            <h3>Requisitos de edad</h3>
            <p>Para participar en este estudio es necesario ser <strong>mayor de 18 años</strong>, sin excepción. Este requisito se aplica tanto para los participantes principales como para los familiares que deseen actuar como observadores.</p>

            <h3>Elegibilidad general</h3>
            <p>Puede participar cualquier persona sin ninguna restricción específica, siempre que pertenezca a una familia afectada de forma directa o indirecta por una enfermedad priónica. Esto incluye tanto personas afectadas por enfermedades priónicas genéticas como no genéticas (esporádicas). En el caso de las formas genéticas, pueden participar tanto portadores como no portadores de las mutaciones genéticas, y entre los portadores, tanto aquellos que tienen signos clínicos como aquellos que permanecen asintomáticos. <strong>Todos estos grupos son candidatos igualmente valiosos para participar en el estudio.</strong></p>

            <h3>Importancia de los diferentes grupos de participantes</h3>
            <ul>
                <li><strong>Los portadores asintomáticos</strong> nos ayudan a entender la fase presintomática de la enfermedad y a identificar biomarcadores tempranos que puedan predecir cuándo podrían aparecer los primeros síntomas.</li>
                <li><strong>Los portadores con síntomas</strong> nos permiten estudiar cómo evoluciona la enfermedad una vez iniciada y correlacionar los cambios clínicos con los biomarcadores.</li>
                <li><strong>Los familiares no portadores</strong> (solo en casos genéticos o de enfermedad familiar) son igualmente necesarios porque sirven como grupo de control, permitiéndonos distinguir qué cambios en los biomarcadores son específicos de la enfermedad priónica y cuáles podrían ser normales según la edad o factores familiares compartidos.</li>
                <li><strong>Las personas afectadas por formas esporádicas</strong> (no genéticas) aportan información valiosa sobre los mecanismos comunes de la enfermedad independientemente de su origen.</li>
            </ul>

            <h3>No es necesario conocer su estado genético previamente</h3>
            <p>Para participar en este estudio no es necesario que sepa si usted es portador o no de una mutación genética. De hecho, una de las funciones del estudio es determinar el estado genético de los participantes que lo desconocen. Si pertenece a una familia donde se ha diagnosticado una enfermedad priónica genética pero no sabe si usted ha heredado la mutación, puede participar igualmente. El análisis genético se realizará como parte del estudio y <strong>usted decidirá si desea conocer o no los resultados.</strong></p>

            <p>Esta flexibilidad permite que las familias participen independientemente de las decisiones individuales previas sobre pruebas genéticas, protegiendo siempre el derecho de cada participante a no saber su estado de portador o no portador, mientras así lo desee.</p>

            <h3>Familias con diferentes situaciones</h3>
            <p>Reconocemos que cada familia tiene una situación única. Algunas familias pueden tener varios miembros afectados, otras pueden tener solo un caso aislado, y algunas pueden estar en fases muy tempranas de comprensión de la enfermedad. <strong>Todas estas situaciones son apropiadas para la participación.</strong> El estudio está diseñado para adaptarse a la diversidad de circunstancias familiares y personales, ya que esta variabilidad enriquece nuestra comprensión de cómo las enfermedades priónicas afectan a diferentes familias e individuos.</p>
        `
    },

    // Sección 4
    section4: {
        id: 'section4',
        title: '¿Qué tipo de muestras se necesitan?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ TIPO DE MUESTRAS SE NECESITAN?</h2>

            <p>Para comprender la historia natural de las enfermedades priónicas y desarrollar mejores métodos de diagnóstico temprano, necesitamos analizar diferentes tipos de muestras biológicas donde podemos detectar biomarcadores específicos. Estas muestras nos permiten buscar señales de la enfermedad incluso antes de que aparezcan síntomas, seguir su evolución a lo largo del tiempo, y correlacionar los cambios en las muestras (subidas o bajadas en los niveles de biomarcadores) con la progresión clínica (la aparición y severidad de los signos y síntomas que caracterizan la enfermedad).</p>

            <div class="warning-box">
                <p><strong>IMPORTANTE:</strong> Aunque a continuación se describen todas las muestras que potencialmente se le puede solicitar que done, no todas las personas donarán el mismo tipo de muestras ni en los mismos momentos. El tipo y frecuencia de muestras se adaptará a su situación específica y al desarrollo del estudio. Algunas de las muestras que consideramos especiales requerirán información adicional detallada y un consentimiento específico adicional, donde se le explicará la peculiaridad y necesidades especiales de cada tipo de muestra.</p>
            </div>

            <h3>Muestras básicas</h3>

            <div class="sample-box">
                <h4>🩸 Análisis de sangre</h4>
                <ul>
                    <li><strong>¿Cuánta sangre?</strong> 20-30 ml (equivalente a 2-3 tubos pequeños, como los de las analíticas de sangre habituales)</li>
                    <li><strong>¿Para qué?</strong> Buscar proteínas y otras sustancias que nos indiquen cómo está evolucionando la enfermedad</li>
                    <li><strong>¿Molestias?</strong> Similares a cualquier análisis médico rutinario</li>
                    <li><strong>¿Riesgos?</strong> Mínimos: posible pequeño moretón que desaparece en pocos días</li>
                </ul>
            </div>

            <div class="sample-box">
                <h4>💧 Muestra de orina</h4>
                <ul>
                    <li><strong>¿Cuánta?</strong> 100 ml de la primera orina de la mañana</li>
                    <li><strong>¿Cómo?</strong> En su casa, con un recipiente que le proporcionaremos</li>
                    <li><strong>¿Para qué?</strong> Detectar señales muy tempranas de la enfermedad</li>
                    <li><strong>¿Molestias?</strong> Ninguna</li>
                    <li><strong>¿Riesgos?</strong> Ninguno</li>
                </ul>
            </div>

            <div class="sample-box">
                <h4>👄 Muestra de saliva</h4>
                <ul>
                    <li><strong>¿Cómo?</strong> De dos formas posibles:
                        <ul>
                            <li>Pasando suavemente un bastoncillo por el interior de la boca</li>
                            <li>Escupiendo saliva en un tubo especial que le proporcionaremos</li>
                        </ul>
                    </li>
                    <li><strong>¿Para qué?</strong> Confirmar su información genética y detectar biomarcadores</li>
                    <li><strong>¿Molestias?</strong> Ninguna, menos que hacerse una prueba de COVID</li>
                    <li><strong>¿Riesgos?</strong> Ninguno</li>
                </ul>
            </div>

            <h3>Muestras adicionales (solo en casos concretos y con su consentimiento específico adicional)</h3>

            <div class="sample-box special">
                <h4>😢 Lágrimas</h4>
                <ul>
                    <li><strong>¿Cómo?</strong> Con una tirita de papel especial, como las pruebas de ojo seco</li>
                    <li><strong>¿Cuándo?</strong> Solo si los estudios iniciales muestran que puede ser útil</li>
                    <li><strong>¿Molestias?</strong> Mínimas y temporales (para esta muestra no se requerirá consentimiento específico adicional por no ser un procedimiento doloroso ni invasivo)</li>
                </ul>
            </div>

            <div class="sample-box special">
                <h4>👃 Hisopo nasal</h4>
                <ul>
                    <li><strong>¿Cómo?</strong> Similar a una prueba de COVID</li>
                    <li><strong>¿Para qué?</strong> La mucosa nasal está muy cerca del cerebro y puede darnos información valiosa</li>
                    <li><strong>¿Molestias?</strong> Leves y temporales (para esta muestra no se requerirá consentimiento específico adicional por no ser un procedimiento doloroso ni invasivo)</li>
                </ul>
            </div>

            <div class="sample-box special-consent">
                <h4>🔬 Biopsia de piel (muy excepcional)</h4>
                <ul>
                    <li><strong>¿Qué es?</strong> Tomar una muestra muy pequeña de piel (3 mm, como la punta de un lápiz)</li>
                    <li><strong>¿Cuándo?</strong> Solo en casos muy específicos donde puede aportar información crucial</li>
                    <li><strong>¿Cómo?</strong> Con anestesia local, procedimiento ambulatorio</li>
                    <li><strong>¿Molestias?</strong> Dolor leve durante 2-3 días, pequeña cicatriz permanente</li>
                    <li><strong>⚠️ Requiere consentimiento específico adicional</strong></li>
                </ul>
            </div>

            <div class="sample-box special-consent">
                <h4>🧠 Líquido cefalorraquídeo (LCR) (muy excepcional)</h4>
                <ul>
                    <li><strong>¿Qué es?</strong> Líquido que rodea el cerebro y la médula espinal</li>
                    <li><strong>¿Cómo se obtiene?</strong> Punción lumbar (introducción de aguja en la espalda baja)</li>
                    <li><strong>¿Cuándo?</strong> Solo en casos muy seleccionados y con indicación médica específica</li>
                    <li><strong>¿Para qué?</strong> Análisis de biomarcadores con la máxima precisión diagnóstica</li>
                    <li><strong>Riesgos:</strong> Dolor de cabeza (20-30% casos), molestias en la espalda, muy raramente complicaciones más serias</li>
                    <li><strong>⚠️ Requiere consentimiento específico adicional</strong></li>
                </ul>
            </div>

            <div class="sample-box special-consent">
                <h4>💧 Otros fluidos corporales especiales</h4>
                <p>En casos muy concretos, podrían solicitarse otros fluidos corporales (como sudor, fluido seminal, secreciones vaginales, u otros) si la investigación científica lo justifica.</p>
                <p><strong>⚠️ Solo con consentimiento específico adicional</strong></p>
            </div>
        `
    },

    // Sección 5
    section5: {
        id: 'section5',
        title: '¿Qué tipo de estudios haremos con sus muestras?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ TIPO DE ESTUDIOS HAREMOS CON SUS MUESTRAS?</h2>

            <div class="warning-box">
                <p><strong>IMPORTANTE:</strong> No en todos los casos el donante será sometido a todos los tipos de análisis que se describen a continuación. La selección de estudios se realizará según su situación específica, el desarrollo del estudio y siempre con su consentimiento. Algunos análisis son básicos y se realizan a todos los participantes, mientras que otros son opcionales o se realizan solo en casos específicos.</p>
            </div>

            <h3>Análisis genéticos básicos</h3>
            <ul>
                <li>Confirmación de si es portador de una mutación priónica</li>
                <li>Tipo específico de mutación (E200K, D178N, P102L, A117V, u otras)</li>
                <li>Variantes que pueden influir en la enfermedad (polimorfismo en posición 129 u otros)</li>
            </ul>

            <h3>Análisis genómicos ampliados (opcionales)</h3>
            <ul>
                <li><strong>Secuenciación del genoma completo</strong> - Para encontrar otros genes que influyan en el tiempo de aparición de la enfermedad o en la intensidad de sus manifestaciones</li>
                <li><strong>Estudios de farmacogenómica</strong> - Cómo responderá a futuros medicamentos</li>
                <li><strong>Análisis de ancestralidad</strong> - Estudio del origen genético de una persona o población a partir del análisis de marcadores heredados, con el objetivo de identificar linajes, orígenes geográficos y relaciones evolutivas</li>
            </ul>

            <div class="warning-box">
                <p><strong>IMPORTANTE:</strong> Al realizar estudios genómicos es posible obtener resultados genéticos que puede tener un impacto en la salud, pero no está relacionado con el objetivo inicial de la prueba genética, se conocen como <strong>hallazgos secundarios</strong> sobre los que el Colegio Americano de Genética Médica (ACMG) seleccionó un listado de genes que consideró accionables.</p>

                <p>Se llaman genes "accionables" porque, si una persona tiene una alteración en uno de ellos, existe una acción médica posible: ya sea prevención, seguimiento especial o tratamiento. Estos genes están asociados con predisposición a cáncer, miocardiopatías y trastornos del ritmo cardiaco, errores innatos del metabolismo o la hipercolesterolemia familiar.</p>
            </div>

            <h3>Análisis bioquímicos (según indicación)</h3>
            <p>Los análisis bioquímicos buscan detectar proteínas y otras sustancias en sus muestras de sangre, orina, saliva y otros fluidos que puedan indicar cambios relacionados con la enfermedad. Estos estudios incluyen:</p>
            <ul>
                <li>Detección de biomarcadores de neurodegeneración (como proteínas que indican daño neuronal)</li>
                <li>Análisis de la proteína priónica patológica mediante técnicas de amplificación muy sensibles</li>
                <li>Medición de otras sustancias que nos ayuden a entender cómo evoluciona la enfermedad y predecir su progresión</li>
            </ul>

            <h3>Análisis de imagen y otros estudios especiales (cuando estén indicados)</h3>
            <p>Los estudios de imagen, principalmente resonancia magnética cerebral, nos permiten observar cambios estructurales en el cerebro que pueden estar relacionados con la evolución de la enfermedad. Estos análisis solo se realizan cuando están médicamente indicados y pueden aportar información valiosa sobre la progresión.</p>

            <p>También podríamos realizar otros estudios especiales como análisis de función cognitiva detallada, estudios neurofisiológicos, o evaluaciones específicas según el desarrollo de nuevas tecnologías diagnósticas. <strong>Todos estos estudios especiales requieren su consentimiento específico y se realizan solo cuando pueden aportar información relevante para su caso particular.</strong></p>
        `
    },

    // Sección 6
    section6: {
        id: 'section6',
        title: '¿Qué tipo de estudios haremos con su ayuda y con la colaboración de la familia?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ TIPO DE ESTUDIOS HAREMOS CON SU AYUDA Y CON LA COLABORACIÓN DE LA FAMILIA?</h2>

            <p>Uno de los objetivos de este estudio es comprender la historia natural de las enfermedades priónicas - es decir, cómo evolucionan desde las fases más tempranas hasta las más avanzadas. Para conseguir esto, necesitamos construir esta historia desde dos perspectivas complementarias: la médica y la familiar.</p>

            <h3>Historia natural desde la perspectiva médica</h3>
            <p>Los neurólogos construirán la historia natural de la enfermedad gracias a su participación mediante evaluaciones médicas regulares. Cada participante es diferente y no todos se someterán a los mismos procedimientos - todo se adaptará a su situación específica, estado de salud y preferencias personales.</p>

            <p><strong>Ejemplos de evaluaciones que se podrían realizar incluyen:</strong></p>

            <h4>Durante las visitas médicas (con frecuencia adaptada a cada caso):</h4>
            <ul>
                <li>Conversación con el neurólogo sobre la evolución de síntomas y cambios desde la última visita</li>
                <li>Examen neurológico básico de reflejos, coordinación, fuerza y equilibrio</li>
                <li>Pruebas cognitivas sencillas de memoria, atención y lenguaje que duran entre 15-20 minutos</li>
                <li>Cuestionarios sobre calidad de vida para conocer cómo se siente en su día a día</li>
            </ul>

            <h4>Evaluaciones más detalladas (solo cuando estén indicadas):</h4>
            <ul>
                <li>Evaluación neuropsicológica completa con pruebas más detalladas</li>
                <li>Resonancia magnética solo cuando esté médicamente indicada</li>
                <li>Asesoramiento genético si desea recibir información actualizada</li>
            </ul>

            <div class="important-box">
                <p><strong>IMPORTANTE:</strong> La frecuencia y tipo de evaluaciones se adaptará completamente a su estado de salud, capacidad y preferencias. Nuestro objetivo es obtener información valiosa sin causarle molestias innecesarias.</p>
            </div>

            <h3>Historia natural desde la perspectiva familiar</h3>
            <p>Una parte innovadora de este estudio es recoger información sobre cómo evoluciona la enfermedad, observada por familiares/cuidadores. Los familiares que conviven día a día con el participante pueden aportar información única sobre la evolución de la enfermedad que no se puede obtener en las consultas médicas. <strong>Esta participación está enfocada principalmente en casos en los que el donante haya empezado a mostrar signos de la enfermedad.</strong></p>

            <h4>¿Por qué es importante la perspectiva familiar?</h4>
            <p>La perspectiva familiar/cuidador es fundamental porque proporciona:</p>
            <ul>
                <li><strong>Observación continua:</strong> Los familiares ven cambios las 24 horas, los 7 días de la semana, permitiendo conocer la evolución real de cómo progresa la enfermedad en el entorno natural y no solo en visitas periódicas al hospital.</li>
                <li><strong>Identificación de cambios sutiles:</strong> Alteraciones que pueden pasar desapercibidas en visitas puntuales.</li>
                <li><strong>Historia completa:</strong> Información sobre capacidades diarias que complementa las evaluaciones médicas.</li>
            </ul>

            <h4>¿En qué consiste?</h4>
            <p>La participación familiar consiste en completar cuestionarios digitales sencillos optimizados para móviles donde se proporciona información sobre:</p>
            <ul>
                <li>Capacidades diarias como si puede cocinar, vestirse o gestionar medicación</li>
                <li>Cambios que observen en memoria, comportamiento y síntomas físicos</li>
            </ul>
            <p>Cada cuestionario requiere aproximadamente 10-15 minutos y la frecuencia se adapta a la evolución del participante.</p>

            <h4>¿Quién puede participar como observador?</h4>
            <ul>
                <li>Familiares que conviven con el participante</li>
                <li>Cuidadores principales</li>
                <li>Personas con contacto regular y cercano</li>
                <li>Varios observadores de la misma familia (más información es mejor)</li>
            </ul>
        `
    },

    // Sección 7
    section7: {
        id: 'section7',
        title: '¿Qué beneficios se esperan?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ BENEFICIOS SE ESPERAN?</h2>

            <h3>Si es portador asintomático de una mutación</h3>
            <p>Su participación le proporcionará seguimiento especializado por los mejores expertos en enfermedades priónicas, quienes podrán detectar de forma temprana cualquier cambio que pueda ocurrir y notificárselo si así lo desea. Esto le permitirá una mejor planificación de su futuro con información precisa sobre su evolución específica.</p>

            <p>Además, el conocimiento detallado de su estado genético y las opciones de asesoramiento genético especializado le ayudarán a tomar decisiones informadas sobre planificación familiar, incluyendo opciones reproductivas para tener descendencia libre de la mutación si así lo desea.</p>

            <h3>Si ya presenta síntomas de la enfermedad</h3>
            <p>Su participación le proporcionará seguimiento médico especializado continuo por expertos en enfermedades priónicas que comprenden profundamente su condición específica. Este seguimiento permitirá:</p>
            <ul>
                <li>Un mejor manejo de sus síntomas mediante intervenciones personalizadas adaptadas a la evolución de su enfermedad</li>
                <li>Acceso a cuidados especializados que pueden no estar disponibles en el seguimiento médico rutinario</li>
                <li>Información valiosa sobre la progresión de su enfermedad específica</li>
                <li>Estar informado sobre avances terapéuticos relevantes para su situación</li>
                <li>Participación prioritaria en futuros ensayos clínicos de tratamientos prometedores cuando estén disponibles</li>
            </ul>

            <h3>Si no es portador de la mutación</h3>
            <p>Tendrá la tranquilidad de confirmar definitivamente que no tiene riesgo genético de desarrollar la enfermedad, siempre que indique que quiere conocer su estado tras el análisis genético. En cualquier caso, su participación será una ayuda incalculable para su familia al contribuir a la investigación, y la información genética obtenida le servirá para tomar decisiones familiares futuras con total certeza sobre su estado, si ha decidido que quiere saberlo.</p>

            <h3>Para toda la familia</h3>
            <p>La participación en este estudio proporcionará a toda la familia:</p>
            <ul>
                <li>Una mejor comprensión de la enfermedad</li>
                <li>Acceso a asesoramiento genético especializado</li>
                <li>Conexión con otras familias en situación similar a través de la red de apoyo</li>
                <li>Información actualizada sobre todos los avances y desarrollos en el campo de las enfermedades priónicas</li>
            </ul>

            <h3>Para la ciencia y futuras generaciones</h3>
            <p>Su participación contribuirá significativamente al:</p>
            <ul>
                <li>Avance en biomarcadores que permitirán mejores formas de diagnóstico temprano</li>
                <li>Desarrollo de nuevas terapias</li>
                <li>Mejora en la comprensión de cómo y cuándo evoluciona la enfermedad</li>
                <li>Diseño de ensayos clínicos más efectivos y dirigidos que beneficiarán a futuras generaciones de familias afectadas</li>
            </ul>
        `
    },

    // Sección 8
    section8: {
        id: 'section8',
        title: '¿Qué tipo de riesgos, molestias y consideraciones especiales implica?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ TIPO DE RIESGOS, MOLESTIAS Y CONSIDERACIONES ESPECIALES IMPLICA?</h2>

            <h3>Riesgos físicos (muy bajos)</h3>

            <div class="risk-box low-risk">
                <h4>Muestras sin riesgos (orina, saliva y sudor)</h4>
                <ul>
                    <li>Sin riesgos físicos</li>
                    <li>Sin molestias</li>
                </ul>
            </div>

            <div class="risk-box low-risk">
                <h4>Lágrimas</h4>
                <ul>
                    <li>Molestia mínima y temporal durante la recolección</li>
                    <li>Muy raramente: irritación ocular leve</li>
                </ul>
            </div>

            <div class="risk-box low-risk">
                <h4>Sangre</h4>
                <ul>
                    <li>Dolor leve en el brazo</li>
                    <li>Posible pequeño moretón (desaparece en 3-7 días)</li>
                    <li>Muy raramente: mareo o desmayo</li>
                </ul>
            </div>

            <div class="risk-box low-risk">
                <h4>Hisopo nasal</h4>
                <ul>
                    <li>Molestias nasales leves durante el procedimiento</li>
                    <li>Posible estornudo o lagrimeo temporal</li>
                    <li>Muy raramente: sangrado nasal mínimo</li>
                </ul>
            </div>

            <div class="risk-box medium-risk">
                <h4>Biopsia de piel (solo si acepta específicamente)</h4>
                <ul>
                    <li>Dolor leve durante 2-3 días</li>
                    <li>Pequeña cicatriz permanente</li>
                    <li>Muy raramente: infección leve</li>
                </ul>
            </div>

            <div class="risk-box medium-risk">
                <h4>Líquido cefalorraquídeo (LCR) (solo si acepta específicamente)</h4>
                <ul>
                    <li>Dolor de cabeza (20-30% de casos)</li>
                    <li>Molestias en la espalda durante 1-2 días</li>
                    <li>Muy raramente: complicaciones más serias (infección, sangrado)</li>
                    <li>Requiere explicación detallada específica si se considera necesario</li>
                </ul>
            </div>

            <h3>Riesgos psicológicos</h3>

            <div class="risk-box psychological">
                <h4>Ansiedad por información genética</h4>
                <ul>
                    <li>Preocupación por desarrollar la enfermedad</li>
                    <li>Estrés por conocer resultados de análisis, siempre y cuando decida que quiere conocerlos</li>
                    <li>Impacto en planes de vida</li>
                </ul>
                <p><strong>Apoyo disponible:</strong> El estudio cuenta con asesoramiento genético y apoyo psicológico especializado para ayudarle a manejar estos aspectos emocionales.</p>
            </div>
        `
    },

    // Sección 9
    section9: {
        id: 'section9',
        title: '¿Cómo se va a manejar su información desde el punto de vista de la confidencialidad y protección de datos?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿CÓMO SE VA A MANEJAR SU INFORMACIÓN DESDE EL PUNTO DE VISTA DE LA CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS?</h2>

            <h3>Sus datos están completamente protegidos</h3>
            <p>Todos sus datos personales y muestras biológicas reciben protección completa mediante:</p>
            <ul>
                <li><strong>Codificación total:</strong> Solo se identifican con números y nunca con su nombre</li>
                <li><strong>Acceso limitado:</strong> Únicamente a investigadores autorizados del estudio</li>
                <li><strong>Separación estricta:</strong> La información identificativa se guarda por separado de los datos de investigación</li>
                <li><strong>Cumplimiento normativo:</strong> Todo el tratamiento de sus datos cumple rigurosamente con el GDPR europeo y la legislación española de protección de datos</li>
            </ul>

            <h3>Sus derechos están garantizados</h3>
            <p>Usted tiene derecho a:</p>
            <ul>
                <li><strong>Derecho de acceso:</strong> Consultar qué datos tenemos sobre usted</li>
                <li><strong>Derecho de rectificación:</strong> Corregir cualquier información incorrecta</li>
                <li><strong>Derecho de supresión:</strong> Solicitar eliminar sus datos cuando lo desee</li>
                <li><strong>Derecho de portabilidad:</strong> Recibir sus datos en formato estándar</li>
                <li><strong>Derecho de oposición:</strong> Oponerse al procesamiento de sus datos en cualquier momento</li>
            </ul>

            <h3>Protección especial de información genética</h3>
            <p>La información genética recibe protección especial con medidas de seguridad reforzadas debido a su naturaleza sensible. Garantizamos que:</p>
            <ul>
                <li><strong>No habrá discriminación:</strong> Esta información no se compartirá con empleadores o compañías de seguros</li>
                <li><strong>Comunicación familiar controlada:</strong> Cuando la información genética tenga implicaciones familiares relevantes, le informaremos sobre su relevancia para sus familiares, pero la comunicación se realizará únicamente según sus preferencias expresas y solo si usted lo desea</li>
            </ul>
        `
    },

    // Sección 10
    section10: {
        id: 'section10',
        title: '¿Cuál es el destino de la muestra tras su utilización?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿CUÁL ES EL DESTINO DE LA MUESTRA TRAS SU UTILIZACIÓN?</h2>

            <p>Una vez finalizada la investigación, es posible que queden muestras sobrantes. Respecto a estas muestras excedentes, se le ofrecen las siguientes opciones:</p>

            <h3>Opción A: Destrucción de las muestras sobrantes</h3>
            <p>Si elige esta opción, todas las muestras excedentes serán destruidas de forma segura siguiendo los protocolos establecidos una vez finalizada la investigación. Esto garantiza que no quede ningún material biológico suyo almacenado para usos futuros.</p>

            <h3>Opción B: Donación para investigación futura</h3>
            <p>Puede autorizar que sus muestras excedentes se utilicen en futuros proyectos de investigación biomédica relacionados con las enfermedades priónicas, o para cualquier investigación biomédica (preferentemente relacionada con enfermedades priónicas). Para ello, puede donar las muestras excedentes al <strong>Biobanco Vasco de la Fundación Vasca de Innovación e Investigación Sanitaria (BIOEF)</strong>, donde serán conservadas y destinadas a futuras investigaciones.</p>

            <p>Si elige esta opción, firmará un consentimiento específico que será custodiado por el coordinador del Biobanco en su Hospital. En este consentimiento podrá elegir entre dos modalidades de donación:</p>

            <div class="option-box">
                <h4>Donación codificada</h4>
                <p>Permite que usted pueda conocer, si lo desea, los resultados de las investigaciones futuras</p>
            </div>

            <div class="option-box">
                <h4>Donación anonimizada</h4>
                <p>Sus muestras quedarán completamente desvinculadas de su identidad, sin posibilidad de conocer resultados futuros</p>
            </div>

            <h3>Almacenamiento de las muestras en el Biobanco</h3>
            <p>Con la firma del consentimiento correspondiente, usted autoriza al Biobanco Vasco el almacenamiento y utilización de sus datos clínicos relevantes y sus muestras para proyectos de investigación que cumplan con los principios éticos y legales aplicables.</p>

            <p>La Dra. Izaro Kortazar, como clínica responsable de la investigación, entregará al Biobanco sus datos clínicos relevantes y las muestras según su voluntad expresada. Estas se almacenarán en las instalaciones del Hospital Universitario Araba adscritas al Biobanco, junto con el documento de consentimiento informado que usted haya firmado. Para garantizar la protección de su identidad, se empleará un procedimiento de codificación o anonimización y, en el primer caso, solo la Dra. Kortazar podrá relacionar estos datos codificados con su identidad.</p>

            <h3>Aspectos importantes a considerar</h3>

            <div class="important-box">
                <h4>Carácter altruista</h4>
                <p>La donación de muestras para investigación es completamente voluntaria y altruista. Su único beneficio es contribuir al avance de la medicina en beneficio de la sociedad.</p>
            </div>

            <div class="important-box">
                <h4>Uso comercial</h4>
                <p>Sus muestras no serán objeto directo de actividades comerciales. Sin embargo, la información generada a partir de los estudios podría eventualmente generar beneficios comerciales que reviertan en la salud de la población general, aunque no de forma individual para usted o sus familiares.</p>
            </div>

            <div class="important-box">
                <h4>Divulgación científica</h4>
                <p>Los resultados de futuros estudios podrán ser comunicados en reuniones científicas, congresos médicos o publicaciones científicas, manteniendo siempre estricta confidencialidad sobre la identidad de todos los participantes y evitando la publicación de datos de carácter personal que pudieran conducir a la identificación.</p>
            </div>

            <div class="important-box">
                <h4>Sin costos adicionales</h4>
                <p>La donación de sus muestras no le supondrá ningún gasto económico.</p>
            </div>

            <div class="important-box">
                <h4>Usos no autorizados</h4>
                <p>La utilización de sus muestras biológicas para cualquier finalidad distinta a la expresada requerirá su autorización expresa mediante un nuevo documento de consentimiento.</p>
            </div>
        `
    },

    // Sección 11
    section11: {
        id: 'section11',
        title: '¿Cómo puedo retirarme del estudio?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿CÓMO PUEDO RETIRARME DEL ESTUDIO?</h2>

            <h3>Su derecho fundamental a retirarse</h3>
            <p><strong>Puede revocar su consentimiento en cualquier momento, por cualquier motivo, sin necesidad de dar explicaciones y sin que esto le perjudique de ninguna manera.</strong></p>

            <h3>¿Cómo puede revocar su consentimiento?</h3>
            <p>Existen varias formas de comunicar su decisión de retirarse del estudio. Puede hacerlo mediante:</p>
            <ul>
                <li><strong>Contacto directo con la Dra. Izaro Kortazar,</strong> coordinadora del estudio, llamando al teléfono <strong>945.00.70.00</strong> o enviando un email a <strong>izaro.kortazarzubizarreta@osakidetza.eus</strong></li>
                <li><strong>Carta postal</strong> expresando su decisión de retirarse dirigida al Hospital Universitario Araba, Servicio de Neurología</li>
                <li><strong>En persona</strong> durante cualquier visita al centro o a través de cualquier miembro del equipo investigador</li>
            </ul>

            <h3>Opciones de revocación</h3>
            <p>Puede elegir entre dos modalidades de revocación:</p>

            <div class="option-box">
                <h4>Revocación total</h4>
                <p>Implica que:</p>
                <ul>
                    <li>Se detiene toda recolección futura de datos y muestras</li>
                    <li>No se le contactará más para el estudio</li>
                    <li>Se retira de todas las bases de datos del estudio</li>
                </ul>
            </div>

            <div class="option-box">
                <h4>Revocación parcial</h4>
                <p>Puede retirar consentimiento solo para aspectos específicos:</p>
                <ul>
                    <li>Únicamente las muestras biológicas (manteniendo el seguimiento clínico)</li>
                    <li>Solo las colaboraciones internacionales (manteniendo el estudio nacional)</li>
                    <li>Solo la observación familiar (manteniendo su participación individual)</li>
                    <li>Solo los análisis genómicos amplios (manteniendo los análisis básicos)</li>
                    <li>Solo los ensayos clínicos futuros (manteniendo la participación en la investigación actual)</li>
                </ul>
            </div>

            <h3>¿Qué ocurre con sus muestras y datos ya recolectados?</h3>

            <h4>Respecto a las muestras ya obtenidas:</h4>
            <p>Puede elegir entre:</p>
            <ul>
                <li>Destruir todas las muestras previamente recolectadas</li>
                <li>Mantener las muestras para análisis ya en curso, pero sin recolectar nuevas muestras</li>
                <li>Anonimizar las muestras eliminando completamente la posibilidad de identificarle</li>
            </ul>

            <h4>En cuanto a los datos clínicos ya recolectados:</h4>
            <ul>
                <li>Los datos agregados y analizados de forma grupal pueden mantenerse para beneficio de la ciencia</li>
                <li>Los datos identificables se eliminarán de las bases de datos del estudio</li>
                <li>Los datos ya publicados en estudios científicos no pueden eliminarse, aunque están completamente anonimizados</li>
            </ul>

            <h3>¿Qué NO se ve afectado por la retirada?</h3>
            <p>Su retirada del estudio no afectará:</p>
            <ul>
                <li>Su atención médica habitual que continuará igual que antes</li>
                <li>Su relación con el equipo médico o su acceso a cuidados</li>
                <li>Las evaluaciones médicas realizadas previamente (conservará todas)</li>
                <li>El acceso al asesoramiento genético si lo desea</li>
                <li>El acceso al apoyo de la FEEP (Fundación Española de Enfermedades Priónicas)</li>
            </ul>

            <h3>Proceso tras la revocación</h3>
            <p>Una vez que comunique su decisión:</p>

            <h4>En las primeras 24-48 horas:</h4>
            <ul>
                <li>Recibirá confirmación por escrito de la recepción de su solicitud</li>
                <li>Se bloqueará inmediatamente su identificador en las bases de datos</li>
                <li>Se coordinará la acción con todos los centros participantes</li>
            </ul>

            <h4>En el plazo de 1-2 semanas:</h4>
            <ul>
                <li>Se procederá a la destrucción o anonimización según sus preferencias</li>
                <li>Se notificará a los colaboradores internacionales si procede</li>
                <li>Recibirá un informe final de todas las acciones completadas</li>
            </ul>
        `
    },

    // Sección 12
    section12: {
        id: 'section12',
        title: '¿Qué garantías legales y éticas tiene el estudio?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿QUÉ GARANTÍAS LEGALES Y ÉTICAS TIENE EL ESTUDIO?</h2>

            <h3>Aprobaciones obtenidas</h3>
            <p>Este estudio cuenta con todas las aprobaciones éticas y regulatorias necesarias, incluyendo:</p>
            <ul>
                <li>Aprobación del Comité Ético de Investigación con medicamentos de Euskadi (CEIm-E)</li>
                <li>Aprobación de las autoridades regulatorias locales correspondientes</li>
                <li>Aprobación de los comités éticos de todos los centros participantes en la investigación</li>
            </ul>

            <h3>Normativa cumplida</h3>
            <p>El estudio cumple rigurosamente con toda la normativa vigente aplicable, incluyendo:</p>
            <ul>
                <li><strong>Reglamento GDPR Europeo 2016/679</strong> para la protección de datos personales</li>
                <li><strong>Ley Orgánica 3/2018</strong> de protección de datos y garantía de los derechos digitales</li>
                <li><strong>Ley 14/2007</strong> de investigación biomédica</li>
                <li><strong>Ley 41/2002</strong> básica reguladora de la autonomía del paciente y de derechos y obligaciones en materia de información y documentación clínica</li>
                <li><strong>Real Decreto 1716/2011</strong> que establece los requisitos básicos de autorización y funcionamiento de los biobancos</li>
            </ul>

            <h3>Sus derechos fundamentales están garantizados</h3>
            <p>Como participante en este estudio, usted tiene garantizada:</p>
            <ul>
                <li><strong>Participación completamente voluntaria</strong> sin obligación alguna</li>
                <li><strong>Derecho a retirada libre</strong> en cualquier momento y sin necesidad de dar explicaciones</li>
                <li><strong>Continuidad de su atención médica</strong> que no se verá afectada por su decisión de participar o no participar</li>
                <li><strong>Derecho a información completa</strong> sobre todos los aspectos del estudio</li>
                <li><strong>Acceso a apoyo especializado</strong> incluyendo consejo genético cuando lo necesite</li>
            </ul>
        `
    },

    // Sección 13
    section13: {
        id: 'section13',
        title: '¿Hay algún costo o compensación?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿HAY ALGÚN COSTO O COMPENSACIÓN?</h2>

            <h3>Información importante sobre compensación económica</h3>
            <div class="warning-box">
                <p><strong>No hay contraprestación económica de ningún tipo.</strong> Este es un estudio de investigación científica sin ánimo de lucro y su participación es completamente altruista, por lo que no recibirá ningún pago por participar.</p>
            </div>

            <h3>Sin costos para usted</h3>
            <p>Su participación no le supondrá ningún gasto económico, ya que:</p>
            <ul>
                <li>Todos los análisis y procedimientos son completamente gratuitos</li>
                <li>En caso de que tenga dificultades para desplazarse, se estudiará la posibilidad de proporcionarle apoyo para el transporte según las circunstancias específicas</li>
                <li>Dependiendo de cada situación particular y de las normativas de cada centro participante, se podrá evaluar una posible compensación por gastos de desplazamiento como transporte y comida</li>
                <li>Recibirá copias de todos los informes médicos y resultados relevantes sin ningún costo adicional</li>
            </ul>

            <h3>Lo que cubre el estudio</h3>
            <p>El estudio se hace cargo de todos los gastos relacionados con su participación, incluyendo:</p>
            <ul>
                <li>Todas las pruebas y análisis de laboratorio que se realicen</li>
                <li>Las evaluaciones médicas especializadas</li>
                <li>El procesamiento y almacenamiento de sus muestras biológicas</li>
                <li>El acceso a asesoramiento genético y apoyo psicológico cuando lo necesite</li>
                <li>Todo el seguimiento médico especializado durante la duración completa del estudio</li>
            </ul>
        `
    },

    // Sección 14
    section14: {
        id: 'section14',
        title: '¿Con quién puedo contactar si tengo dudas?',
        showInIndex: true,
        content: `
            <h2 style="text-align: center;">¿CON QUIÉN PUEDO CONTACTAR SI TENGO DUDAS?</h2>

            <div class="contact-box">
                <h3>📧 <a href="mailto:izaro.kortazarzubizarreta@osakidetza.eus">Dra. Izaro Kortazar</a></h3>
                <ul>
                    <li><strong>Hospital:</strong> Hospital Universitario Araba</li>
                    <li><strong>📞 Teléfono:</strong> 945.00.70.00</li>
                </ul>
            </div>

            <div class="contact-box">
                <h3>🔬 Equipos locales especializados</h3>
                <ul>
                    <li><strong>CIC bioGUNE:</strong> <a href="mailto:jcastilla@cicbiogune.es">Dr. Joaquín Castilla</a> (Investigación)</li>
                    <li><strong>Cruces:</strong> <a href="mailto:guiomar.perezdenanclaresleal@osakidetza.eus">Dra. Guiomar Pérez de Nanclares</a> (Genética)</li>
                </ul>
            </div>

            <div class="contact-box">
                <h3><a href="http://www.fundacionprionicas.org" target="_blank">🤝 FEEP - Fundación Española de Enfermedades Priónicas</a></h3>
            </div>

            <div class="contact-box">
                <h3><a href="http://www.osakidetza.euskadi.eus/protecciondatos" target="_blank">🔒 Para cuestiones sobre protección de datos (Osakidetza)</a></h3>
            </div>

            <div class="final-message">
                <h3>Gracias por su tiempo y consideración</h3>
                <p>Le agradecemos sinceramente que haya dedicado tiempo a leer esta información. Su participación en este estudio representa una contribución invaluable no solo para la ciencia, sino también para todas las familias que en el futuro puedan beneficiarse de los avances que logremos juntos.</p>

                <p><strong>Si decide participar, estaremos encantados de acompañarle en este viaje científico. Si decide no participar, respetamos completamente su decisión y le agradecemos igualmente su consideración.</strong></p>
            </div>
        `
    }
};

// Crear array ordenado para navegación
const INFORMATION_SECTIONS = [
    'intro',
    'section1',
    'section2',
    'section3',
    'section4',
    'section5',
    'section6',
    'section7',
    'section8',
    'section9',
    'section10',
    'section11',
    'section12',
    'section13',
    'section14'
];
