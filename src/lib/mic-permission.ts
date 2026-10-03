/**
 * Site web : le navigateur demande le micro lui-même via getUserMedia.
 * L'app native a sa propre demande d'autorisation Android.
 */
export async function ensureMicrophonePermission(): Promise<boolean> {
  return true;
}
