/**
 * Puntuación fuzzy simple: substring exacto > prefijo > subsecuencia.
 * Retorna null si no hay match.
 */
export function fuzzyScore(query: string, target: string): number | null {
    const q = query.toLowerCase().trim();
    const t = target.toLowerCase();
    if (!q) return 0;
    const idx = t.indexOf(q);
    if (idx === 0) return 100;
    if (idx > 0) return 80 - Math.min(idx, 30);
    // subsecuencia: todas las letras de q en orden dentro de t
    let ti = 0;
    let first = -1;
    for (const ch of q) {
        ti = t.indexOf(ch, ti);
        if (ti === -1) return null;
        if (first === -1) first = ti;
        ti += 1;
    }
    // más compacto = mejor
    return 40 - Math.min(ti - first - q.length, 30);
}
