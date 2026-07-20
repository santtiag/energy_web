'use client';
import UploadPanel from '@/components/dashboard/UploadPanel';
import { UPLOAD_ENDPOINTS } from '@/lib/constants';

export default function UploadVariablesPage() {
    return (
        <UploadPanel
            title="Cargar variables climáticas"
            description="Sube un archivo .xlsx con las variables climáticas."
            resolveEndpoint={() => UPLOAD_ENDPOINTS.variables}
        />
    );
}
