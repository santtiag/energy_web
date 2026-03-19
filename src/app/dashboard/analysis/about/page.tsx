import React from 'react';
import styles from './About.module.css';

export default function AboutPage() {
    return (
        <div className={styles.aboutContainer}>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Verificación General del Código</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <strong>Kalman Filter:</strong> Estás usando un filtro recursivo hacia adelante (predict -&gt; update). Nota importante: Técnicamente esto es un &quot;Filtro&quot;, no un &quot;Suavizador&quot; (Smoother) de Kalman. Un suavizador de Kalman típico (como el RTS) pasa hacia adelante y luego hacia atrás para usar datos futuros y corregir el pasado. Tu implementación actual tendrá lag (retraso) respecto a los datos originales, ya que solo usa información pasada para predecir el presente.
                    </li>
                    <li className={styles.listItem}>
                        <strong>Savitzky-Golay:</strong> El parámetro window_length=21 es peligroso si la consulta devuelve menos de 21 datos. scipy.signal.savgol_filter lanzará un error si la ventana es mayor que el tamaño de los datos. Se recomienda validar esto dinámicamente.
                    </li>
                    <li className={styles.listItem}>
                        <strong>Whittaker:</strong> La implementación es sólida y eficiente (usa matrices dispersas). Es el mejor método para suavizado &quot;offline&quot; (cuando tienes todos los datos de antemano), ya que no introduce retraso (lag).
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Análisis Detallado: Kalman Filter</h2>

                <h3 className={styles.subsectionTitle}>Explicación Técnica:</h3>
                <p className={styles.text}>
                    Es un estimador recursivo que utiliza una serie de medidas observadas a lo largo del tiempo (que contienen ruido) para producir estimaciones de variables desconocidas. En tu código, asumes un modelo de &quot;movimiento constante&quot; (la tiende a seguir recta) con incertidumbre. Combina la predicción del modelo y la medición real basándose en la covarianza del error.
                </p>

                <h3 className={styles.subsectionTitle}>Analogía:</h3>
                <p className={styles.text}>
                    Imagina que estás conduciendo un coche a ciegas en una carretera recta.
                </p>
                <ul className={styles.nestedList}>
                    <li><strong>Modelo (Process):</strong> Tú crees que si vas a 50 km/h, en el siguiente segundo seguirás a 50 km/h.</li>
                    <li><strong>Medición (Measurement):</strong> Tu GPS (que tiene error) dice que vas a 52 km/h.</li>
                    <li><strong>El Filtro de Kalman:</strong> Es un conductor inteligente que decide confiar un 80% en su sensación física del velocidadímetro (modelo) y un 20% en el GPS (medición) para estimar tu velocidad real. Si el GPS es muy ruidoso (varianza alta), el filtro lo ignora más.</li>
                </ul>

                <h3 className={styles.subsectionTitle}>Hiperparámetros:</h3>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>measurement_variance (R):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> (0,∞)</p>
                    <p className={styles.paramText}><strong>Función:</strong> Qué tan ruidoso es tu sensor (los datos que traes de la base de datos).</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>Alto (Ej. 1000):</strong> El filtro piensa que los datos son basura. Se mantendrá muy firme en su predicción anterior. La curva será muy plana y suave, pero no responderá a los cambios reales.</li>
                        <li><strong>Bajo (Ej. 0.1):</strong> El filtro confía ciegamente en los datos. Copiará casi exactamente la forma de la señal original (incluyendo el ruido).</li>
                    </ul>
                    <p className={styles.paramNote}><strong>En tu código:</strong> Default 10. Si tus datos (values) están en un rango de 0 a 100, esto es moderado. Si tus datos son de 0 a 1, esto es muchísimo ruido y el filtro casi no se moverá.</p>
                </div>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>process_variance (Q):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> (0,∞)</p>
                    <p className={styles.paramText}><strong>Función:</strong> Qué tanto esperas que el sistema cambie de forma natural (su &quot;inquietud&quot;).</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>Alto:</strong> El filtro espera que la señal cambie drásticamente en cualquier momento. Reacciona muy rápido a los cambios (bajo lag), pero puede interpretar el ruido como un cambio real.</li>
                        <li><strong>Bajo (Tu default 0.01):</strong> El filtro asume que el sistema es muy estable. Se volverá lento (&quot;perezoso&quot;) para adaptarse a tendencias alcistas o bajistas.</li>
                    </ul>
                    <p className={styles.paramNote}><strong>Ajuste:</strong> Para suavizar, se busca un equilibrio donde Q sea menor que R, pero no tan pequeño que el filtro se &quot;congele&quot;.</p>
                </div>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>initial_error (P):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> (0,∞)</p>
                    <p className={styles.paramText}><strong>Función:</strong> Incertidumbre inicial del estado.</p>
                    <p className={styles.paramText}><strong>Efecto:</strong> Muy alto al principio hace que el primer dato se tome como verdad absoluta. Con el paso de las iteraciones, este valor converge y deja de importar. Generalmente se deja en 1.0 o un valor alto.</p>
                </div>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>transition_matrix (F):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> Cualquier flotante (usualmente 1.0).</p>
                    <p className={styles.paramText}><strong>Función:</strong> Define cómo evoluciona el estado. 1.0 significa &quot;creo que el valor futuro será igual al valor actual&quot; (Random Walk).</p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Análisis Detallado: Savitzky-Golay</h2>

                <h3 className={styles.subsectionTitle}>Explicación Técnica:</h3>
                <p className={styles.text}>
                    Es un filtro de convolución digital que ajusta un polinomio de grado bajo (por ejemplo, cuadrático) a una ventana de datos mediante mínimos cuadrados. A diferencia de una media móvil que &quot;aplasta&quot; los picos, SG preserva las características de alto de la señal (como la altura y anchura de los picos) mucho mejor.
                </p>

                <h3 className={styles.subsectionTitle}>Analogía:</h3>
                <p className={styles.text}>
                    Imagina que tienes una cadena de puntos en una mesa.
                </p>
                <ul className={styles.nestedList}>
                    <li>Toma una regla flexible (un polinomio) y colócala sobre un grupo de puntos consecutivos (la ventana).</li>
                    <li>Ajusta la regla para que se adapte lo mejor posible a esos puntos.</li>
                    <li>Anota el valor del centro de la regla.</li>
                    <li>Desliza la regla un punto a la derecha y repite.</li>
                    <li>Es como dibujar una curva suave a lápiz a través de los puntos en lugar de cortar las esquinas.</li>
                </ul>

                <h3 className={styles.subsectionTitle}>Hiperparámetros:</h3>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>window_length (Ventana):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> Entero impar positivo. polyorder &lt; window_length.</p>
                    <p className={styles.paramText}><strong>Función:</strong> Cuántos puntos vecinos considerar para suavizar un punto central.</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>Grande:</strong> Más suave, elimina más ruido, pero pierde detalle en picos estrechos y puede desplazar la fase si no se tiene cuidado (aunque SG reduce esto comparado con otros filtros).</li>
                        <li><strong>Pequeño:</strong> Menos suave, se ajusta más a las fluctuaciones locales.</li>
                    </ul>
                    <p className={styles.paramNote}><strong>En tu código:</strong> Default 21. Si tu resolución es muy alta (muchos puntos cercanos), esto está bien. Si tienes pocos puntos, esto es demasiado grande.</p>
                </div>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>polyorder (Orden del polinomio):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> Entero ≥0 y menor que window_length.</p>
                    <p className={styles.paramText}><strong>Función:</strong> Qué tan compleja es la curva que se ajusta (0 = línea plana/media, 1 = línea recta, 2 = parábola/curva, 3 = curva con inflexión).</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>Bajo (0 o 1):</strong> Es una media móvil básica. Los picos se vuelven mesetas.</li>
                        <li><strong>Medio (2 o 3 - Tu default 2):</strong> Es el estándar. Mantiene los picos redondeados y suaviza el ruido a su alrededor. Preserva mejor las áreas bajo la curva (momento de la señal).</li>
                    </ul>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Análisis Detallado: Whittaker (Eilers)</h2>

                <h3 className={styles.subsectionTitle}>Explicación Técnica:</h3>
                <p className={styles.text}>
                    Este método se basa en la penalización de la rugosidad de la curva suavizada z. Busca minimizar la diferencia entre los datos originales y y la suavizada z, pero penalizando la &quot;energía&quot; de la segunda derivada de z (lo curva que es). Matemáticamente resuelve una ecuación matricial dispersa muy eficiente. Es excelente para datos cronológicos.
                </p>

                <h3 className={styles.subsectionTitle}>Analogía:</h3>
                <p className={styles.text}>
                    Imagina una elástica o una cuerda fina de goma.
                </p>
                <ul className={styles.nestedList}>
                    <li>Pasas la cuerda a través de los puntos de tus datos.</li>
                    <li>lmbd (Lambda) es la tensión de la cuerda.</li>
                    <li>Si la tensión es baja (lambda bajo), la cuerda se ajusta pegando a cada punto (siguiendo todo el ruido).</li>
                    <li>Si la tensión es alta (lambda alto), la cuerda se tensa y se estira, ignorando los puntos que sobresalen y creando una curva suave y lisa entre los extremos.</li>
                </ul>

                <h3 className={styles.subsectionTitle}>Hiperparámetros:</h3>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>lmbd (Lambda):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> (0,∞) (A escala logarítmica).</p>
                    <p className={styles.paramText}><strong>Función:</strong> Parámetro de suavizado. Controla el equilibrio entre fidelidad a los datos y suavidad.</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>Bajo (Ej. 1 - 10):</strong> La curva sigue casi fielmente los datos originales.</li>
                        <li><strong>Alto (Tu default 100):</strong> La curva se alisa drásticamente. Valores muy altos (ej. 106) resultarán en una línea recta o una curva de tendencia muy simple.</li>
                    </ul>
                    <p className={styles.paramNote}><strong>Nota:</strong> Es el parámetro más crítico. A diferencia de Kalman, Whittaker suaviza toda la serie &quot;a la vez&quot;, por lo que no tiene lag (retraso); el pico ocurre exactamente donde debe ocurrir, solo que con forma más suave.</p>
                </div>

                <div className={styles.paramBlock}>
                    <h4 className={styles.paramTitle}>d (Orden de diferencia):</h4>
                    <p className={styles.paramRange}><strong>Rango:</strong> Entero positivo (1, 2, 3...).</p>
                    <p className={styles.paramText}><strong>Función:</strong> Qué propiedad geométrica se penaliza.</p>
                    <p className={styles.paramText}><strong>Efecto:</strong></p>
                    <ul className={styles.nestedList}>
                        <li><strong>d=1:</strong> Penaliza la pendiente total (fuerza a la curva a ser horizontal).</li>
                        <li><strong>d=2 (Tu default):</strong> Penaliza la aceleración/curvatura. Es la opción estándar para suavizado visualmente agradable.</li>
                        <li><strong>d=3:</strong> Penaliza cambios en la curvatura. Suele ser usado para datos muy específicos, rara vez para análisis general.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}