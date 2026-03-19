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

export const CLIMATE_VARIABLES = [
  { value: 'temperature', label: 'Temperature (°C)' },
  { value: 'relative_humidity', label: 'Relative Humidity (%)' },
  { value: 'direct_radiation', label: 'Direct Radiation' },
  { value: 'precipitation', label: 'Precipitation (mm)' },
];
