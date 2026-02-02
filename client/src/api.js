const PORT = 5000;
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? `http://localhost:${PORT}/api` : "DOMAIN/api";

export async function fetchRandomPosition(difficulty) {
  try {
    const url = `${API_URL}/positions/random?difficulty=${difficulty}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Sunucu yanıt vermedi");
    const data = await response.json();
    return data.fen; //Sadece ihtiyacımız olan FEN'i dönüyoruz
  } catch (error) {
    console.error("API Hatası:", error);
    throw error;
  }
}