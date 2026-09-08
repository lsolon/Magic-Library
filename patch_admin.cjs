const fs = require('fs');
let code = fs.readFileSync('src/views/AdminPanel.tsx', 'utf8');

// Add imports for Activity
code = code.replace(
  "import { Shield, Users, Clock, Star } from 'lucide-react';",
  "import { Shield, Users, Clock, Star, Activity } from 'lucide-react';"
);

// Add state for access logs
code = code.replace(
  "  const [loading, setLoading] = useState(true);",
  "  const [loading, setLoading] = useState(true);\n  const [accessLogs, setAccessLogs] = useState<any[]>([]);\n  const [totalAccesses, setTotalAccesses] = useState(0);"
);

// Update useEffect to fetch access_logs
const fetchLogsLogic = `
    async function fetchAccessLogs() {
      try {
        const logsRef = collection(db, 'access_logs');
        const q = query(logsRef, orderBy('accessedAt', 'desc'), limit(500));
        const snapshot = await getDocs(q);
        const logsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAccessLogs(logsData);
        setTotalAccesses(logsData.length);
      } catch (error) {
        console.error("Error fetching access logs:", error);
      }
    }
`;

code = code.replace(
  "    async function fetchUsers() {",
  fetchLogsLogic + "\n    async function fetchUsers() {"
);

code = code.replace(
  "      fetchUsers();\n    }",
  "      fetchUsers();\n      fetchAccessLogs();\n    }"
);

// Add UI for Access Logs
const accessLogsUI = `
        <div className="bg-surface-container-low border border-surface-variant rounded-3xl p-6 shadow-sm mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-6 h-6 text-tertiary" />
              Histórico de Acessos
            </h2>
            <div className="bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full font-bold text-sm">
              {totalAccesses} acessos registrados
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {accessLogs.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant bg-surface-container-highest rounded-2xl border border-dashed border-surface-variant">
                Nenhum acesso registrado ainda.
              </div>
            ) : (
              accessLogs.map((log) => (
                <div key={log.id} className="bg-surface flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-surface-variant/30 text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{log.displayName || 'Usuário Desconhecido'}</span>
                    <span className="text-on-surface-variant/70 text-xs">{log.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant mt-2 md:mt-0 font-mono bg-surface-container-highest px-3 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    {log.accessedAt ? new Date(log.accessedAt.seconds * 1000).toLocaleString('pt-BR') : 'Data desconhecida'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
`;

code = code.replace(
  "      </main>",
  accessLogsUI + "\n      </main>"
);

fs.writeFileSync('src/views/AdminPanel.tsx', code);
console.log('Patched AdminPanel.tsx');
