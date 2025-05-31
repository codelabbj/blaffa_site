import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return(
      <footer className="text-center py-6 text-gray-400 text-sm">
      <p>{t("© 2025 Blaffa. All rights reserved .")}<a className="text-blue-500 font-extrabold" href="https://api.blaffa.net/blaffa/privacy/policy/"> Private Policy</a></p>
    </footer>
    )
}