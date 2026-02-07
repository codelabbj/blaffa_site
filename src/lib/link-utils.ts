/**
 * Transforms a Google Drive viewer/sharing link into a direct download link.
 * Example: https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk 
 * becomes: https://drive.google.com/uc?export=download&id=FILE_ID
 */
export const transformDriveLink = (url: string): string => {
    if (!url) return '';

    if (url.includes('drive.google.com')) {
        const fileIdMatch = url.match(/\/d\/([^/]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
    }

    return url;
};

/**
 * Ensures a WhatsApp URL is correctly formatted by cleaning the indicator and phone number.
 */
export const formatWhatsAppLink = (indicator: string, phone: string): string => {
    if (!phone) return '';

    // Remove any non-numeric characters from both
    const cleanIndicator = (indicator || '').replace(/\D/g, '');
    const cleanPhone = (phone || '').replace(/\D/g, '');

    return `https://wa.me/${cleanIndicator}${cleanPhone}`;
};
