const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('mercadopago')) {
  code = code.replace(
    'import { GoogleGenAI, Type } from "@google/genai";',
    'import { GoogleGenAI, Type } from "@google/genai";\nimport { MercadoPagoConfig, Preference } from "mercadopago";'
  );
  
  const mpSetup = `
let mpClient: MercadoPagoConfig | null = null;
function getMP() {
  if (!mpClient) {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN || "APP_USR-dummy";
    mpClient = new MercadoPagoConfig({ accessToken: token });
  }
  return mpClient;
}
`;
  code = code.replace('let aiClient = null;', mpSetup + 'let aiClient: any = null;');
  
  const mpRoute = `
  apiRouter.post("/create-preference", async (req, res) => {
    try {
      const { plan, userEmail } = req.body;
      let title = "";
      let price = 0;

      if (plan === "monthly") {
        title = "Magic Library - Plano Mensal";
        price = 18.00;
      } else if (plan === "annual") {
        title = "Magic Library - Plano Anual";
        price = 183.60;
      } else {
        return res.status(400).json({ error: "Plano inválido" });
      }

      const client = getMP();
      const preference = new Preference(client);
      
      const hostUrl = process.env.HOST_URL || (req.headers.origin || "http://localhost:5173");
      const basePath = process.env.VITE_BASE_PATH || '/';
      const returnUrl = hostUrl.endsWith('/') ? hostUrl.slice(0, -1) : hostUrl;

      const response = await preference.create({
        body: {
          items: [
            {
              id: plan,
              title: title,
              quantity: 1,
              unit_price: price,
              currency_id: "BRL"
            }
          ],
          payer: {
            email: userEmail
          },
          back_urls: {
            success: \`\${returnUrl}\${basePath === '/' ? '' : basePath}subscription-success\`,
            failure: \`\${returnUrl}\${basePath === '/' ? '' : basePath}subscription\`,
            pending: \`\${returnUrl}\${basePath === '/' ? '' : basePath}subscription\`
          },
          auto_return: "approved"
        }
      });

      res.json({ init_point: response.init_point });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
`;

  code = code.replace('  apiRouter.get("/health"', mpRoute + '\n  apiRouter.get("/health"');
  
  fs.writeFileSync('server.ts', code);
  console.log('Patched server.ts');
}
