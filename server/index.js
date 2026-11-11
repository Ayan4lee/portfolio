const app = require('./app');
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
}
module.exports = app;
