// Archivo temporal para debuggear las variables de entorno
console.log('=== DEBUG VARIABLES DE ENTORNO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Mode:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Dev?:', import.meta.env.DEV);
console.log('Prod?:', import.meta.env.PROD);
console.log('================================');
