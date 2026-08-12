const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  `  app.use("/api", apiRouter);
  if (basePathForApi !== '/') {
    app.use(basePathForApi + "api", apiRouter);
  }`,
  `  app.use("/api", apiRouter);
  app.use("/magic-library/api", apiRouter);
  app.use("/clientes/magic-library/api", apiRouter);
  if (basePathForApi !== '/') {
    app.use(basePathForApi + "api", apiRouter);
    if (!basePathForApi.endsWith('/')) {
       app.use(basePathForApi + "/api", apiRouter);
    }
  }`
);

fs.writeFileSync('server.ts', code);
console.log('Fixed server routes');
