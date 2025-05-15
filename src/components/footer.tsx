import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return(
      <footer className="text-center py-6 text-gray-400 text-sm">
      <p>{t("© 2025 Yapson. All rights reserved.")}</p>
    </footer>
    )
}