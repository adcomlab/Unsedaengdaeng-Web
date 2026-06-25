const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/payment-config.js', (req, res) => {
  const tossClientKey =
    process.env.TOSS_CLIENT_KEY_PUBLIC ||
    process.env.TOSS_CLIENT_KEY ||
    '';

  res.type('application/javascript');
  res.send(
    `window.__UNSEDD_PAYMENT_CONFIG__ = ${JSON.stringify({ tossClientKey })};`,
  );
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/account-deletion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'account-deletion.html'));
});

app.get('/data-deletion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data-deletion.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server running on port ${PORT}`);
});
