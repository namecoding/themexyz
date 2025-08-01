// lib/cors.ts
export const corsHeaders = {
  // "Access-Control-Allow-Origin": "https://www.themexyz.com", // ✅ must be exact origin
  // "Access-Control-Allow-Credentials": "true", 

  "Access-Control-Allow-Origin": "*", // or your domain
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",

  // "Content-Type": "application/json",
};
