import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    BookOpen,
    CloudSun,
    FileUp,
    Scale,
    TrendingUp,
    Upload,
    Waves,
} from 'lucide-react';

export interface NavPage {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
    keywords: string[];
}

export interface NavSection {
    index: string;
    title: string;
    slug: string;
    description: string;
    pages: NavPage[];
}

export const NAV_SECTIONS: NavSection[] = [
    {
        index: '01',
        title: 'Data',
        slug: 'data',
        description: 'Series temporales de indicadores eléctricos y variables climáticas.',
        pages: [
            {
                title: 'Indicadores',
                href: '/dashboard/data/indicators_visualization',
                description: 'Voltaje, corriente y potencia por fase y resolución.',
                icon: Activity,
                keywords: ['indicadores', 'indicators', 'voltage', 'voltaje', 'corriente', 'potencia', 'fase'],
            },
            {
                title: 'Variables climáticas',
                href: '/dashboard/data/climate_variables_visualization',
                description: 'Temperatura, humedad relativa y precipitación.',
                icon: CloudSun,
                keywords: ['clima', 'climate', 'temperatura', 'humedad', 'precipitacion', 'weather'],
            },
            {
                title: 'Comparación',
                href: '/dashboard/data/comparison',
                description: 'Operaciones estadísticas entre bloques e indicadores.',
                icon: Scale,
                keywords: ['comparacion', 'comparison', 'operaciones', 'max', 'min', 'promedio', 'bloques'],
            },
        ],
    },
    {
        index: '02',
        title: 'Analysis',
        slug: 'analysis',
        description: 'Suavizado de señales, evaluación de algoritmos y predicción.',
        pages: [
            {
                title: 'Suavizadores',
                href: '/dashboard/analysis/smoothers',
                description: 'Kalman, Savitzky-Golay y Whittaker sobre la señal original.',
                icon: Waves,
                keywords: ['suavizado', 'smoothers', 'kalman', 'savitzky', 'golay', 'whittaker', 'filtro'],
            },
            {
                title: 'Evaluación',
                href: '/dashboard/analysis/evaluation',
                description: 'Métricas de error para comparar algoritmos de suavizado.',
                icon: Scale,
                keywords: ['evaluacion', 'evaluation', 'metricas', 'mse', 'rmse', 'error'],
            },
            {
                title: 'Predicciones',
                href: '/dashboard/analysis/predictions',
                description: 'Modelos de predicción de demanda energética.',
                icon: TrendingUp,
                keywords: ['predicciones', 'predictions', 'forecast', 'modelos'],
            },
            {
                title: 'Acerca de',
                href: '/dashboard/analysis/about',
                description: 'Documentación de los algoritmos de suavizado.',
                icon: BookOpen,
                keywords: ['acerca', 'about', 'documentacion', 'ayuda', 'docs'],
            },
        ],
    },
    {
        index: '03',
        title: 'Manipulation',
        slug: 'manipulation',
        description: 'Carga de archivos de datos eléctricos y climáticos.',
        pages: [
            {
                title: 'Cargar indicadores',
                href: '/dashboard/manipulation/upload',
                description: 'Subir archivos de datos eléctricos por bloque.',
                icon: Upload,
                keywords: ['cargar', 'upload', 'subir', 'archivo', 'csv', 'bloque'],
            },
            {
                title: 'Cargar variables',
                href: '/dashboard/manipulation/upload_variables',
                description: 'Subir archivos de variables climáticas.',
                icon: FileUp,
                keywords: ['cargar', 'upload', 'variables', 'clima', 'archivo'],
            },
        ],
    },
];

export const ALL_PAGES = NAV_SECTIONS.flatMap(section =>
    section.pages.map(page => ({ ...page, section }))
);

export function findBreadcrumb(pathname: string): {
    section?: NavSection;
    page?: NavPage;
} {
    for (const section of NAV_SECTIONS) {
        if (!pathname.startsWith(`/dashboard/${section.slug}`)) continue;
        const page = section.pages.find(p => pathname.startsWith(p.href));
        return { section, page };
    }
    return {};
}
