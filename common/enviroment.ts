export const enviroment = {
  server: {
    port: { port: process.env.SERVER_PORT || 3000 },
    db: {
      url: process.env.DB_URL || "mongodb://localhost/avaliacao-node-contatos",
    },
    security: {
      saltRounds: process.env.SALT_ROUNDS || 10,
      apiSecret: process.env.API_SECRET || "avaliacao-node-secret",
    },
  },
};
