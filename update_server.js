const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace('// API routes', `// API routes
  const apiRouter = express.Router();
  const basePath = process.env.VITE_BASE_PATH || '/';
  
  app.use("/api", apiRouter);
  if (basePath !== '/') {
    app.use(basePath + "api", apiRouter);
  }`);

code = code.replace(/app\.get\("\/api\//g, 'apiRouter.get("/');
code = code.replace(/app\.post\("\/api\//g, 'apiRouter.post("/');

fs.writeFileSync('server.ts', code);
console.log('Done');
