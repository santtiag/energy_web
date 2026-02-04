'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Database, Brain, Eye, Zap, TrendingUp, Shield, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function HomePage() {
  const consumptionData = [
    { time: '00:00', consumption: 45, prediction: 43 },
    { time: '04:00', consumption: 38, prediction: 40 },
    { time: '08:00', consumption: 65, prediction: 62 },
    { time: '12:00', consumption: 78, prediction: 76 },
    { time: '16:00', consumption: 82, prediction: 80 },
    { time: '20:00', consumption: 71, prediction: 69 },
    { time: '24:00', consumption: 52, prediction: 50 }
  ];

  const efficiencyData = [
    { name: 'Bloque A', value: 65, fill: '#3b82f6' },
    { name: 'Bloque F', value: 78, fill: '#60a5fa' }
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <motion.section
        className={styles.heroSection}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className={styles.heroTitle}
          variants={fadeInUp}
        >
          Sistema Integrado de Monitoreo y Análisis Predictivo
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          variants={fadeInUp}
        >
          Desarrollo de un sistema avanzado para la gestión energética eficiente en bloques universitarios
          mediante técnicas de IoT, suavizado de datos e inteligencia artificial
        </motion.p>

        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/dashboard" className={styles.dashboardButton}>
            <Activity size={24} />
            Acceder al Dashboard de Monitoreo
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </motion.section>

      {/* Problem Statement */}
      <section className={styles.contentSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Planteamiento del Problema
        </motion.h2>

        <motion.div
          className={styles.infoGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className={styles.infoCard} variants={fadeInUp}>
            <div className={styles.cardTitle}>
              <Database className="inline mr-2" size={24} />
              Situación Actual
            </div>
            <p className={styles.cardContent}>
              La Corporación Universitaria del Caribe cuenta con infraestructura IoT desde junio de 2024
              que monitorea parámetros eléctricos en los bloques A y F. Sin embargo, la heterogeneidad
              temporal y espacial de las series genera incertidumbres que desvirtúan el modelamiento energético.
            </p>
          </motion.div>

          <motion.div className={styles.infoCard} variants={fadeInUp}>
            <div className={styles.cardTitle}>
              <Zap className="inline mr-2" size={24} />
              Problemas Detectados
            </div>
            <ul className={styles.objectivesList}>
              <li>Ruido gaussiano en mediciones</li>
              <li>Desfases de reloj entre sensores</li>
              <li>Fallos en paquetes de comunicación</li>
              <li>Pérdida de completitud funcional de datos</li>
            </ul>
          </motion.div>

          <motion.div className={styles.infoCard} variants={fadeInUp}>
            <div className={styles.cardTitle}>
              <Brain className="inline mr-2" size={24} />
              Solución Propuesta
            </div>
            <p className={styles.cardContent}>
              Implementar un ecosistema analítico que integre funcionalidades de monitoreo y predicción
              mediante algoritmos avanzados de suavizado y modelos de IA para anticipar escenarios de consumo.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Objectives */}
      <section className={styles.contentSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Objetivos del Proyecto
        </motion.h2>

        <motion.div
          className={styles.infoCard}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={styles.cardTitle}>
            <TrendingUp className="inline mr-2" size={24} />
            Objetivo General
          </div>
          <p className={styles.cardContent} style={{ fontSize: '1.1rem' }}>
            Desarrollar un sistema integrado de monitoreo y análisis predictivo de parámetros eléctricos
            en bloques universitarios mediante técnicas de suavizado de datos e inteligencia artificial
            que permita gestionar eficientemente el consumo energético de los bloques A y F de la
            Corporación Universitaria del Caribe.
          </p>
        </motion.div>

        <motion.div
          className={styles.infoCard}
          style={{ marginTop: '2rem' }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={styles.cardTitle}>
            <Shield className="inline mr-2" size={24} />
            Objetivos Específicos
          </div>
          <ul className={styles.objectivesList}>
            <li>Desarrollar algoritmos especializados de imputación multivariante y suavizado adaptativo
              (Kalman-Golay, Whittaker, Savitzky-Golay) que recuperen muestras faltantes y reduzcan el ruido
              conservando componentes críticos de la señal.</li>
            <li>Integrar modelos predictivos basados en Redes Neuronales Recurrentes (RNN) que, alimentados
              por variables históricas y contextuales (climáticas, vacaciones, horarios), pronostiquen la
              demanda con horizontes de hasta 7 días con MAE inferior al 3%.</li>
            <li>Construir y desplegar un middleware con interfaz web interactiva que facilite la visualización
              dinámica de los datos eléctricos y la configuración de parámetros predictivos.</li>
          </ul>
        </motion.div>
      </section>

      {/* Charts Section */}
      <section className={styles.chartSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <BarChart3 className="inline mr-2" size={28} />
          Visualización de Datos
        </motion.h2>

        <motion.div
          className={styles.infoGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={styles.chartContainer}>
            <h3 style={{ color: '#93c5fd', marginBottom: '1rem' }}>Consumo vs Predicción (24h)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionData}>
                <defs>
                  <linearGradient id="consumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="prediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#consumption)"
                />
                <Area
                  type="monotone"
                  dataKey="prediction"
                  stroke="#60a5fa"
                  fillOpacity={1}
                  fill="url(#prediction)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h3 style={{ color: '#93c5fd', marginBottom: '1rem' }}>Eficiencia por Bloque</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* Methodology Timeline */}
      <section className={styles.timelineSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Clock className="inline mr-2" size={28} />
          Metodología del Proyecto
        </motion.h2>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine} />

          <motion.div
            className={styles.timelineItem}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelinePhase}>Fase 1: Preparación y Preprocesamiento</div>
              <p>
                Adquisición y diagnóstico de calidad de datos, corrección y limpieza,
                imputación multivariante, y suavizado adaptativo con optimización de hiperparámetros
                (Kalman-Golay, Whittaker, Savitzky-Golay).
              </p>
            </div>
            <motion.div
              className={styles.timelineDot}
              animate={pulseAnimation}
            />
          </motion.div>

          <motion.div
            className={styles.timelineItem}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelinePhase}>Fase 2: Modelado Predictivo</div>
              <p>
                Implementación de modelos basados en Redes Neuronales Recurrentes (RNN)
                para capturar dependencias temporales complejas y realizar predicciones
                con horizontes de hasta 7 días.
              </p>
            </div>
            <motion.div
              className={styles.timelineDot}
              animate={pulseAnimation}
            />
          </motion.div>

          <motion.div
            className={styles.timelineItem}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelinePhase}>Fase 3: Interfaz de Visualización</div>
              <p>
                Desarrollo de interfaz gráfica web interactiva para visualización de datos,
                predicciones y configuración de parámetros operativos del sistema.
              </p>
            </div>
            <motion.div
              className={styles.timelineDot}
              animate={pulseAnimation}
            />
          </motion.div>
        </div>
      </section>

      {/* References */}
      <section className={styles.referencesSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Referencias Bibliográficas
        </motion.h2>

        <motion.div
          className={styles.referencesList}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            "Atzori, L., Iera, A., & Morabito, G. (2010). The internet of things: A survey. Computer networks, 54(15), 2787-2805.",
            "Li, X., Bowers, C. P., & Schnier, T. (2019). Classification of energy consumption in buildings with outlier detection. IEEE Transactions on Industrial Electronics, 66(2), 1393-1402.",
            "Wang, Y., Chen, Q., Hong, T., & Kang, C. (2018). Review of smart meter data analytics: Applications, challenges, and solutions. Applied Energy, 238, 1291-1305.",
            "Cleveland, R. B., Cleveland, W. S., McRae, J. E., & Terpenning, I. (1990). STL: A seasonal-trend decomposition procedure based on loess. Journal of Official Statistics, 6(1), 3-73.",
            "Hyndman, R. J., & Athanasopoulos, G. (2018). Forecasting: principles and practice. OTexts.",
            "Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural computation, 9(8), 1735-1780.",
            "Kong, W., Dong, Z. Y., Jia, Y., Hill, D. J., Xu, Y., & Zhang, Y. (2019). Short-term residential load forecasting based on LSTM recurrent neural network. IEEE Transactions on Smart Grid, 10(1), 841-851.",
            "Ahmad, T., Chen, H., Wang, J., & Guo, Y. (2021). A comprehensive overview on the data driven approaches for smart building energy management. Energy Conversion and Management, 240, 114299."
          ].map((reference, index) => (
            <motion.div
              key={index}
              className={styles.referenceItem}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {reference}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Author Information */}
      <motion.section
        className={styles.authorInfo}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            top: '-75px',
            right: '-75px',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '2px solid rgba(96, 165, 250, 0.3)',
            bottom: '-50px',
            left: '-50px',
            pointerEvents: 'none'
          }}
        />

        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#60a5fa' }}>
          Proyecto de Grado
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          <strong>Santiago José Romero Solana</strong>
        </p>
        <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
          Ingeniería de Sistemas - Corporación Universitaria del Caribe - CECAR
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
          <div>
            <p style={{ color: '#93c5fd', fontWeight: '600' }}>Director</p>
            <p>Mg. Carlos Segundo Cohen Manrique</p>
          </div>
          <div>
            <p style={{ color: '#93c5fd', fontWeight: '600' }}>Codirectora</p>
            <p>Mg. Guillermo Hernández Hernández</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
