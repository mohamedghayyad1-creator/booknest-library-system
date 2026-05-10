const app = require('./app');
const { initializeDatabase } = require('./database/db');

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`BookNest is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(error => {
    console.error('Database initialization failed:', error.message);
  });
