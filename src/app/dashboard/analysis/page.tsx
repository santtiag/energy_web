"use client";

import { useState, useEffect, Fragment } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./AnalysisGenerations.module.css";

interface SmootherData {
  time: string;
  original_value1: number;
  original_value2: number;
  original_value3: number;
  smoothed_value1: number;
  smoothed_value2: number;
  smoothed_value3: number;
}

const AnalysisGenerations = () => {
  const [data, setData] = useState<SmootherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("kalman");
  const [selectedBlock, setSelectedBlock] = useState("blq_a");
  const [selectedIndicator, setSelectedIndicator] = useState("voltage");
  const [resolution, setResolution] = useState("minute");
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-01-02",
  });

  const [parameters, setParameters] = useState({
    kalman: {
      initial_error: 1,
      measurement_variance: 1,
      process_variance: 0.1,
      transition_matrix: 1,
      observation_matrix: 1,
    },
    savitzky_golay: { window_length: 11, polyorder: 2 },
    whittacker: { lmbd: 100, d: 2 },
  });

  const values = ["value1", "value2", "value3"];
  const colors = {
    original: ["#2563eb", "#16a34a", "#dc2626"],
    smoothed: ["#7c3aed", "#059669", "#991b1b"],
  };

  const fetchSmootherData = async () => {
    setLoading(true);
    try {
      const baseUrl = `https://964d-181-130-216-77.ngrok-free.app/api/analysis/${selectedAlgorithm}/`;
      const paramsObj = {
        start_date: dateRange.start,
        end_date: dateRange.end,
        resolution,
        indicator: selectedIndicator,
        table_name: selectedBlock,
        ...parameters[selectedAlgorithm as keyof typeof parameters],
      };

      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(paramsObj).map(([key, value]) => [key, String(value)])
        )
      ).toString();

      const response = await fetch(`${baseUrl}?${queryString}`, {
        headers: { "ngrok-skip-browser-warning": "69420" },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const rawData = await response.json();
      const formatted = rawData.map((item: any) => ({
        time: new Date(item.time).toLocaleTimeString(),
        // Valores originales
        original_value1: item.original.value_1,
        original_value2: item.original.value_2,
        original_value3: item.original.value_3,
        // Valores suavizados
        smoothed_value1: item.smoothed.value_1,
        smoothed_value2: item.smoothed.value_2,
        smoothed_value3: item.smoothed.value_3,
      }));

      setData(formatted);
      console.log("Datos formateados:", formatted);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmootherData();
  }, [
    selectedAlgorithm,
    selectedBlock,
    selectedIndicator,
    resolution,
    dateRange,
    parameters,
  ]);

  const renderParameterInputs = () => {
    const paramSet = parameters[selectedAlgorithm as keyof typeof parameters];
    return (
      <div className={styles.parameterGroup}>
        <h4>Parámetros {selectedAlgorithm.replace("_", " ")}</h4>
        <div className={styles.parameterGrid}>
          {Object.entries(paramSet).map(([key, value]) => (
            <div key={key} className={styles.parameterItem}>
              <label>{key.replace("_", " ")}</label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    [selectedAlgorithm]: {
                      ...prev[selectedAlgorithm as keyof typeof parameters],
                      [key]: parseFloat(e.target.value),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Controles generales */}
      <div className={styles.controlsContainer}>
        <div className={styles.mainControls}>
          {[
            {
              label: "Algoritmo",
              value: selectedAlgorithm,
              options: [
                { value: "kalman", label: "Filtro de Kalman" },
                { value: "savitzky_golay", label: "Savitzky-Golay" },
                { value: "whittacker", label: "Whittaker" },
              ],
              onChange: setSelectedAlgorithm,
            },
            {
              label: "Bloque",
              value: selectedBlock,
              options: ["blq_a", "blq_f"].map((b) => ({
                value: b,
                label: b.toUpperCase(),
              })),
              onChange: setSelectedBlock,
            },
            {
              label: "Indicador",
              value: selectedIndicator,
              options: [
                "voltage",
                "current",
                "active_power",
                "reactive_power",
                "power_factor",
              ].map((i) => ({
                value: i,
                label: i.replace("_", " "),
              })),
              onChange: setSelectedIndicator,
            },
            {
              label: "Resolución",
              value: resolution,
              options: [
                { value: "minute", label: "Minutal" },
                { value: "hour", label: "Horaria" },
              ],
              onChange: setResolution,
            },
          ].map(({ label, value, options, onChange }) => (
            <div key={label} className={styles.controlGroup}>
              <label>{label}</label>
              <select value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {/* Control para mostrar/ocultar originales */}
          <div className={styles.controlGroup}>
            <label>Mostrar originales</label>
            <input
              type="checkbox"
              checked={showOriginal}
              onChange={(e) => setShowOriginal(e.target.checked)}
            />
          </div>
        </div>

        {renderParameterInputs()}

        <div className={styles.dateControls}>
          {["start", "end"].map((field) => (
            <div key={field} className={styles.controlGroup}>
              <label>{field === "start" ? "Fecha Inicio" : "Fecha Fin"}</label>
              <input
                type="date"
                value={dateRange[field as "start" | "end"]}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gráfica */}
      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loading}>Cargando datos...</div>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                angle={-45}
                tick={{ fontSize: 12, dy: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              {values.map((val, idx) => (
                <Fragment key={val}>
                  <Line
                    type="monotone"
                    dataKey={`smoothed_${val}`}
                    stroke={colors.smoothed[idx]}
                    strokeWidth={2}
                    name={`Suavizado ${idx + 1}`}
                    dot={false}
                  />
                  {showOriginal && (
                    <Line
                      type="monotone"
                      dataKey={`original_${val}`}
                      stroke={colors.original[idx]}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name={`Original ${idx + 1}`}
                      dot={false}
                    />
                  )}
                </Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalysisGenerations;
