/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/lib/schema.js", // path to your schema file
  out: "./drizzle", // folder where drizzle will put generated SQL/migrations
  driver: "better-sqlite", // 👈 this is important
  dbCredentials: {
    url: "./sqlite.db", // SQLite file location (relative path)
  },
};
