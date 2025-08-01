export function getCorsHeaders(origin: string = "*") {
  return {
    "Access-Control-Allow-Origin": "https://www.themexyz.com",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
