'use client';
import UploadPanel from '@/components/dashboard/UploadPanel';
import { UPLOAD_ENDPOINTS } from '@/lib/constants';

export default function UploadPage() {
    return (
        <UploadPanel
            title="Cargar indicadores eléctricos"
            description="Sube un archivo .xlsx con los datos del bloque seleccionado."
            blockSelector
            resolveEndpoint={block =>
                block === 'A' ? UPLOAD_ENDPOINTS.blq_a : UPLOAD_ENDPOINTS.blq_f
            }
        />
    );
}
