// lib/cors.ts

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace with your domain in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
