export function getCorsHeaders(origin: string = "") {
  const allowedOrigins = [
    "https://themexyz.com",
    "https://www.themexyz.com",
  ];

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "https://www.themexyz.com"; // fallback or remove this line to block
  }

  return headers;
}