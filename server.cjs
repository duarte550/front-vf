// server.js
const express = require('express');
const path = require('path');

const app = express();
// A porta será fornecida pelo ambiente do Azure App Service
const port = process.env.PORT || 8080; 

// 1. Servir a pasta 'dist' como conteúdo estático
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Rota "catch-all" para lidar com o roteamento do React (SPA)
//    Isso garante que todas as rotas (ex: /grupos-economicos) sirvam o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
});