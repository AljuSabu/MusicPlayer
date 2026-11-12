export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatLongDuration(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${totalMinutes} min`;
  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

// Jamendo cover URLs carry their size: ...&width=300... -> ...&width=500...
export function resizeJamendoImage(url: string, size: number): string {
  return url.replace(/([?&])width=\d+/, `$1width=${size}`);
}

// "http://creativecommons.org/licenses/by-nc-sa/3.0/" -> "BY-NC-SA"
export function licenseCode(url: string): string | null {
  const match = url.match(/licenses\/([a-z-]+)\//i);
  return match ? match[1].toUpperCase() : null;
}
