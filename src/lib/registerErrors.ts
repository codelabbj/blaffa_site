const API_MESSAGE_MAP: Record<string, string> = {
  NUMBER_NOT_ON_WHATSAPP: "Ce numéro n'est pas actif sur WhatsApp.",
  WHATSAPP_DISABLED: "WhatsApp est temporairement indisponible.",
  INVALID_PHONE: "Numéro de téléphone invalide.",
};

const FIELD_MESSAGE_MAP: Record<string, string> = {
  email:
    "Cette adresse email est déjà utilisée. Connectez-vous ou utilisez une autre adresse email.",
  phone: "Ce numéro de téléphone est déjà associé à un compte.",
  password:
    "Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre.",
  re_password: "Les mots de passe ne correspondent pas.",
};

function mapLegacyEnglishMessage(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("email") && lower.includes("already exists")) {
    return FIELD_MESSAGE_MAP.email;
  }
  if (lower.includes("phone") && lower.includes("already exists")) {
    return FIELD_MESSAGE_MAP.phone;
  }
  if (lower.includes("password") && lower.includes("do not match")) {
    return FIELD_MESSAGE_MAP.re_password;
  }
  return null;
}

export function parseRegisterError(error: unknown): string {
  const err = error as {
    response?: { data?: unknown };
  };
  const data = err?.response?.data;

  if (!data) {
    return "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
  }

  if (typeof data === "string") {
    return mapLegacyEnglishMessage(data) || data;
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    if (typeof record.message === "string") {
      return API_MESSAGE_MAP[record.message] || record.message;
    }

    for (const [field, value] of Object.entries(record)) {
      if (FIELD_MESSAGE_MAP[field]) {
        return FIELD_MESSAGE_MAP[field];
      }

      if (Array.isArray(value) && value.length > 0) {
        const text = String(value[0]);
        return mapLegacyEnglishMessage(text) || text;
      }

      if (typeof value === "string") {
        return mapLegacyEnglishMessage(value) || value;
      }
    }
  }

  return "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
}
