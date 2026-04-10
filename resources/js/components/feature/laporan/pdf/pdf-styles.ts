import { StyleSheet } from '@react-pdf/renderer';

export const colors = {
    primary: '#1e293b', // slate-800
    secondary: '#475569', // slate-600
    accent: '#3b82f6', // blue-500
    muted: '#94a3b8', // slate-400
    border: '#e2e8f0', // slate-200
    bg: '#f8fafc', // slate-50
    white: '#ffffff',
    success: '#16a34a', // green-600
    danger: '#dc2626', // red-600
};

export const shared = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: colors.white,
        padding: 32,
        fontSize: 9,
        color: colors.primary,
    },
    // ── Header ────────────────────────────────────────────
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: colors.accent,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
    },
    headerSubtitle: {
        fontSize: 9,
        color: colors.secondary,
        marginTop: 2,
    },
    periodBadge: {
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        padding: 6,
        alignItems: 'flex-end',
    },
    periodLabel: {
        fontSize: 7,
        color: colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    periodValue: {
        fontSize: 9,
        color: colors.primary,
        fontFamily: 'Helvetica-Bold',
        marginTop: 1,
    },
    // ── Section ────────────────────────────────────────────
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    // ── Table ──────────────────────────────────────────────
    table: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.bg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    tableRowAlt: {
        backgroundColor: colors.bg,
    },
    thText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: colors.secondary,
        textTransform: 'uppercase',
    },
    tdText: {
        fontSize: 8,
        color: colors.primary,
    },
    // ── Stat Cards ─────────────────────────────────────────
    statRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        padding: 10,
    },
    statLabel: {
        fontSize: 8,
        color: colors.secondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
    },
    // ── Footer ─────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 32,
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 6,
    },
    footerText: {
        fontSize: 7,
        color: colors.muted,
    },
});

export function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) {
        return '-';
    }

    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}
