'use client';

import { useTheme } from '@/components/ThemeProvider';
import CryptoSelectionGrid from '@/components/CryptoSelectionGrid';

export default function BuyCryptoPage() {
    const { theme } = useTheme();
    return (
        <div className={`min-h-screen ${theme.colors.a_background} p-4 pt-6`}>
            <CryptoSelectionGrid mode="buy" title="Achat" />
        </div>
    );
}
