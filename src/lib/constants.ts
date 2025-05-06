// src/lib/constants.ts
export const API_URL = 'http://localhost:5000/api';
export const RESOLUTIONS = ['minute', 'hour'];
export const INDICATORS = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
export const BLOCKS = ['blq_a', 'blq_f'];
export const VALUES = ['value_1', 'value_2', 'value_3'];
export const INDICATOR_UNITS: { [key: string]: string } = {
    voltage: 'V',
    current: 'A',
    active_power: 'W',
    reactive_power: 'VAr',
    power_factor: ''
};
export const DEFAULT_DATE_RANGE = {
    start: '2025-04-01',
    end: '2025-04-01'
};
