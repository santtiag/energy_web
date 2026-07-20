export const API_URL = 'http://localhost:5000/api';
export const RESOLUTIONS = ['minute', '10min', 'hour'];
export const INDICATORS = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
export const BLOCKS = ['blq_a', 'blq_f'];
export const VALUES = ['value_1', 'value_2', 'value_3'];
export const VALUE_LABELS: { [key: string]: string } = {
    value_1: 'Phase 1',
    value_2: 'Phase 2',
    value_3: 'Phase 3'
};
export const INDICATOR_UNITS: { [key: string]: string } = {
    voltage: 'V',
    current: 'A',
    active_power: 'W',
    reactive_power: 'VAr',
    power_factor: ''
};
export const DEFAULT_DATE_RANGE = {
    start: '2025-08-16',
    end: '2025-08-17'
};

export const RESOLUTION_LABELS: { [key: string]: string } = {
    minute: 'Minutal',
    '10min': '10 Minutos',
    hour: 'Horaria'
};

export const SMOOTHER_ALGORITHMS = [
    { value: 'kalman', label: 'Kalman' },
    { value: 'savitzky_golay', label: 'Savitzky-Golay' },
    { value: 'whittaker', label: 'Whittaker' }
];

export const DEFAULT_KALMAN_PARAMS = {
    initial_error: 1,
    measurement_variance: 10,
    process_variance: 0.1,
    transition_matrix: 1,
    observation_matrix: 1
};

export const DEFAULT_SAV_PARAMS = {
    window_length: 21,
    polyorder: 2
};

export const DEFAULT_WHIT_PARAMS = {
    lmbd: 100,
    d: 2
};

export const UPLOAD_ENDPOINTS = {
    blq_a: `${API_URL}/upload_blq_a`,
    blq_f: `${API_URL}/upload_blq_f`,
    variables: `${API_URL}/upload_variables`
};

export const CLIMATE_VARIABLES = [
  { value: 'temperature', label: 'Temperature (°C)' },
  { value: 'relative_humidity', label: 'Relative Humidity (%)' },
  { value: 'precipitation', label: 'Precipitation (mm)' },
];
