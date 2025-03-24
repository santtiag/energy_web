import { cookies } from 'next/headers';

// Para Server Components
export async function getAuthToken() {
    const cookieStore = await cookies(); // <-- Añadir await aquí
    return cookieStore.get('token')?.value;
}

// Para Server Actions y Middleware
export async function verifyAuth() {
    const token = await getAuthToken();
    return { isAuthenticated: !!token, token };
}
