import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} = React;
// API Client for BEST Management System
const API_BASE = '/api';
let token = localStorage.getItem('token');

// Set token
const setToken = newToken => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

// Get token
const getToken = () => token;

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

// Auth API
const authAPI = {
  login: async (username, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      })
    });
    setToken(data.token);
    return data.user;
  },
  logout: () => {
    setToken(null);
  },
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  }
};

// Users API
const usersAPI = {
  getAll: async () => apiCall('/users'),
  create: async user => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(user)
  }),
  update: async (id, user) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  }),
  delete: async id => apiCall(`/users/${id}`, {
    method: 'DELETE'
  })
};

// Sales API
const salesAPI = {
  getAll: async () => apiCall('/sales'),
  create: async sale => apiCall('/sales', {
    method: 'POST',
    body: JSON.stringify(sale)
  }),
  update: async (id, sale) => apiCall(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sale)
  }),
  delete: async id => apiCall(`/sales/${id}`, {
    method: 'DELETE'
  })
};

// Expenses API
const expensesAPI = {
  getAll: async () => apiCall('/expenses'),
  create: async expense => apiCall('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense)
  }),
  update: async (id, expense) => apiCall(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense)
  }),
  delete: async id => apiCall(`/expenses/${id}`, {
    method: 'DELETE'
  })
};

// Payments API
const paymentsAPI = {
  getAll: async () => apiCall('/payments'),
  create: async payment => apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(payment)
  }),
  update: async (id, payment) => apiCall(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payment)
  }),
  delete: async id => apiCall(`/payments/${id}`, {
    method: 'DELETE'
  })
};

// Customers API
const customersAPI = {
  getAll: async () => apiCall('/customers'),
  create: async customer => apiCall('/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }),
  update: async (id, customer) => apiCall(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  }),
  delete: async id => apiCall(`/customers/${id}`, {
    method: 'DELETE'
  })
};

// Categories API
const categoriesAPI = {
  getAll: async type => apiCall(`/categories${type ? `?type=${type}` : ''}`),
  create: async category => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(category)
  }),
  update: async (id, category) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category)
  }),
  delete: async id => apiCall(`/categories/${id}`, {
    method: 'DELETE'
  })
};

// Activity Logs API
const logsAPI = {
  getAll: async () => apiCall('/logs'),
  create: async log => apiCall('/logs', {
    method: 'POST',
    body: JSON.stringify(log)
  })
};

// Delete Requests API
const delreqsAPI = {
  getAll: async () => apiCall('/delreqs'),
  create: async delreq => apiCall('/delreqs', {
    method: 'POST',
    body: JSON.stringify(delreq)
  }),
  update: async (id, delreq) => apiCall(`/delreqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(delreq)
  }),
  delete: async id => apiCall(`/delreqs/${id}`, {
    method: 'DELETE'
  })
};
const {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} = Recharts;
const CustomBarTick = ({
  x,
  y,
  payload
}) => /*#__PURE__*/_jsxDEV("text", {
  x: x,
  y: y + 10,
  textAnchor: "middle",
  fill: "var(--text2)",
  fontSize: 9,
  children: payload.value
}, void 0, false);

// ─── Storage ──────────────────────────────────────────────────────────────────
// API-based storage (MongoDB)
const SK = {
  users: "users",
  sales: "sales",
  expenses: "expenses",
  saleCats: "categories?type=sale",
  expCats: "categories?type=expense",
  delReqs: "delreqs",
  actLog: "logs",
  theme: "theme",
  payments: "payments",
  payCats: "categories?type=payment",
  customers: "customers"
};

// Load from API
async function sload(key, fallback) {
  try {
    if (key === "theme") {
      const t = localStorage.getItem("theme");
      return t !== null ? JSON.parse(t) : fallback;
    }
    const response = await fetch(`/api/${key}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    if (!data) return fallback;
    // Map _id to id for all records
    if (Array.isArray(data)) {
      return data.map(r => ({
        ...r,
        id: r.id || r._id?.toString()
      }));
    }
    return data;
  } catch {
    return fallback;
  }
}

// Save to API
async function ssave(key, val) {
  try {
    if (key === "theme") {
      localStorage.setItem("theme", JSON.stringify(val));
      return;
    }
    // For other data, API calls are handled directly in components
  } catch {}
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEF_USERS = [{
  id: "1",
  username: "admin",
  password: "admin123",
  role: "admin",
  name: "ผู้ดูแลระบบ"
}, {
  id: "2",
  username: "manager",
  password: "manager123",
  role: "manager",
  name: "ผู้จัดการ"
}, {
  id: "3",
  username: "user",
  password: "user123",
  role: "user",
  name: "พนักงาน"
}, {
  id: "4",
  username: "viewer",
  password: "viewer123",
  role: "viewer",
  name: "ผู้ชม"
}];
const DEF_SCATS = [{
  id: "fostec",
  label: "FOSTEC",
  color: "#00d4ff",
  items: [{
    id: "fim",
    label: "FIM 4.0"
  }, {
    id: "app",
    label: "Application"
  }, {
    id: "spc",
    label: "SPC"
  }]
}, {
  id: "measure",
  label: "งานตรวจวัด",
  color: "#ff6b35",
  items: [{
    id: "eff",
    label: "Efficiency"
  }, {
    id: "flow",
    label: "Flow rate"
  }, {
    id: "qual",
    label: "Quality"
  }, {
    id: "dew",
    label: "Dew point"
  }, {
    id: "oil",
    label: "Oil vapor"
  }, {
    id: "part",
    label: "Particle"
  }, {
    id: "pres",
    label: "Pressure"
  }, {
    id: "enp",
    label: "Energy power"
  }]
}];
const DEF_ECATS = [{
  id: "fix",
  label: "Fix cost",
  color: "#ff4757",
  items: []
}, {
  id: "office",
  label: "ค่าใช้จ่ายสำนักงาน",
  color: "#ffa502",
  items: []
}, {
  id: "rent",
  label: "ค่าเช่า",
  color: "#eccc68",
  items: []
}, {
  id: "fuel",
  label: "ค่าน้ำมันในการทำงาน",
  color: "#2ed573",
  items: []
}, {
  id: "job",
  label: "ค่าใช้จ่ายใน Job งาน",
  color: "#1e90ff",
  items: []
}, {
  id: "purchase",
  label: "สั่งซื้อสินค้า และเครื่องมือ",
  color: "#a29bfe",
  items: []
}, {
  id: "other",
  label: "ค่าใช้จ่ายอื่นๆ",
  color: "#fd79a8",
  items: []
}];
const DEF_CUSTOMERS = [{
  id: "cg1",
  label: "ลูกค้าทั่วไป",
  color: "#00d4ff",
  items: []
}];
const DEF_PCATS = [{
  id: "p_fostec",
  label: "FOSTEC",
  color: "#00d4ff",
  items: [{
    id: "p_fim",
    label: "FIM 4.0"
  }, {
    id: "p_app",
    label: "Application"
  }, {
    id: "p_spc",
    label: "SPC"
  }]
}, {
  id: "p_measure",
  label: "งานตรวจวัด",
  color: "#ff6b35",
  items: [{
    id: "p_eff",
    label: "Efficiency"
  }, {
    id: "p_flow",
    label: "Flow rate"
  }, {
    id: "p_qual",
    label: "Quality"
  }, {
    id: "p_dew",
    label: "Dew point"
  }, {
    id: "p_oil",
    label: "Oil vapor"
  }, {
    id: "p_part",
    label: "Particle"
  }, {
    id: "p_pres",
    label: "Pressure"
  }, {
    id: "p_enp",
    label: "Energy power"
  }]
}];

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmt = n => (n || 0).toLocaleString("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const todayISO = () => new Date().toISOString().slice(0, 10);
// แปลง YYYY-MM-DD → DD/MM/YYYY สำหรับแสดงผล
const fmtDate = d => {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
// แปลง DD/MM/YYYY → YYYY-MM-DD สำหรับเก็บข้อมูล (ถ้าจำเป็น)
const parseDate = s => {
  if (!s) return "";
  if (s.includes("-")) return s; // already ISO
  const [day, m, y] = s.split("/");
  return `${y}-${m}-${day}`;
};

// ─── CSV Export helper ────────────────────────────────────────────────────────
function exportCSV(rows, filename) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(","), ...rows.map(r => headers.map(h => {
    const v = r[h] ?? "";
    const s = String(v).replace(/"/g, '"' + '"');
    return `"${s}"`;
  }).join(","))];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Resolve item/customer label helpers ──────────────────────────────────────
function resolveItemLabel(r, allSaleCatItems) {
  // Priority: saleItemLabel (from markPaid) > allSaleCatItems lookup > description > itemId
  if (r.saleItemLabel) return r.saleItemLabel;
  const found = allSaleCatItems.find(i => i.id === r.itemId);
  if (found) return found.label;
  if (r.description) return r.description;
  return r.itemId || "-";
}
function resolveCustomer(r, customers) {
  // Match by customerId first, then by jobNo matching any job in customer.jobs[]
  const all = (customers || []).flatMap(g => (g.items || []).map(c => ({
    ...c,
    groupLabel: g.label
  })));
  if (r.customerId) {
    const c = all.find(c => c.id === r.customerId);
    if (c) return c.label;
  }
  if (r.jobNo) {
    // Check jobs[] array first (new structure)
    const c = all.find(c => (c.jobs || []).some(j => j.label === r.jobNo || j.id === r.jobNo));
    if (c) return c.label;
    // Fallback: old jobNo field
    const c2 = all.find(c => c.jobNo === r.jobNo);
    if (c2) return c2.label;
  }
  return "-";
}
const nowStr = () => new Date().toLocaleString("th-TH");
const getYear = d => d.slice(0, 4);
const getMonth = d => d.slice(0, 7);
const getQ = d => {
  const m = parseInt(d.slice(5, 7));
  return `${d.slice(0, 4)}-Q${Math.ceil(m / 3)}`;
};
function filterPeriod(recs, mode, sel) {
  return recs.filter(r => {
    if (mode === "day") return r.date === sel;
    if (mode === "month") return getMonth(r.date) === sel;
    if (mode === "quarter") return getQ(r.date) === sel;
    if (mode === "year") return getYear(r.date) === sel;
    return true;
  });
}
function periodOpts(recs, mode) {
  const s = new Set();
  recs.forEach(r => {
    if (mode === "day") s.add(r.date);
    if (mode === "month") s.add(getMonth(r.date));
    if (mode === "quarter") s.add(getQ(r.date));
    if (mode === "year") s.add(getYear(r.date));
  });
  return Array.from(s).sort().reverse();
}
const ROLE_COLOR = {
  admin: "#00d4ff",
  manager: "#00e676",
  user: "#a29bfe",
  viewer: "#8899bb"
};
const ROLE_LABEL = {
  admin: "แอดมิน",
  manager: "ผู้จัดการ",
  user: "ผู้ใช้งาน",
  viewer: "ดูอย่างเดียว"
};
const canEdit = r => ["admin", "manager", "user"].includes(r);
const canDel = r => ["admin", "manager"].includes(r);
const canLog = r => ["admin", "manager", "user"].includes(r); // user can see activity tab
const canViewDelReqs = r => ["admin", "manager"].includes(r); // only admin/manager see delete requests
const canManage = r => ["admin", "manager"].includes(r); // หมวดหมู่ tab
const canManageUsers = r => r === "admin"; // จัดการผู้ใช้งาน tab

function mkLog(user, action, detail, type = "info") {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action,
    detail,
    type,
    time: nowStr(),
    ts: Date.now()
  };
}

// ─── BEST Logo ──────────────────────────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,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";
function BestLogo({
  height = 36
}) {
  const w = Math.round(height * (240 / 67));
  return /*#__PURE__*/_jsxDEV("img", {
    src: LOGO_SRC,
    alt: "BEST Energy",
    width: w,
    height: height,
    style: {
      objectFit: "contain",
      display: "block"
    }
  }, void 0, false);
}
// ─── CSS ──────────────────────────────────────────────────────────────────────
function buildCSS(dark) {
  const d = dark;
  return `
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:${d ? "#080c14" : "#f0f4f8"};
  --bg2:${d ? "#0d1420" : "#e4eaf2"};
  --bg3:${d ? "#131b2e" : "#dde4ee"};
  --card:${d ? "#111827" : "#ffffff"};
  --card2:${d ? "#1a2540" : "#f5f7fa"};
  --border:${d ? "#1e2d47" : "#cdd6e2"};
  --border2:${d ? "#243352" : "#b8c6d6"};
  --text:${d ? "#e8f0fe" : "#1a2540"};
  --text2:${d ? "#8899bb" : "#4a5a72"};
  --text3:${d ? "#4d6080" : "#90a0b8"};
  --fi:${d ? "#0d1420" : "#f8fafc"};
  --accent:#00d4ff;--green:#00e676;--red:#ff4757;--yellow:#ffd32a;--purple:#a29bfe;--orange:#ff6b35;
  --shadow:0 4px 20px rgba(0,0,0,${d ? ".45" : ".1"});
}
body{font-family:'Sarabun',sans-serif;background:var(--bg);color:var(--text);font-size:14px}
.app{min-height:100vh;display:flex;flex-direction:column}

.lwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.lbox{width:400px;background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:36px;box-shadow:var(--shadow)}
.llogo{text-align:center;margin-bottom:24px}
.llogo-sub{font-size:12px;color:var(--text2);margin-top:8px}
.fg{margin-bottom:14px}
.fg label{display:block;font-size:12px;color:var(--text2);margin-bottom:6px}
.fi,.fg input{width:100%;padding:10px 13px;background:var(--fi);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'Sarabun',sans-serif;font-size:14px;outline:none;transition:border-color .2s}
.fi:focus,.fg input:focus{border-color:var(--accent)}
.btnprim{width:100%;padding:12px;background:linear-gradient(135deg,#007799,#00b8d4);border:none;border-radius:8px;color:#fff;font-family:'Sarabun',sans-serif;font-size:14px;font-weight:600;cursor:pointer}
.btnprim:hover{opacity:.9}
.lerr{color:var(--red);font-size:12px;text-align:center;margin-top:10px}

.topbar{display:flex;align-items:center;padding:0 16px;height:56px;background:var(--card);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;gap:10px}
.tbrand{display:flex;align-items:center;gap:8px;flex-shrink:0}
.tbrand-name{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:var(--accent);letter-spacing:2px}
.tsysname{font-size:11px;color:var(--text2);letter-spacing:.3px;white-space:nowrap;flex-shrink:0;display:none}
@media(min-width:900px){.tsysname{display:block}}
.dot{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}
.tcenter{flex:1;display:flex;align-items:center;justify-content:center;gap:10px}
.clock-box{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:4px 12px;text-align:center}
.clock-time{font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;color:var(--accent)}
.clock-date{font-size:10px;color:var(--text2)}
.tbtn{padding:6px 11px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;color:var(--text2);font-size:12px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.tbtn:hover{border-color:var(--accent);color:var(--accent)}
.tright{display:flex;align-items:center;gap:10px;flex-shrink:0}
.uav{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff}
.uinfo{font-size:12px}
.uname{font-weight:600}
.urole{font-size:10px;color:var(--text2)}
.btnout{padding:5px 11px;background:transparent;border:1px solid var(--border2);border-radius:6px;color:var(--text2);font-size:12px;cursor:pointer}
.btnout:hover{border-color:var(--red);color:var(--red)}

.navtabs{display:flex;gap:3px;padding:12px 16px 0;border-bottom:1px solid var(--border);background:var(--bg2);flex-wrap:wrap}
.ntab{padding:8px 16px;background:transparent;border:1px solid transparent;border-bottom:none;border-radius:8px 8px 0 0;color:var(--text2);font-size:13px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.ntab.active{background:var(--card);border-color:var(--border);color:var(--accent);font-weight:600}
.ntab:hover:not(.active){background:rgba(255,255,255,.04);color:var(--text)}
.badge{display:inline-block;min-width:16px;height:16px;border-radius:8px;background:var(--red);color:#fff;font-size:10px;font-weight:700;text-align:center;line-height:16px;padding:0 3px;margin-left:5px}

.main{flex:1;padding:18px;background:var(--bg)}
.pbar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.pb{padding:7px 14px;background:var(--card);border:1px solid var(--border2);border-radius:6px;color:var(--text2);font-size:12px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.pb.on{background:rgba(0,212,255,.1);border-color:var(--accent);color:var(--accent)}
.psel{padding:7px 11px;background:var(--card);border:1px solid var(--border2);border-radius:6px;color:var(--text);font-size:12px;outline:none;font-family:'Sarabun',sans-serif}

.sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:18px}
.scard{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.scard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--ca)}
.slabel{font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.sval{font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700}
.sunit{font-size:11px;color:var(--text2);margin-top:3px}

.sec{background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden}
.shead{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--card2)}
.stitle{font-size:14px;font-weight:600;display:flex;align-items:center;gap:7px}
.sdot{width:8px;height:8px;border-radius:50%}

.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th{padding:8px 10px;text-align:left;color:var(--text2);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid var(--border)}
.tbl td{padding:8px 10px;border-bottom:1px solid rgba(100,130,160,.1)}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(0,212,255,.03)}
.num{text-align:right;font-family:'Rajdhani',sans-serif;font-size:13px}
.tot td{font-weight:700;color:var(--accent);background:rgba(0,212,255,.04);border-top:1px solid var(--border2)}

.btnadd{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.3);border-radius:6px;color:var(--accent);font-size:12px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.btnadd:hover{background:rgba(0,212,255,.2)}
.bico{width:26px;height:26px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;border:none;background:transparent;transition:all .2s}
.bico:hover{background:rgba(255,255,255,.08)}

.ov{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--card);border:1px solid var(--border2);border-radius:14px;padding:24px;width:460px;max-width:100%;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow)}
.mtitle{font-size:15px;font-weight:700;color:var(--accent);margin-bottom:16px}
.mact{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}
.btncancel{padding:8px 15px;background:transparent;border:1px solid var(--border2);border-radius:7px;color:var(--text2);font-family:'Sarabun',sans-serif;font-size:13px;cursor:pointer}
.btnsave{padding:8px 15px;background:linear-gradient(135deg,#007799,#00b8d4);border:none;border-radius:7px;color:#fff;font-family:'Sarabun',sans-serif;font-size:13px;font-weight:600;cursor:pointer}
.btnapv{padding:6px 12px;background:linear-gradient(135deg,#005522,#008844);border:none;border-radius:6px;color:#fff;font-family:'Sarabun',sans-serif;font-size:12px;font-weight:600;cursor:pointer}
.btnrej{padding:6px 12px;background:linear-gradient(135deg,#770011,#cc0022);border:none;border-radius:6px;color:#fff;font-family:'Sarabun',sans-serif;font-size:12px;font-weight:600;cursor:pointer}
.fl{display:block;font-size:12px;color:var(--text2);margin-bottom:5px}
.fr2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.fmb{margin-bottom:12px}
.fsel{width:100%;padding:9px 11px;background:var(--fi);border:1px solid var(--border2);border-radius:7px;color:var(--text);font-size:13px;outline:none;font-family:'Sarabun',sans-serif}

.tag{display:inline-block;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
.tag-admin{background:rgba(0,212,255,.15);color:var(--accent)}
.tag-manager{background:rgba(0,230,118,.15);color:var(--green)}
.tag-user{background:rgba(162,155,254,.15);color:var(--purple)}
.tag-viewer{background:rgba(136,153,187,.15);color:var(--text2)}
.tag-pending{background:rgba(255,211,42,.15);color:var(--yellow)}
.tag-approved{background:rgba(0,230,118,.15);color:var(--green)}
.tag-rejected{background:rgba(255,71,87,.15);color:var(--red)}

.pgbar{height:6px;border-radius:3px;background:var(--bg3);margin-top:6px;overflow:hidden}
.pgfill{height:100%;border-radius:3px;transition:width .4s}

.lrow{padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:10px}
.lrow:last-child{border-bottom:none}
.lic{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}

.chwrap{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px}
.chtitle{font-size:12px;font-weight:600;color:var(--text2);margin-bottom:12px}

.pbanner{background:rgba(255,211,42,.07);border:1px solid rgba(255,211,42,.2);border-radius:7px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:var(--yellow)}
.pendrow td{opacity:.65}
.pbadge{font-size:10px;background:rgba(255,211,42,.2);color:var(--yellow);border:1px solid rgba(255,211,42,.25);border-radius:3px;padding:1px 5px;margin-left:4px}

.mgrid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mcard{background:var(--card);border:1px solid var(--border);border-radius:11px;overflow:hidden}
.mhead{padding:12px 14px;background:var(--card2);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:13px}
.mbody{padding:13px}
.irow{display:flex;align-items:center;justify-content:space-between;padding:6px 9px;border-radius:5px;margin-bottom:3px;background:var(--bg3);border:1px solid var(--border)}

.empty{text-align:center;padding:32px;color:var(--text3);font-size:13px}
.filter-tabs{display:flex;gap:0;margin-bottom:12px;border:1px solid var(--border);border-radius:8px;overflow:hidden}
.ftab{flex:1;padding:8px 12px;background:var(--card);border:none;color:var(--text2);font-size:12px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s;border-right:1px solid var(--border)}
.ftab:last-child{border-right:none}
.ftab.on{background:rgba(0,212,255,.1);color:var(--accent);font-weight:600}
.ftab:hover:not(.on){background:var(--bg3)}
.filter-panel{padding:10px 14px;background:var(--card2);border:1px solid var(--border);border-radius:8px;margin-bottom:12px}
.filter-panel-title{font-size:11px;color:var(--text2);font-weight:600;margin-bottom:7px}
.filter-chips{display:flex;gap:5px;flex-wrap:wrap}
.chip{padding:4px 10px;background:var(--bg3);border:1px solid var(--border2);border-radius:16px;color:var(--text2);font-size:11px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.chip.on{background:rgba(0,212,255,.12);border-color:var(--accent);color:var(--accent)}
.chip-job{padding:4px 10px 4px;background:var(--bg3);border:1px solid var(--border2);border-radius:16px;color:var(--text2);font-size:11px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s;display:flex;flex-direction:column;align-items:flex-start;gap:0}
.chip-job.on{background:rgba(0,230,118,.1);border-color:var(--green);color:var(--green)}
.chip-job:hover:not(.on){background:var(--card)}
.btn-export{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);border-radius:6px;color:var(--text2);font-size:12px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.btn-export:hover{background:rgba(0,212,255,.15);color:var(--accent)}
.job-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(0,230,118,.15);color:var(--green);border:1px solid rgba(0,230,118,.25);margin-left:4px}
.job-filter-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;padding:10px 14px;background:var(--card2);border:1px solid var(--border);border-radius:8px}
.jfbtn{padding:5px 12px;background:var(--bg3);border:1px solid var(--border2);border-radius:5px;color:var(--text2);font-size:11px;cursor:pointer;font-family:'Sarabun',sans-serif;transition:all .2s}
.jfbtn.on{background:rgba(0,230,118,.12);border-color:var(--green);color:var(--green)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
@media(max-width:700px){.mgrid2{grid-template-columns:1fr}.fr2{grid-template-columns:1fr}.tcenter{display:none}}
`;
}

// ─── Clock ────────────────────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
  const mon = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return /*#__PURE__*/_jsxDEV("div", {
    className: "clock-box",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "clock-time",
      children: [h, ":", m, ":", s]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "clock-date",
      children: [days[now.getDay()], " ", now.getDate(), " ", mon[now.getMonth()], " ", now.getFullYear() + 543]
    }, void 0, true)]
  }, void 0, true);
}

// ─── Period hook + bar ────────────────────────────────────────────────────────
function usePeriod(allRecs) {
  const [mode, setMode] = useState("month");
  const getOpts = m => periodOpts(allRecs.length ? allRecs : [{
    date: todayISO()
  }], m);
  const [sel, setSel] = useState(() => getOpts("month")[0] || "");
  useEffect(() => {
    const o = getOpts(mode);
    setSel(o[0] || "");
  }, [mode]);
  return {
    mode,
    setMode,
    sel,
    setSel,
    opts: getOpts(mode)
  };
}
function PBar({
  mode,
  setMode,
  sel,
  setSel,
  opts
}) {
  return /*#__PURE__*/_jsxDEV("div", {
    className: "pbar",
    children: [[["day", "รายวัน"], ["month", "รายเดือน"], ["quarter", "รายไตรมาส"], ["year", "รายปี"]].map(([k, l]) => /*#__PURE__*/_jsxDEV("button", {
      className: `pb${mode === k ? " on" : ""}`,
      onClick: () => setMode(k),
      children: l
    }, k, false)), /*#__PURE__*/_jsxDEV("select", {
      className: "psel",
      value: sel,
      onChange: e => setSel(e.target.value),
      children: [opts.length === 0 && /*#__PURE__*/_jsxDEV("option", {
        value: "",
        children: "ไม่มีข้อมูล"
      }, void 0, false), opts.map(o => /*#__PURE__*/_jsxDEV("option", {
        value: o,
        children: mode === "day" ? fmtDate(o) : o
      }, o, false))]
    }, void 0, true)]
  }, void 0, true);
}
const CTip = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload?.length) return null;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      background: "var(--card2)",
      border: "1px solid var(--border2)",
      borderRadius: 7,
      padding: "8px 12px",
      fontSize: 12
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        color: "var(--text2)",
        marginBottom: 4
      },
      children: label
    }, void 0, false), payload.map((p, i) => /*#__PURE__*/_jsxDEV("div", {
      style: {
        color: p.color
      },
      children: [p.name, ": ", fmt(p.value), " ฿"]
    }, i, true))]
  }, void 0, true);
};

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState(DEF_USERS);
  const [sCats, setSCats] = useState(DEF_SCATS);
  const [eCats, setECats] = useState(DEF_ECATS);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [delReqs, setDelReqs] = useState([]);
  const [pCats, setPCats] = useState(DEF_PCATS);
  const [customers, setCustomers] = useState(DEF_CUSTOMERS);
  const [actLog, setActLog] = useState([]);
  const [trash, setTrash] = useState([]);
  const [dark, setDark] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const reloadAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = {
      'Authorization': 'Bearer ' + token
    };
    try {
      const [s, e, pay, dr, al] = await Promise.all([fetch('/api/sales', {
        headers
      }).then(r => r.ok ? r.json() : null), fetch('/api/expenses', {
        headers
      }).then(r => r.ok ? r.json() : null), fetch('/api/payments', {
        headers
      }).then(r => r.ok ? r.json() : null), fetch('/api/delreqs', {
        headers
      }).then(r => r.ok ? r.json() : null), fetch('/api/logs', {
        headers
      }).then(r => r.ok ? r.json() : null)]);
      if (s) setSales(s.map(x => ({
        ...x,
        id: x.id || x._id?.toString()
      })));
      if (e) setExpenses(e.map(x => ({
        ...x,
        id: x.id || x._id?.toString()
      })));
      if (pay) setPayments(pay.map(x => ({
        ...x,
        id: x.id || x._id?.toString()
      })));
      if (dr) setDelReqs(dr.map(x => ({
        ...x,
        id: x.id || x._id?.toString()
      })));
      if (al) setActLog(al.map(x => ({
        ...x,
        id: x.id || x._id?.toString()
      })));
    } catch (e) {
      console.error('reload error', e);
    }
  };
  const switchTab = t => {
    setTab(t);
    reloadAll();
  };
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      const th = localStorage.getItem('theme');
      setDark(th !== null ? JSON.parse(th) : true);
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const [sc, ec, s, e, pay, pc, cust, dr, al, us] = await Promise.all([sload(SK.saleCats, DEF_SCATS), sload(SK.expCats, DEF_ECATS), sload(SK.sales, []), sload(SK.expenses, []), sload(SK.payments, []), sload(SK.payCats, DEF_PCATS), sload(SK.customers, DEF_CUSTOMERS), sload(SK.delReqs, []), sload(SK.actLog, []), sload(SK.users, DEF_USERS)]);
        setSCats(sc);
        setECats(ec);
        setSales(s);
        setExpenses(e);
        setPayments(pay);
        setPCats(pc);
        setCustomers(cust);
        setDelReqs(dr);
        setActLog(al);
        if (us && us.length > 0) setUsers(us);
        // Load trash
        try {
          const tr = await fetch('/api/trash', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (tr.ok) {
            const td = await tr.json();
            setTrash(td);
          }
        } catch (e) {}

        // Get current user
        const userRes = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setMe(userData);
        }
      } catch (e) {
        console.error('Error loading data:', e);
      }
      setReady(true);
    })();
  }, []);
  const persist = async (key, val, setter) => {
    setter(prev => {
      const endpoint = key.split('?')[0];
      if (key === "theme") {
        localStorage.setItem("theme", JSON.stringify(val));
        return val;
      }
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      if (Array.isArray(val) && Array.isArray(prev)) {
        const prevIds = new Set(prev.map(r => r.id || r._id));
        const valIds = new Set(val.map(r => r.id || r._id));
        const added = val.filter(r => !(r.id || r._id) || !prevIds.has(r.id || r._id));
        const removed = prev.filter(r => (r.id || r._id) && !valIds.has(r.id || r._id));
        const edited = val.filter(r => {
          const id = r.id || r._id;
          if (!id) return false;
          const o = prev.find(p => (p.id || p._id) === id);
          return o && JSON.stringify(o) !== JSON.stringify(r);
        });
        added.forEach(r => {
          // Auto-add type for categories
          let body = {
            ...r
          };
          if (endpoint === 'categories') {
            if (key.includes('type=sale')) body.type = 'sale';else if (key.includes('type=expense')) body.type = 'expense';else if (key.includes('type=payment')) body.type = 'payment';
          }
          fetch('/api/' + endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          }).catch(e => console.error('API add error', e));
        });
        removed.forEach(r => {
          fetch('/api/' + endpoint + '/' + (r.id || r._id), {
            method: 'DELETE',
            headers
          }).catch(e => console.error('API delete error', e));
        });
        edited.forEach(r => {
          fetch('/api/' + endpoint + '/' + (r.id || r._id), {
            method: 'PUT',
            headers,
            body: JSON.stringify(r)
          }).catch(e => console.error('API edit error', e));
        });
      }
      return val;
    });
  };
  const addLog = useCallback(async (user, action, detail, type = "info") => {
    const logEntry = mkLog(user, action, detail, type);
    setActLog(prev => {
      const next = [logEntry, ...prev].slice(0, 500);
      return next;
    });
    // Send to API
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(logEntry)
      });
    } catch (e) {
      console.error('Error saving log:', e);
    }
  }, []);
  const toggleTheme = () => {
    const v = !dark;
    setDark(v);
    localStorage.setItem('theme', JSON.stringify(v));
  };

  // Auto refresh ทุก 30 วินาที
  useEffect(() => {
    if (!me) return;
    const interval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      try {
        const [s, e, pay, dr, al] = await Promise.all([fetch('/api/sales', {
          headers
        }).then(r => r.ok ? r.json() : null), fetch('/api/expenses', {
          headers
        }).then(r => r.ok ? r.json() : null), fetch('/api/payments', {
          headers
        }).then(r => r.ok ? r.json() : null), fetch('/api/delreqs', {
          headers
        }).then(r => r.ok ? r.json() : null), fetch('/api/logs', {
          headers
        }).then(r => r.ok ? r.json() : null)]);
        const cmp = (a, b) => JSON.stringify(a?.map(x => x.updatedAt || x.id)) === JSON.stringify(b?.map(x => x.updatedAt || x.id));
        if (s) setSales(prev => cmp(prev, s) ? prev : s.map(x => ({
          ...x,
          id: x.id || x._id?.toString()
        })));
        if (e) setExpenses(prev => cmp(prev, e) ? prev : e.map(x => ({
          ...x,
          id: x.id || x._id?.toString()
        })));
        if (pay) setPayments(prev => cmp(prev, pay) ? prev : pay.map(x => ({
          ...x,
          id: x.id || x._id?.toString()
        })));
        if (dr) setDelReqs(prev => cmp(prev, dr) ? prev : dr.map(x => ({
          ...x,
          id: x.id || x._id?.toString()
        })));
        if (al) setActLog(prev => cmp(prev, al) ? prev : al.map(x => ({
          ...x,
          id: x.id || x._id?.toString()
        })));
      } catch (e) {
        console.error('Auto refresh error', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [me]);
  if (!ready) {
    return /*#__PURE__*/_jsxDEV("div", {
      style: {
        minHeight: "100vh",
        background: "#080c14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#00d4ff",
        fontFamily: "sans-serif",
        gap: 12
      },
      children: [/*#__PURE__*/_jsxDEV(BestLogo, {
        height: 32
      }, void 0, false), " กำลังโหลด..."]
    }, void 0, true);
  }
  if (!me) {
    return /*#__PURE__*/_jsxDEV(LoginPage, {
      onLogin: u => {
        setMe(u);
        addLog(u, "เข้าสู่ระบบ", "", "login");
        setTimeout(reloadAll, 500);
      },
      css: buildCSS(dark)
    }, void 0, false);
  }
  const pendingCnt = delReqs.filter(r => r.status === "pending").length;
  const isViewer = me.role === "viewer";
  const activeTab = isViewer ? "dashboard" : tab;

  // Pending badge only for admin/manager (who can action on delete requests)
  const logBadge = canViewDelReqs(me.role) ? pendingCnt : 0;
  const tabs = isViewer ? [{
    k: "dashboard",
    l: "📊 ภาพรวม"
  }] : [{
    k: "dashboard",
    l: "📊 ภาพรวม"
  }, {
    k: "sales",
    l: "💰 ยอดขาย"
  }, {
    k: "payments",
    l: "💳 ยอดชำระเงิน"
  }, {
    k: "expenses",
    l: "📋 ค่าใช้จ่าย"
  }, {
    k: "customers",
    l: "👥 ลูกค้า"
  }, {
    k: "stock",
    l: "📦 StockFlow"
  }, ...(canLog(me.role) ? [{
    k: "log",
    l: "📝 Activity Log",
    badge: logBadge
  }] : []), ...(canManage(me.role) ? [{
    k: "manage",
    l: "📂 หมวดหมู่"
  }] : []), ...(canManageUsers(me.role) ? [{
    k: "users",
    l: "👤 จัดการผู้ใช้งาน"
  }] : [])];
  const css = buildCSS(dark);
  const wrapStyle = mobile ? {
    maxWidth: 390,
    margin: "0 auto",
    border: "1px solid var(--border)",
    minHeight: "100vh"
  } : {};
  return /*#__PURE__*/_jsxDEV("div", {
    className: "app",
    style: wrapStyle,
    children: [/*#__PURE__*/_jsxDEV("style", {
      children: css
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "topbar",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "tbrand",
        children: [/*#__PURE__*/_jsxDEV(BestLogo, {
          height: 34
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          className: "dot"
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          className: "tsysname",
          children: "Sales & Expense Management System"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1
        }
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0
        },
        children: [/*#__PURE__*/_jsxDEV(Clock, {}, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          className: `tbtn${mobile ? " on" : ""}`,
          onClick: () => setMobile(v => !v),
          children: mobile ? "💻 Desktop" : "📱 Mobile"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          className: "tbtn",
          onClick: toggleTheme,
          children: dark ? "☀️ Light" : "🌙 Dark"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "tright",
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "uav",
            style: {
              background: `linear-gradient(135deg,${ROLE_COLOR[me.role]},#005577)`
            },
            children: me.name[0]
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "uinfo",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "uname",
              children: me.name
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "urole",
              children: /*#__PURE__*/_jsxDEV("span", {
                className: `tag tag-${me.role}`,
                children: ROLE_LABEL[me.role]
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          className: "btnout",
          onClick: () => {
            addLog(me, "ออกจากระบบ", "", "logout");
            localStorage.removeItem('token');
            setMe(null);
          },
          children: "ออก"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "navtabs",
      children: tabs.map(t => /*#__PURE__*/_jsxDEV("button", {
        className: `ntab${activeTab === t.k ? " active" : ""}`,
        onClick: () => switchTab(t.k),
        children: [t.l, t.badge > 0 && /*#__PURE__*/_jsxDEV("span", {
          className: "badge",
          children: t.badge
        }, void 0, false)]
      }, t.k, true))
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "main",
      children: [activeTab === "dashboard" && /*#__PURE__*/_jsxDEV(Dashboard, {
        sales: sales,
        expenses: expenses,
        payments: payments,
        sCats: sCats,
        eCats: eCats,
        pCats: pCats
      }, void 0, false), activeTab === "sales" && /*#__PURE__*/_jsxDEV(SalesTab, {
        records: sales,
        cats: sCats,
        user: me,
        onUpdate: r => persist(SK.sales, r, setSales),
        delReqs: delReqs,
        onDelReqUpdate: r => persist(SK.delReqs, r, setDelReqs),
        addLog: addLog,
        payments: payments,
        onPaymentsUpdate: r => persist(SK.payments, r, setPayments),
        pCats: pCats,
        customers: customers,
        sCats: sCats
      }, void 0, false), activeTab === "payments" && /*#__PURE__*/_jsxDEV(PaymentsTab, {
        records: payments,
        cats: pCats,
        user: me,
        onUpdate: r => persist(SK.payments, r, setPayments),
        onCatsUpdate: c => persist(SK.payCats, c, setPCats),
        delReqs: delReqs,
        onDelReqUpdate: r => persist(SK.delReqs, r, setDelReqs),
        addLog: addLog,
        customers: customers
      }, void 0, false), activeTab === "expenses" && /*#__PURE__*/_jsxDEV(ExpensesTab, {
        records: expenses,
        cats: eCats,
        user: me,
        onUpdate: r => persist(SK.expenses, r, setExpenses),
        delReqs: delReqs,
        onDelReqUpdate: r => persist(SK.delReqs, r, setDelReqs),
        addLog: addLog,
        customers: customers
      }, void 0, false), activeTab === "log" && canLog(me.role) && /*#__PURE__*/_jsxDEV(LogTab, {
        actLog: actLog,
        delReqs: delReqs,
        sales: sales,
        expenses: expenses,
        payments: payments,
        onDelReqUpdate: r => persist(SK.delReqs, r, setDelReqs),
        onSalesUpdate: r => persist(SK.sales, r, setSales),
        onExpUpdate: r => persist(SK.expenses, r, setExpenses),
        onPayUpdate: r => persist(SK.payments, r, setPayments),
        onActLogUpdate: r => persist(SK.actLog, r, setActLog),
        user: me,
        addLog: addLog,
        trash: trash,
        setTrash: setTrash,
        reloadSales: async () => {
          const r = await fetch('/api/sales', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          if (r.ok) {
            const d = await r.json();
            setSales(d.map(x => ({
              ...x,
              id: x.id || x._id?.toString()
            })));
          }
        },
        reloadExpenses: async () => {
          const r = await fetch('/api/expenses', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          if (r.ok) {
            const d = await r.json();
            setExpenses(d.map(x => ({
              ...x,
              id: x.id || x._id?.toString()
            })));
          }
        },
        reloadPayments: async () => {
          const r = await fetch('/api/payments', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          if (r.ok) {
            const d = await r.json();
            setPayments(d.map(x => ({
              ...x,
              id: x.id || x._id?.toString()
            })));
          }
        }
      }, void 0, false), activeTab === "customers" && /*#__PURE__*/_jsxDEV(CustomersTab, {
        customers: customers,
        sales: sales,
        expenses: expenses,
        payments: payments,
        sCats: sCats,
        eCats: eCats
      }, void 0, false), activeTab === "stock" && /*#__PURE__*/_jsxDEV("div", {
        style: {
          padding: 20,
          textAlign: "center"
        },
        children: /*#__PURE__*/_jsxDEV("iframe", {
          src: "/stockflow.html",
          style: {
            width: "100%",
            height: "calc(100vh - 180px)",
            border: "none",
            borderRadius: 8
          },
          title: "StockFlow"
        }, void 0, false)
      }, void 0, false), activeTab === "manage" && canManage(me.role) && /*#__PURE__*/_jsxDEV(ManageTab, {
        sCats: sCats,
        onSCatsUpdate: s => persist(SK.saleCats, s, setSCats),
        eCats: eCats,
        onECatsUpdate: e => persist(SK.expCats, e, setECats),
        pCats: pCats,
        onPCatsUpdate: p => persist(SK.payCats, p, setPCats),
        customers: customers,
        onCustomersUpdate: c => persist(SK.customers, c, setCustomers),
        addLog: addLog,
        user: me
      }, void 0, false), activeTab === "users" && canManageUsers(me.role) && /*#__PURE__*/_jsxDEV("div", {
        children: /*#__PURE__*/_jsxDEV(UsersPanel, {
          users: users,
          onUpdate: u => persist(SK.users, u, setUsers),
          addLog: addLog,
          me: me
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
  css
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!u || !p) {
      setErr("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: u,
          password: p
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      }
    } catch (e) {
      setErr("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
    setLoading(false);
  };
  return /*#__PURE__*/_jsxDEV("div", {
    className: "lwrap",
    children: [/*#__PURE__*/_jsxDEV("style", {
      children: css
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "lbox",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "llogo",
        children: [/*#__PURE__*/_jsxDEV(BestLogo, {
          height: 52
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "llogo-sub",
          style: {
            marginTop: 6
          },
          children: "Sales & Expense Management System"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fg",
        children: [/*#__PURE__*/_jsxDEV("label", {
          children: "ชื่อผู้ใช้"
        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
          value: u,
          onChange: e => {
            setU(e.target.value);
            setErr("");
          },
          onKeyDown: e => e.key === "Enter" && go(),
          placeholder: "username",
          disabled: loading
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fg",
        children: [/*#__PURE__*/_jsxDEV("label", {
          children: "รหัสผ่าน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
          type: "password",
          value: p,
          onChange: e => {
            setP(e.target.value);
            setErr("");
          },
          onKeyDown: e => e.key === "Enter" && go(),
          placeholder: "password",
          disabled: loading
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
        className: "btnprim",
        onClick: go,
        disabled: loading,
        children: loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"
      }, void 0, false), err && /*#__PURE__*/_jsxDEV("div", {
        className: "lerr",
        children: err
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({
  sales,
  expenses,
  payments,
  sCats,
  eCats,
  pCats
}) {
  const all = [...sales, ...expenses, ...payments];
  const {
    mode,
    setMode,
    sel,
    setSel,
    opts
  } = usePeriod(all);
  const fS = filterPeriod(sales, mode, sel);
  const fE = filterPeriod(expenses, mode, sel);
  const fP = filterPeriod(payments, mode, sel);
  const totS = fS.reduce((a, r) => a + (r.amount || 0), 0);
  const totE = fE.reduce((a, r) => a + (r.amount || 0), 0);
  const totP = fP.reduce((a, r) => a + (r.amount || 0), 0);
  // กำไรสุทธิ = ยอดชำระเงิน - ค่าใช้จ่าย
  const profit = totP - totE;
  const margin = totP > 0 ? (profit / totP * 100).toFixed(1) : 0;
  // ยอดรอออก (INV) = ยอดขาย - ยอดชำระ
  const outstanding = totS - totP;

  // Trend
  const tmap = {};
  [...sales, ...expenses, ...payments].forEach(r => {
    const m = getMonth(r.date);
    if (!tmap[m]) tmap[m] = {
      month: m,
      sales: 0,
      expenses: 0,
      payments: 0,
      profit: 0
    };
  });
  sales.forEach(r => {
    if (tmap[getMonth(r.date)]) tmap[getMonth(r.date)].sales += r.amount || 0;
  });
  expenses.forEach(r => {
    if (tmap[getMonth(r.date)]) tmap[getMonth(r.date)].expenses += r.amount || 0;
  });
  payments.forEach(r => {
    if (tmap[getMonth(r.date)]) tmap[getMonth(r.date)].payments += r.amount || 0;
  });
  Object.values(tmap).forEach(d => {
    d.profit = d.payments - d.expenses;
  });
  const trend = Object.values(tmap).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  const sBar = sCats.map(c => ({
    name: c.label,
    total: fS.filter(r => (c.items || []).find(i => i.id === r.itemId) || r.categoryId === c.id).reduce((a, r) => a + (r.amount || 0), 0),
    color: c.color
  }));
  const eBar = eCats.map(c => ({
    name: c.label,
    total: fE.filter(r => r.categoryId === c.id).reduce((a, r) => a + (r.amount || 0), 0),
    color: c.color
  }));

  // Pie 1: วงทั้งหมด = ยอดขายรวม (PO) → ยอดชำระแล้ว vs ยอดรอออก (INV)
  const pie1Data = totS > 0 ? [{
    name: "ยอดชำระแล้ว",
    value: Math.min(totP, totS),
    color: "#a29bfe"
  }, {
    name: "ยอดรอออก (INV)",
    value: Math.max(outstanding, 0),
    color: "#ffd32a"
  }] : [{
    name: "ยังไม่มีข้อมูล",
    value: 1,
    color: "#2d3748"
  }];

  // Pie 2: วงทั้งหมด = ยอดชำระ → ค่าใช้จ่าย vs กำไร
  const pie2Data = totP > 0 ? [{
    name: "ค่าใช้จ่าย",
    value: Math.min(totE, totP),
    color: "#ff6b35"
  }, {
    name: "กำไรสุทธิ",
    value: Math.max(profit, 0),
    color: "#00e676"
  }] : [{
    name: "ยังไม่มีข้อมูล",
    value: 1,
    color: "#2d3748"
  }];
  const sGroups = sCats.map(c => ({
    ...c,
    total: fS.filter(r => (c.items || []).find(i => i.id === r.itemId) || r.categoryId === c.id).reduce((a, r) => a + (r.amount || 0), 0)
  }));
  const eGroups = eCats.map(c => ({
    ...c,
    total: fE.filter(r => r.categoryId === c.id).reduce((a, r) => a + (r.amount || 0), 0)
  }));
  const pGroups = pCats.map(c => ({
    ...c,
    total: fP.filter(r => (c.items || []).find(i => i.id === r.itemId) || r.categoryId === c.id).reduce((a, r) => a + (r.amount || 0), 0)
  }));
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV(PBar, {
      mode: mode,
      setMode: setMode,
      sel: sel,
      setSel: setSel,
      opts: opts
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "sgrid",
      children: [{
        l: "ยอดขายรวม (PO)",
        v: fmt(totS),
        u: "บาท",
        c: "#00d4ff"
      }, {
        l: "ยอดชำระเงินรวม (INV)",
        v: fmt(totP),
        u: "บาท",
        c: "#a29bfe"
      }, {
        l: "ยอดรอออก (INV)",
        v: fmt(outstanding),
        u: "บาท",
        c: outstanding > 0 ? "#ffd32a" : "#00e676"
      }, {
        l: "ค่าใช้จ่ายรวม (PO)",
        v: fmt(totE),
        u: "บาท",
        c: "#ff6b35"
      }, {
        l: "กำไรสุทธิ",
        v: fmt(profit),
        u: "ยอดชำระ (INV) - ค่าใช้จ่าย (PO)",
        c: profit >= 0 ? "#00e676" : "#ff4757"
      }, {
        l: "Gross Margin",
        v: `${margin}%`,
        u: "กำไร / ยอดชำระ (INV)",
        c: "#ffd32a"
      }].map(c => /*#__PURE__*/_jsxDEV("div", {
        className: "scard",
        style: {
          "--ca": c.c
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "slabel",
          children: c.l
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "sval",
          style: {
            color: c.c
          },
          children: c.v
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "sunit",
          children: c.u
        }, void 0, false)]
      }, c.l, true))
    }, void 0, false), trend.length > 1 && /*#__PURE__*/_jsxDEV("div", {
      className: "chwrap",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "chtitle",
        children: "📈 แนวโน้มรายเดือน (12 เดือนล่าสุด)"
      }, void 0, false), /*#__PURE__*/_jsxDEV(ResponsiveContainer, {
        width: "100%",
        height: 220,
        children: /*#__PURE__*/_jsxDEV(LineChart, {
          data: trend,
          margin: {
            top: 4,
            right: 16,
            left: 0,
            bottom: 4
          },
          children: [/*#__PURE__*/_jsxDEV(CartesianGrid, {
            strokeDasharray: "3 3",
            stroke: "var(--border)"
          }, void 0, false), /*#__PURE__*/_jsxDEV(XAxis, {
            dataKey: "month",
            tick: {
              fill: "var(--text2)",
              fontSize: 10
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV(YAxis, {
            tick: {
              fill: "var(--text2)",
              fontSize: 10
            },
            tickFormatter: v => `${(v / 1000).toFixed(0)}K`
          }, void 0, false), /*#__PURE__*/_jsxDEV(Tooltip, {
            content: /*#__PURE__*/_jsxDEV(CTip, {}, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV(Legend, {
            wrapperStyle: {
              fontSize: 11,
              color: "var(--text2)"
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV(Line, {
            type: "monotone",
            dataKey: "sales",
            name: "ยอดขาย",
            stroke: "#00d4ff",
            strokeWidth: 2,
            dot: {
              r: 2
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV(Line, {
            type: "monotone",
            dataKey: "payments",
            name: "ยอดชำระ",
            stroke: "#a29bfe",
            strokeWidth: 2,
            dot: {
              r: 2
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV(Line, {
            type: "monotone",
            dataKey: "expenses",
            name: "ค่าใช้จ่าย",
            stroke: "#ff6b35",
            strokeWidth: 2,
            dot: {
              r: 2
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV(Line, {
            type: "monotone",
            dataKey: "profit",
            name: "กำไร",
            stroke: "#00e676",
            strokeWidth: 2,
            strokeDasharray: "4 2",
            dot: {
              r: 2
            }
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        marginBottom: 16
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "chwrap",
        style: {
          margin: 0
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "chtitle",
          children: "📊 ยอดขายตามหมวดหมู่"
        }, void 0, false), /*#__PURE__*/_jsxDEV(ResponsiveContainer, {
          width: "100%",
          height: 160,
          children: /*#__PURE__*/_jsxDEV(BarChart, {
            data: sBar,
            margin: {
              top: 4,
              right: 6,
              left: 0,
              bottom: 4
            },
            children: [/*#__PURE__*/_jsxDEV(CartesianGrid, {
              strokeDasharray: "3 3",
              stroke: "var(--border)"
            }, void 0, false), /*#__PURE__*/_jsxDEV(XAxis, {
              dataKey: "name",
              interval: 0,
              tick: /*#__PURE__*/_jsxDEV(CustomBarTick, {}, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV(YAxis, {
              tick: {
                fill: "var(--text2)",
                fontSize: 9
              },
              tickFormatter: v => `${(v / 1000).toFixed(0)}K`
            }, void 0, false), /*#__PURE__*/_jsxDEV(Tooltip, {
              content: /*#__PURE__*/_jsxDEV(CTip, {}, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV(Bar, {
              dataKey: "total",
              name: "ยอดขาย",
              radius: [3, 3, 0, 0],
              children: sBar.map((entry, index) => /*#__PURE__*/_jsxDEV(Cell, {
                fill: entry.color || "#00d4ff"
              }, index, false))
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "chwrap",
        style: {
          margin: 0
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "chtitle",
          children: "📊 ค่าใช้จ่ายตามหมวดหมู่"
        }, void 0, false), /*#__PURE__*/_jsxDEV(ResponsiveContainer, {
          width: "100%",
          height: 160,
          children: /*#__PURE__*/_jsxDEV(BarChart, {
            data: eBar,
            margin: {
              top: 4,
              right: 6,
              left: 0,
              bottom: 4
            },
            children: [/*#__PURE__*/_jsxDEV(CartesianGrid, {
              strokeDasharray: "3 3",
              stroke: "var(--border)"
            }, void 0, false), /*#__PURE__*/_jsxDEV(XAxis, {
              dataKey: "name",
              interval: 0,
              tick: /*#__PURE__*/_jsxDEV(CustomBarTick, {}, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV(YAxis, {
              tick: {
                fill: "var(--text2)",
                fontSize: 9
              },
              tickFormatter: v => `${(v / 1000).toFixed(0)}K`
            }, void 0, false), /*#__PURE__*/_jsxDEV(Tooltip, {
              content: /*#__PURE__*/_jsxDEV(CTip, {}, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV(Bar, {
              dataKey: "total",
              name: "ค่าใช้จ่าย",
              radius: [3, 3, 0, 0],
              children: eBar.map((entry, index) => /*#__PURE__*/_jsxDEV(Cell, {
                fill: entry.color || "#ff6b35"
              }, index, false))
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        marginBottom: 16
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "chwrap",
        style: {
          margin: 0
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "chtitle",
          children: "🥧 ยอดชำระแล้ว vs ยอดรอออก (INV) (จากยอดขายรวม (PO))"
        }, void 0, false), /*#__PURE__*/_jsxDEV(ResponsiveContainer, {
          width: "100%",
          height: 220,
          children: /*#__PURE__*/_jsxDEV(PieChart, {
            children: [/*#__PURE__*/_jsxDEV(Pie, {
              data: pie1Data,
              cx: "50%",
              cy: "50%",
              innerRadius: 45,
              outerRadius: 68,
              paddingAngle: 3,
              dataKey: "value",
              children: pie1Data.map((e, i) => /*#__PURE__*/_jsxDEV(Cell, {
                fill: e.color
              }, i, false))
            }, void 0, false), /*#__PURE__*/_jsxDEV(Tooltip, {
              formatter: v => `${fmt(v)} ฿`
            }, void 0, false), /*#__PURE__*/_jsxDEV(Legend, {
              wrapperStyle: {
                fontSize: 10,
                color: "var(--text2)"
              }
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            textAlign: "center",
            fontSize: 10,
            color: "var(--text2)",
            marginTop: 2
          },
          children: ["วงทั้งหมด = ยอดขายรวม (PO) ", fmt(totS), " ฿"]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "chwrap",
        style: {
          margin: 0
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "chtitle",
          children: "🥧 ค่าใช้จ่าย vs กำไรสุทธิ (จากยอดชำระเงินรวม (INV))"
        }, void 0, false), /*#__PURE__*/_jsxDEV(ResponsiveContainer, {
          width: "100%",
          height: 220,
          children: /*#__PURE__*/_jsxDEV(PieChart, {
            children: [/*#__PURE__*/_jsxDEV(Pie, {
              data: pie2Data,
              cx: "50%",
              cy: "50%",
              innerRadius: 45,
              outerRadius: 68,
              paddingAngle: 3,
              dataKey: "value",
              children: pie2Data.map((e, i) => /*#__PURE__*/_jsxDEV(Cell, {
                fill: e.color
              }, i, false))
            }, void 0, false), /*#__PURE__*/_jsxDEV(Tooltip, {
              formatter: v => `${fmt(v)} ฿`
            }, void 0, false), /*#__PURE__*/_jsxDEV(Legend, {
              wrapperStyle: {
                fontSize: 10,
                color: "var(--text2)"
              }
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            textAlign: "center",
            fontSize: 10,
            color: "var(--text2)",
            marginTop: 2
          },
          children: ["วงทั้งหมด = ยอดชำระเงินรวม (INV) ", fmt(totP), " ฿"]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: "#00d4ff"
              }
            }, void 0, false), "สรุปยอดขาย"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: "#00d4ff"
            },
            children: [fmt(totS), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            padding: 14
          },
          children: sGroups.map(c => /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginBottom: 12
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                justifyContent: "space-between"
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  fontWeight: 600,
                  color: c.color
                },
                children: c.label
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontFamily: "Rajdhani",
                  fontWeight: 700,
                  fontSize: 13
                },
                children: [fmt(c.total), " ฿"]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "pgbar",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "pgfill",
                style: {
                  width: totS > 0 ? `${c.total / totS * 100}%` : "0%",
                  background: c.color
                }
              }, void 0, false)
            }, void 0, false)]
          }, c.id, true))
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: "#ff6b35"
              }
            }, void 0, false), "สรุปค่าใช้จ่าย"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: "#ff6b35"
            },
            children: [fmt(totE), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            padding: 14
          },
          children: eGroups.map(c => /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginBottom: 10
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                justifyContent: "space-between"
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  color: c.color
                },
                children: c.label
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontFamily: "Rajdhani",
                  fontWeight: 600,
                  fontSize: 13
                },
                children: [fmt(c.total), " ฿"]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "pgbar",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "pgfill",
                style: {
                  width: totE > 0 ? `${c.total / totE * 100}%` : "0%",
                  background: c.color
                }
              }, void 0, false)
            }, void 0, false)]
          }, c.id, true))
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "sec",
      style: {
        marginTop: 14
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "shead",
        children: [/*#__PURE__*/_jsxDEV("span", {
          className: "stitle",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "sdot",
            style: {
              background: "#a29bfe"
            }
          }, void 0, false), "สรุปยอดชำระเงิน"]
        }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontFamily: "Rajdhani",
            fontWeight: 700,
            color: "#a29bfe"
          },
          children: [fmt(totP), " ฿"]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          padding: 14
        },
        children: [pGroups.length === 0 && /*#__PURE__*/_jsxDEV("div", {
          className: "empty",
          children: "ยังไม่มีข้อมูลยอดชำระ"
        }, void 0, false), pGroups.map(c => /*#__PURE__*/_jsxDEV("div", {
          style: {
            marginBottom: 10
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              justifyContent: "space-between"
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 12,
                fontWeight: 600,
                color: c.color
              },
              children: c.label
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontFamily: "Rajdhani",
                fontWeight: 700,
                fontSize: 13
              },
              children: [fmt(c.total), " ฿"]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "pgbar",
            children: /*#__PURE__*/_jsxDEV("div", {
              className: "pgfill",
              style: {
                width: totP > 0 ? `${c.total / totP * 100}%` : "0%",
                background: c.color
              }
            }, void 0, false)
          }, void 0, false)]
        }, c.id, true))]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}

// ─── DATE INPUT (แสดง DD/MM/YYYY พิมพ์ได้ + calendar picker) ─────────────────
function DateInput({
  value,
  onChange,
  className
}) {
  const [text, setText] = useState(value ? fmtDate(value) : "");
  useEffect(() => {
    setText(value ? fmtDate(value) : "");
  }, [value]);
  const handleText = v => {
    setText(v);
    // auto-convert when complete DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
      const [d, m, y] = v.split("/");
      const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      if (!isNaN(new Date(iso))) onChange(iso);
    }
  };
  const handlePicker = v => {
    onChange(v);
    setText(fmtDate(v));
  };
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    children: [/*#__PURE__*/_jsxDEV("input", {
      className: className || "fi",
      value: text,
      onChange: e => handleText(e.target.value),
      placeholder: "DD/MM/YYYY",
      maxLength: 10,
      style: {
        paddingRight: 32
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
      type: "date",
      value: value || "",
      onChange: e => handlePicker(e.target.value),
      style: {
        position: "absolute",
        right: 6,
        width: 20,
        height: 20,
        opacity: 0,
        cursor: "pointer"
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
      style: {
        position: "absolute",
        right: 8,
        color: "var(--text3)",
        pointerEvents: "none",
        fontSize: 13
      },
      children: "📅"
    }, void 0, false)]
  }, void 0, true);
}

// ─── JOB PICKER (dropdown + free-type combo) ─────────────────────────────────
function JobPicker({
  value,
  onChange,
  jobOptions
}) {
  // jobOptions = [{id, label (jobNo label)}] — already filtered by selected customer
  if (!jobOptions || jobOptions.length === 0) return null;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    },
    children: [/*#__PURE__*/_jsxDEV("select", {
      className: "fsel",
      style: {
        flex: 1
      },
      value: value,
      onChange: e => onChange(e.target.value),
      children: [/*#__PURE__*/_jsxDEV("option", {
        value: "",
        children: "— เลือก Job งาน —"
      }, void 0, false), jobOptions.map(j => /*#__PURE__*/_jsxDEV("option", {
        value: j.label,
        children: j.label
      }, j.id, false))]
    }, void 0, true), value && /*#__PURE__*/_jsxDEV("button", {
      type: "button",
      onClick: () => onChange(""),
      style: {
        padding: "8px 10px",
        background: "rgba(255,71,87,.08)",
        border: "1px solid rgba(255,71,87,.25)",
        borderRadius: 7,
        color: "var(--red)",
        fontSize: 12,
        cursor: "pointer",
        whiteSpace: "nowrap"
      },
      children: "✕ ล้าง"
    }, void 0, false)]
  }, void 0, true);
}

// ─── RECORD MODAL ──────────────────────────────────────────────────────────────
function RecModal({
  title,
  cats,
  record,
  onSave,
  onClose,
  type,
  customers
}) {
  const allItems = type === "sale" ? cats.flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  }))) : [];
  const allSubs = type === "expense" ? cats.flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  }))) : [];
  // Flatten: each customer × each Job → one entry with jobNo = job.label
  const allCusts = (customers || []).flatMap(g => (g.items || []).flatMap(c => (c.jobs || []).length > 0 ? (c.jobs || []).map(j => ({
    ...c,
    jobNo: j.label,
    jobId: j.id,
    groupLabel: g.label,
    groupColor: g.color
  })) : c.jobNo ? [{
    ...c,
    groupLabel: g.label,
    groupColor: g.color
  }] : []));
  const [form, setForm] = useState({
    date: record?.date || todayISO(),
    categoryId: record?.categoryId || cats[0]?.id || "",
    itemId: record?.itemId || "",
    subItemId: record?.subItemId || "",
    description: record?.description || "",
    amount: record?.amount || "",
    note: record?.note || "",
    jobNo: record?.jobNo || "",
    customerId: record?.customerId || "",
    id: record?.id,
    createdBy: record?.createdBy
  });
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const catItems = allItems.filter(i => i.catId === form.categoryId);
  const catSubs = allSubs.filter(i => i.catId === form.categoryId);
  const onCustChange = custId => {
    set("customerId", custId);
    set("jobNo", ""); // clear job when customer changes
  };
  // Compute job options for selected customer
  const selectedCustRaw = (customers || []).flatMap(g => g.items || []).find(c => c.id === form.customerId);
  const jobOptions = selectedCustRaw ? (selectedCustRaw.jobs || []).length > 0 ? selectedCustRaw.jobs : selectedCustRaw.jobNo ? [{
    id: "_j",
    label: selectedCustRaw.jobNo
  }] : [] : [];
  return /*#__PURE__*/_jsxDEV("div", {
    className: "ov",
    onClick: onClose,
    children: /*#__PURE__*/_jsxDEV("div", {
      className: "modal",
      onClick: e => e.stopPropagation(),
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "mtitle",
        children: record ? `แก้ไข${title}` : `เพิ่ม${title}`
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "fr2",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "วันที่"
          }, void 0, false), /*#__PURE__*/_jsxDEV(DateInput, {
            value: form.date,
            onChange: v => set("date", v)
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "จำนวนเงิน (฿)"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            type: "number",
            value: form.amount,
            onChange: e => set("amount", parseFloat(e.target.value) || ""),
            placeholder: "0.00"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "หมวดหมู่"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.categoryId,
          onChange: e => {
            set("categoryId", e.target.value);
            set("itemId", "");
            set("subItemId", "");
          },
          children: cats.map(c => /*#__PURE__*/_jsxDEV("option", {
            value: c.id,
            children: c.label
          }, c.id, false))
        }, void 0, false)]
      }, void 0, true), type === "sale" && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "รายการ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.itemId,
          onChange: e => set("itemId", e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "-- เลือกรายการ --"
          }, void 0, false), catItems.map(i => /*#__PURE__*/_jsxDEV("option", {
            value: i.id,
            children: i.label
          }, i.id, false))]
        }, void 0, true)]
      }, void 0, true), type === "expense" && catSubs.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "รายการย่อย"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.subItemId,
          onChange: e => set("subItemId", e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "-- เลือกรายการย่อย (ไม่บังคับ) --"
          }, void 0, false), catSubs.map(i => /*#__PURE__*/_jsxDEV("option", {
            value: i.id,
            children: i.label
          }, i.id, false))]
        }, void 0, true)]
      }, void 0, true), type === "expense" && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "รายละเอียด"
        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
          className: "fi",
          value: form.description,
          onChange: e => set("description", e.target.value),
          placeholder: "รายละเอียด"
        }, void 0, false)]
      }, void 0, true), allCusts.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: ["👤 ลูกค้า ", /*#__PURE__*/_jsxDEV("span", {
            style: {
              color: "var(--text3)",
              fontWeight: 400
            },
            children: "(เลือกก่อนเพื่อเลือก Job งาน)"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.customerId,
          onChange: e => onCustChange(e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "-- เลือกลูกค้า --"
          }, void 0, false), (customers || []).map(g => /*#__PURE__*/_jsxDEV("optgroup", {
            label: g.label,
            children: (g.items || []).map(c => /*#__PURE__*/_jsxDEV("option", {
              value: c.id,
              children: c.label
            }, c.id, false))
          }, g.id, false))]
        }, void 0, true)]
      }, void 0, true), form.customerId && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "เลข Job งาน"
        }, void 0, false), jobOptions.length > 0 ? /*#__PURE__*/_jsxDEV(JobPicker, {
          value: form.jobNo,
          onChange: v => set("jobNo", v),
          jobOptions: jobOptions
        }, void 0, false) : /*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 12,
            color: "var(--text3)",
            padding: "6px 0"
          },
          children: "ลูกค้านี้ยังไม่มี Job — กรุณาเพิ่มใน 📂 หมวดหมู่ › ลูกค้า"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "หมายเหตุ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
          className: "fi",
          value: form.note,
          onChange: e => set("note", e.target.value),
          placeholder: "ไม่บังคับ"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "mact",
        children: [/*#__PURE__*/_jsxDEV("button", {
          className: "btncancel",
          onClick: onClose,
          children: "ยกเลิก"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          className: "btnsave",
          onClick: () => onSave(form),
          children: "บันทึก"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)
  }, void 0, false);
}

// ─── PAYMENTS TAB ─────────────────────────────────────────────────────────────
function PaymentsTab({
  records,
  cats,
  user,
  onUpdate,
  onCatsUpdate,
  delReqs,
  onDelReqUpdate,
  addLog,
  customers
}) {
  const {
    mode,
    setMode,
    sel,
    setSel,
    opts
  } = usePeriod(records);
  const [show, setShow] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [jobFilter, setJobFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [custFilter, setCustFilter] = useState("");
  const filtered = filterPeriod(records, mode, sel);
  const allItems = cats.flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  })));
  const pendIds = new Set(delReqs.filter(r => r.status === "pending" && r.type === "payment").map(r => r.recordId));
  const allJobs = [...new Set(filtered.filter(r => r.jobNo).map(r => r.jobNo))].sort();
  const jobFiltered = filtered.filter(r => {
    if (jobFilter && r.jobNo !== jobFilter) return false;
    if (custFilter && r.customerId !== custFilter) return false;
    if (groupFilter && !custFilter) {
      const grp = (customers || []).find(g => g.id === groupFilter);
      const custIds = (grp?.items || []).map(c => c.id);
      if (custIds.length > 0 && !custIds.includes(r.customerId)) return false;
    }
    return true;
  });
  const total = jobFiltered.reduce((a, r) => a + (r.amount || 0), 0);
  const handleExport = () => {
    const rows = jobFiltered.map(r => ({
      "วันที่": fmtDate(r.date),
      "รายการ": r.saleItemLabel || allItems.find(i => i.id === r.itemId)?.label || r.description || "-",
      "ลูกค้า": resolveCustomer(r, customers),
      "Job งาน": r.jobNo || "-",
      "จำนวนเงิน (฿)": r.amount || 0,
      "ที่มา": r.fromSaleId ? "จากยอดขาย" : "บันทึกเอง",
      "หมายเหตุ": r.note || "-"
    }));
    exportCSV(rows, `ยอดชำระ_${new Date().toISOString().slice(0, 10)}.csv`);
  };
  const onSave = rec => {
    const lbl = allItems.find(i => i.id === rec.itemId)?.label || "-";
    if (editRec) {
      onUpdate(records.map(r => r.id === rec.id ? rec : r));
      addLog(user, "แก้ไขยอดชำระเงิน", `${lbl} ${fmt(rec.amount)} ฿`, "edit");
    } else {
      onUpdate([...records, {
        ...rec,
        id: Date.now().toString(),
        createdBy: user.id
      }]);
      addLog(user, "เพิ่มยอดชำระเงิน", `${lbl} ${fmt(rec.amount)} ฿`, "add");
    }
    setShow(false);
    setEditRec(null);
  };
  const reqDel = rec => {
    const lbl = allItems.find(i => i.id === rec.itemId)?.label || "-";
    const req = {
      id: Date.now().toString(),
      type: "payment",
      recordId: rec.id,
      requestedBy: user.id,
      requestedByName: user.name,
      status: "pending",
      detail: `${lbl} ${fmt(rec.amount)} ฿ (${fmtDate(rec.date)})`,
      time: nowStr()
    };
    onDelReqUpdate([...delReqs, req]);
    addLog(user, "ขอลบยอดชำระเงิน", req.detail, "delete_req");
  };
  const doDel = id => {
    onUpdate(records.filter(r => r.id !== id));
    addLog(user, "ลบยอดชำระเงิน", `id:${id}`, "delete");
  };
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV(PBar, {
      mode: mode,
      setMode: setMode,
      sel: sel,
      setSel: setSel,
      opts: opts
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 12
      },
      children: [/*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setEditRec(null);
          setShow(true);
        },
        children: "+ เพิ่มยอดชำระเงิน"
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        className: "btn-export",
        onClick: handleExport,
        children: "⬇ Export CSV"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV(JobFilterBar, {
      jobs: allJobs,
      customers: customers,
      jobFilter: jobFilter,
      setJobFilter: setJobFilter,
      groupFilter: groupFilter,
      setGroupFilter: setGroupFilter,
      custFilter: custFilter,
      setCustFilter: setCustFilter
    }, void 0, false), cats.map(cat => {
      const items = cat.items || [];
      const catRecs = jobFiltered.filter(r => items.find(i => i.id === r.itemId) || r.categoryId === cat.id);
      const catTot = catRecs.reduce((a, r) => a + (r.amount || 0), 0);
      return /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: cat.color
              }
            }, void 0, false), cat.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: cat.color
            },
            children: [fmt(catTot), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "ลูกค้า"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "Job งาน"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "วันที่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "จำนวนเงิน (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "หมายเหตุ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {}, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: [catRecs.length === 0 && /*#__PURE__*/_jsxDEV("tr", {
              children: /*#__PURE__*/_jsxDEV("td", {
                colSpan: 5,
                className: "empty",
                children: "ไม่มีข้อมูล"
              }, void 0, false)
            }, void 0, false), catRecs.map(r => {
              const item = allItems.find(i => i.id === r.itemId);
              const isPend = pendIds.has(r.id);
              return /*#__PURE__*/_jsxDEV("tr", {
                className: isPend ? "pendrow" : "",
                children: [/*#__PURE__*/_jsxDEV("td", {
                  children: [r.saleItemLabel || item?.label || r.description || "-", r.fromSaleId && /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 10,
                      marginLeft: 5,
                      color: "var(--green)",
                      background: "rgba(0,230,118,.1)",
                      border: "1px solid rgba(0,230,118,.2)",
                      borderRadius: 3,
                      padding: "1px 5px"
                    },
                    children: "จากยอดขาย"
                  }, void 0, false), isPend && /*#__PURE__*/_jsxDEV("span", {
                    className: "pbadge",
                    children: "รอลบ"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    fontSize: 11,
                    color: "var(--text2)"
                  },
                  children: resolveCustomer(r, customers)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
                    className: "job-badge",
                    children: r.jobNo
                  }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      color: "var(--text3)",
                      fontSize: 11
                    },
                    children: "-"
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    color: "var(--text2)",
                    fontSize: 11
                  },
                  children: fmtDate(r.date)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  style: {
                    color: "#a29bfe"
                  },
                  children: fmt(r.amount)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    color: "var(--text2)",
                    fontSize: 11
                  },
                  children: r.note || "-"
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    display: "flex",
                    gap: 3
                  },
                  children: [!isPend && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    onClick: () => {
                      setEditRec(r);
                      setShow(true);
                    },
                    children: "✏️"
                  }, void 0, false), !isPend && canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    onClick: () => doDel(r.id),
                    children: "🗑️"
                  }, void 0, false), !isPend && !canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    title: "ขอลบ",
                    onClick: () => reqDel(r),
                    children: "🔔"
                  }, void 0, false)]
                }, void 0, true)]
              }, r.id, true);
            }), catRecs.length > 0 && /*#__PURE__*/_jsxDEV("tr", {
              className: "tot",
              children: [/*#__PURE__*/_jsxDEV("td", {
                colSpan: 4,
                children: "รวม"
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                children: fmt(catTot)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)]
      }, cat.id, true);
    }), /*#__PURE__*/_jsxDEV("div", {
      style: {
        textAlign: "right",
        padding: "10px 0",
        fontFamily: "Rajdhani",
        fontSize: 16,
        fontWeight: 700,
        color: "#a29bfe"
      },
      children: ["รวมยอดชำระเงิน: ", fmt(total), " ฿"]
    }, void 0, true), show && /*#__PURE__*/_jsxDEV(PayRecModal, {
      cats: cats,
      record: editRec,
      onSave: onSave,
      onClose: () => {
        setShow(false);
        setEditRec(null);
      },
      customers: customers
    }, void 0, false), showCatMgr && /*#__PURE__*/_jsxDEV(PayCatModal, {
      cats: cats,
      onUpdate: onCatsUpdate,
      onClose: () => setShowCatMgr(false),
      addLog: addLog,
      user: user
    }, void 0, false)]
  }, void 0, true);
}
function PayRecModal({
  cats,
  record,
  onSave,
  onClose,
  customers
}) {
  const allItems = cats.flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  })));
  // Flatten: each customer × each Job → one entry with jobNo = job.label
  const allCusts = (customers || []).flatMap(g => (g.items || []).flatMap(c => (c.jobs || []).length > 0 ? (c.jobs || []).map(j => ({
    ...c,
    jobNo: j.label,
    jobId: j.id,
    groupLabel: g.label,
    groupColor: g.color
  })) : c.jobNo ? [{
    ...c,
    groupLabel: g.label,
    groupColor: g.color
  }] : []));
  const [form, setForm] = useState({
    date: record?.date || todayISO(),
    categoryId: record?.categoryId || cats[0]?.id || "",
    itemId: record?.itemId || "",
    amount: record?.amount || "",
    note: record?.note || "",
    jobNo: record?.jobNo || "",
    customerId: record?.customerId || "",
    id: record?.id,
    createdBy: record?.createdBy
  });
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const onCustChangePay = custId => {
    set("customerId", custId);
    set("jobNo", "");
  };
  const selectedCustRawPay = (customers || []).flatMap(g => g.items || []).find(c => c.id === form.customerId);
  const jobOptionsPay = selectedCustRawPay ? (selectedCustRawPay.jobs || []).length > 0 ? selectedCustRawPay.jobs : selectedCustRawPay.jobNo ? [{
    id: "_j",
    label: selectedCustRawPay.jobNo
  }] : [] : [];
  const catItems = allItems.filter(i => i.catId === form.categoryId);
  return /*#__PURE__*/_jsxDEV("div", {
    className: "ov",
    onClick: onClose,
    children: /*#__PURE__*/_jsxDEV("div", {
      className: "modal",
      onClick: e => e.stopPropagation(),
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "mtitle",
        style: {
          color: "#a29bfe"
        },
        children: record ? "แก้ไขยอดชำระเงิน" : "เพิ่มยอดชำระเงิน"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "fr2",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "วันที่"
          }, void 0, false), /*#__PURE__*/_jsxDEV(DateInput, {
            value: form.date,
            onChange: v => set("date", v)
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "จำนวนเงิน (฿)"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            type: "number",
            value: form.amount,
            onChange: e => set("amount", parseFloat(e.target.value) || ""),
            placeholder: "0.00"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "หมวดหมู่"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.categoryId,
          onChange: e => {
            set("categoryId", e.target.value);
            set("itemId", "");
          },
          children: cats.map(c => /*#__PURE__*/_jsxDEV("option", {
            value: c.id,
            children: c.label
          }, c.id, false))
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "รายการ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.itemId,
          onChange: e => set("itemId", e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "-- เลือกรายการ --"
          }, void 0, false), catItems.map(i => /*#__PURE__*/_jsxDEV("option", {
            value: i.id,
            children: i.label
          }, i.id, false))]
        }, void 0, true)]
      }, void 0, true), (customers || []).flatMap(g => g.items || []).length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: ["👤 ลูกค้า ", /*#__PURE__*/_jsxDEV("span", {
            style: {
              color: "var(--text3)",
              fontWeight: 400
            },
            children: "(เลือกก่อนเพื่อเลือก Job งาน)"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: form.customerId,
          onChange: e => onCustChangePay(e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "-- เลือกลูกค้า --"
          }, void 0, false), (customers || []).map(g => /*#__PURE__*/_jsxDEV("optgroup", {
            label: g.label,
            children: (g.items || []).map(c => /*#__PURE__*/_jsxDEV("option", {
              value: c.id,
              children: c.label
            }, c.id, false))
          }, g.id, false))]
        }, void 0, true)]
      }, void 0, true), form.customerId && /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "เลข Job งาน"
        }, void 0, false), jobOptionsPay.length > 0 ? /*#__PURE__*/_jsxDEV(JobPicker, {
          value: form.jobNo,
          onChange: v => set("jobNo", v),
          jobOptions: jobOptionsPay
        }, void 0, false) : /*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 12,
            color: "var(--text3)",
            padding: "6px 0"
          },
          children: "ลูกค้านี้ยังไม่มี Job — กรุณาเพิ่มใน 📂 หมวดหมู่ › ลูกค้า"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "fmb",
        children: [/*#__PURE__*/_jsxDEV("label", {
          className: "fl",
          children: "หมายเหตุ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
          className: "fi",
          value: form.note,
          onChange: e => set("note", e.target.value),
          placeholder: "ไม่บังคับ"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "mact",
        children: [/*#__PURE__*/_jsxDEV("button", {
          className: "btncancel",
          onClick: onClose,
          children: "ยกเลิก"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          className: "btnsave",
          style: {
            background: "linear-gradient(135deg,#6c5ce7,#a29bfe)"
          },
          onClick: () => onSave(form),
          children: "บันทึก"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)
  }, void 0, false);
}
function PayCatModal({
  cats,
  onUpdate,
  onClose,
  addLog,
  user
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [tgt, setTgt] = useState(null);
  const [cf, setCf] = useState({
    label: "",
    color: "#a29bfe"
  });
  const [itf, setItf] = useState({
    label: ""
  });
  const addC = () => {
    if (!cf.label) return;
    onUpdate([...cats, {
      id: Date.now().toString(),
      label: cf.label,
      color: cf.color,
      items: []
    }]);
    addLog(user, "เพิ่มหมวดยอดชำระ", cf.label, "add");
    setShowAdd(false);
  };
  const delC = id => {
    onUpdate(cats.filter(c => c.id !== id));
  };
  const addI = () => {
    if (!itf.label) return;
    onUpdate(cats.map(c => c.id === tgt ? {
      ...c,
      items: [...(c.items || []), {
        id: Date.now().toString(),
        label: itf.label
      }]
    } : c));
    setShowItem(false);
    setItf({
      label: ""
    });
  };
  const delI = (cId, iId) => onUpdate(cats.map(c => c.id === cId ? {
    ...c,
    items: c.items.filter(i => i.id !== iId)
  } : c));
  return /*#__PURE__*/_jsxDEV("div", {
    className: "ov",
    onClick: onClose,
    children: /*#__PURE__*/_jsxDEV("div", {
      className: "modal",
      style: {
        width: 520
      },
      onClick: e => e.stopPropagation(),
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "mtitle",
        style: {
          color: "#a29bfe"
        },
        children: "⚙️ จัดการหมวดหมู่ยอดชำระเงิน"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginBottom: 12
        },
        children: /*#__PURE__*/_jsxDEV("button", {
          className: "btnadd",
          style: {
            background: "rgba(162,155,254,.1)",
            borderColor: "rgba(162,155,254,.3)",
            color: "var(--purple)"
          },
          onClick: () => {
            setCf({
              label: "",
              color: "#a29bfe"
            });
            setShowAdd(true);
          },
          children: "+ เพิ่มหมวดหมู่"
        }, void 0, false)
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          maxHeight: 360,
          overflowY: "auto"
        },
        children: cats.map(cat => /*#__PURE__*/_jsxDEV("div", {
          style: {
            marginBottom: 12
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
              padding: "6px 8px",
              background: "var(--bg3)",
              borderRadius: 6,
              border: "1px solid var(--border)"
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontWeight: 600,
                color: cat.color,
                fontSize: 12
              },
              children: ["● ", cat.label]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                gap: 4
              },
              children: [/*#__PURE__*/_jsxDEV("button", {
                className: "btnadd",
                style: {
                  fontSize: 10,
                  padding: "2px 7px"
                },
                onClick: () => {
                  setTgt(cat.id);
                  setItf({
                    label: ""
                  });
                  setShowItem(true);
                },
                children: "+ รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                className: "bico",
                onClick: () => delC(cat.id),
                children: "🗑️"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), (cat.items || []).map(item => /*#__PURE__*/_jsxDEV("div", {
            className: "irow",
            style: {
              marginLeft: 12,
              marginTop: 3
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 12
              },
              children: item.label
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              onClick: () => delI(cat.id, item.id),
              children: "✕"
            }, void 0, false)]
          }, item.id, true))]
        }, cat.id, true))
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "mact",
        children: /*#__PURE__*/_jsxDEV("button", {
          className: "btnsave",
          style: {
            background: "linear-gradient(135deg,#6c5ce7,#a29bfe)"
          },
          onClick: onClose,
          children: "ปิด"
        }, void 0, false)
      }, void 0, false), showAdd && /*#__PURE__*/_jsxDEV("div", {
        className: "ov",
        onClick: () => setShowAdd(false),
        children: /*#__PURE__*/_jsxDEV("div", {
          className: "modal",
          onClick: e => e.stopPropagation(),
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "mtitle",
            children: "เพิ่มหมวดหมู่"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "fmb",
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "fl",
              children: "ชื่อ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              className: "fi",
              value: cf.label,
              onChange: e => setCf(f => ({
                ...f,
                label: e.target.value
              }))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "fmb",
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "fl",
              children: "สี"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              type: "color",
              value: cf.color,
              onChange: e => setCf(f => ({
                ...f,
                color: e.target.value
              })),
              style: {
                width: "100%",
                height: 36,
                borderRadius: 6,
                border: "1px solid var(--border2)",
                cursor: "pointer"
              }
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "mact",
            children: [/*#__PURE__*/_jsxDEV("button", {
              className: "btncancel",
              onClick: () => setShowAdd(false),
              children: "ยกเลิก"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "btnsave",
              onClick: addC,
              children: "บันทึก"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false), showItem && /*#__PURE__*/_jsxDEV("div", {
        className: "ov",
        onClick: () => setShowItem(false),
        children: /*#__PURE__*/_jsxDEV("div", {
          className: "modal",
          onClick: e => e.stopPropagation(),
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "mtitle",
            children: "เพิ่มรายการ"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "fmb",
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "fl",
              children: "ชื่อรายการ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              className: "fi",
              value: itf.label,
              onChange: e => setItf({
                label: e.target.value
              }),
              onKeyDown: e => e.key === "Enter" && addI()
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "mact",
            children: [/*#__PURE__*/_jsxDEV("button", {
              className: "btncancel",
              onClick: () => setShowItem(false),
              children: "ยกเลิก"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "btnsave",
              onClick: addI,
              children: "บันทึก"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true)
  }, void 0, false);
}

// ─── SALES TAB ────────────────────────────────────────────────────────────────
// ─── FILTER BAR — Dropdown style (กลุ่มลูกค้า + ลูกค้า/Job) ──────────────────
function JobFilterBar({
  jobs,
  customers,
  jobFilter,
  setJobFilter,
  groupFilter,
  setGroupFilter,
  custFilter,
  setCustFilter
}) {
  // Build grouped structure: group → customers → jobs
  const groups = (customers || []).map(g => ({
    ...g,
    custItems: (g.items || []).map(cust => ({
      ...cust,
      jobList: (cust.jobs || []).length > 0 ? cust.jobs || [] : cust.jobNo ? [{
        id: cust.id + "_j",
        label: cust.jobNo
      }] : []
    })).filter(c => c.jobList.length > 0)
  })).filter(g => g.custItems.length > 0);

  // Derive selected group + customer from current jobFilter
  const [selGroup, setSelGroup] = useState("");
  const [selCust, setSelCust] = useState("");

  // When jobFilter cleared externally, reset local state
  useEffect(() => {
    if (!jobFilter) {
      setSelGroup("");
      setSelCust("");
    }
  }, [jobFilter]);
  if (groups.length === 0 && jobs.length === 0) return null;
  const groupOptions = groups;
  const custOptions = selGroup ? groups.find(g => g.id === selGroup)?.custItems || [] : groups.flatMap(g => g.custItems);
  const onGroupChange = gId => {
    setSelGroup(gId);
    setSelCust("");
    setJobFilter("");
    if (setGroupFilter) setGroupFilter(gId);
    if (setCustFilter) setCustFilter("");
  };
  const onCustChange = cId => {
    setSelCust(cId);
    setJobFilter("");
    if (setCustFilter) setCustFilter(cId);
    // auto-select if only one job
    const c = custOptions.find(c => c.id === cId);
    if (c && c.jobList.length === 1) setJobFilter(c.jobList[0].label);
  };
  const onJobChange = jLabel => setJobFilter(jLabel);
  const selectedCust = selCust ? custOptions.find(c => c.id === selCust) : null;
  const jobsForSelected = selectedCust ? selectedCust.jobList : selGroup ? custOptions.flatMap(c => c.jobList) : [];
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 14,
      flexWrap: "wrap",
      alignItems: "flex-end"
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      children: [/*#__PURE__*/_jsxDEV("label", {
        style: {
          display: "block",
          fontSize: 11,
          color: "var(--text2)",
          marginBottom: 5
        },
        children: "กลุ่มลูกค้า"
      }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
        className: "psel",
        style: {
          minWidth: 150
        },
        value: selGroup,
        onChange: e => onGroupChange(e.target.value),
        children: [/*#__PURE__*/_jsxDEV("option", {
          value: "",
          children: "— ทั้งหมด —"
        }, void 0, false), groupOptions.map(g => /*#__PURE__*/_jsxDEV("option", {
          value: g.id,
          children: g.label
        }, g.id, false))]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      children: [/*#__PURE__*/_jsxDEV("label", {
        style: {
          display: "block",
          fontSize: 11,
          color: "var(--text2)",
          marginBottom: 5
        },
        children: "ลูกค้า"
      }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
        className: "psel",
        style: {
          minWidth: 180
        },
        value: selCust,
        onChange: e => onCustChange(e.target.value),
        children: [/*#__PURE__*/_jsxDEV("option", {
          value: "",
          children: "— เลือกลูกค้า —"
        }, void 0, false), custOptions.map(c => /*#__PURE__*/_jsxDEV("option", {
          value: c.id,
          children: c.label
        }, c.id, false))]
      }, void 0, true)]
    }, void 0, true), jobsForSelected.length > 1 && /*#__PURE__*/_jsxDEV("div", {
      children: [/*#__PURE__*/_jsxDEV("label", {
        style: {
          display: "block",
          fontSize: 11,
          color: "var(--text2)",
          marginBottom: 5
        },
        children: "Job งาน"
      }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
        className: "psel",
        style: {
          minWidth: 160
        },
        value: jobFilter,
        onChange: e => onJobChange(e.target.value),
        children: [/*#__PURE__*/_jsxDEV("option", {
          value: "",
          children: "— ทั้งหมด —"
        }, void 0, false), jobsForSelected.map(j => /*#__PURE__*/_jsxDEV("option", {
          value: j.label,
          children: j.label
        }, j.id, false))]
      }, void 0, true)]
    }, void 0, true), (selGroup || selCust || jobFilter) && /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        alignItems: "flex-end"
      },
      children: /*#__PURE__*/_jsxDEV("button", {
        className: "chip",
        style: {
          borderColor: "var(--red)",
          color: "var(--red)",
          background: "rgba(255,71,87,.08)",
          marginBottom: 1
        },
        onClick: () => {
          setSelGroup("");
          setSelCust("");
          setJobFilter("");
          if (setGroupFilter) setGroupFilter("");
          if (setCustFilter) setCustFilter("");
        },
        children: "✕ ล้าง"
      }, void 0, false)
    }, void 0, false), jobFilter && /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: 3
      },
      children: /*#__PURE__*/_jsxDEV("span", {
        style: {
          fontSize: 12,
          color: "var(--text2)"
        },
        children: ["กรอง: ", /*#__PURE__*/_jsxDEV("strong", {
          style: {
            color: "var(--accent)"
          },
          children: [selectedCust?.label || "", jobsForSelected.length > 1 ? ` › ${jobFilter}` : ""]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}
function SalesTab({
  records,
  cats,
  user,
  onUpdate,
  delReqs,
  onDelReqUpdate,
  addLog,
  payments,
  onPaymentsUpdate,
  pCats,
  customers,
  sCats
}) {
  const {
    mode,
    setMode,
    sel,
    setSel,
    opts
  } = usePeriod(records);
  const [show, setShow] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [confirmPay, setConfirmPay] = useState(null);
  const [jobFilter, setJobFilter] = useState(""); // "" = all
  const [groupFilter, setGroupFilter] = useState("");
  const [custFilter, setCustFilter] = useState("");
  const filtered = filterPeriod(records, mode, sel);
  const allItems = cats.flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  })));
  const pendIds = new Set(delReqs.filter(r => r.status === "pending" && r.type === "sale").map(r => r.recordId));
  const paidSaleIds = new Set(payments.filter(p => p.fromSaleId).map(p => p.fromSaleId));
  const handleExport = () => {
    const rows = jobFiltered.map(r => ({
      "วันที่": fmtDate(r.date),
      "หมวดหมู่": cats.find(c => c.id === r.categoryId)?.label || "-",
      "รายการ": resolveItemLabel(r, allItems),
      "ลูกค้า": resolveCustomer(r, customers),
      "Job งาน": r.jobNo || "-",
      "จำนวนเงิน (฿)": r.amount || 0,
      "สถานะ": paidSaleIds.has(r.id) ? "เก็บเงินแล้ว" : "รอเก็บเงิน",
      "หมายเหตุ": r.note || "-"
    }));
    exportCSV(rows, `ยอดขาย_${sel || "all"}.csv`);
  };
  // Collect unique job numbers from filtered records
  const allJobs = [...new Set(filtered.filter(r => r.jobNo).map(r => r.jobNo))].sort();
  const jobFiltered = filtered.filter(r => {
    if (jobFilter && r.jobNo !== jobFilter) return false;
    if (custFilter && r.customerId !== custFilter) return false;
    if (groupFilter && !custFilter) {
      const grp = (customers || []).find(g => g.id === groupFilter);
      const custIds = (grp?.items || []).map(c => c.id);
      if (custIds.length > 0 && !custIds.includes(r.customerId)) return false;
    }
    return true;
  });
  const onSave = rec => {
    const lbl = allItems.find(i => i.id === rec.itemId)?.label || "-";
    if (editRec) {
      onUpdate(records.map(r => r.id === rec.id ? rec : r));
      addLog(user, "แก้ไขรายการขาย", `${lbl} ${fmt(rec.amount)} ฿`, "edit");
    } else {
      onUpdate([...records, {
        ...rec,
        id: Date.now().toString(),
        createdBy: user.id
      }]);
      addLog(user, "เพิ่มรายการขาย", `${lbl} ${fmt(rec.amount)} ฿`, "add");
    }
    setShow(false);
    setEditRec(null);
  };
  const reqDel = rec => {
    const lbl = allItems.find(i => i.id === rec.itemId)?.label || "-";
    const req = {
      id: Date.now().toString(),
      type: "sale",
      recordId: rec.id,
      requestedBy: user.id,
      requestedByName: user.name,
      status: "pending",
      detail: `${lbl} ${fmt(rec.amount)} ฿ (${fmtDate(rec.date)})`,
      time: nowStr()
    };
    onDelReqUpdate([...delReqs, req]);
    addLog(user, "ขอลบรายการขาย", req.detail, "delete_req");
  };
  const doDel = id => {
    onUpdate(records.filter(r => r.id !== id));
    addLog(user, "ลบรายการขาย", `id:${id}`, "delete");
  };

  // Mark as paid → auto-add to payments
  const markPaid = rec => {
    const item = allItems.find(i => i.id === rec.itemId);
    const lbl = item?.label || "-";
    const catLabel = cats.find(c => c.id === rec.categoryId)?.label || "";
    // Try match pCats — fallback to first available
    const matchCat = pCats.find(c => c.id === rec.categoryId || c.id === "p_" + rec.categoryId) || pCats[0];
    const matchItem = matchCat ? (matchCat.items || []).find(i => i.id === rec.itemId || i.id === "p_" + rec.itemId) : null;
    const payRec = {
      id: Date.now().toString(),
      date: rec.date,
      categoryId: matchCat?.id || pCats[0]?.id || "",
      itemId: matchItem?.id || "",
      // Store original sale item label + category so PaymentsTab always shows it
      saleItemLabel: lbl,
      saleCatLabel: catLabel,
      description: `${catLabel ? catLabel + " — " : ""}${lbl}`,
      amount: rec.amount,
      note: rec.payNote || `เก็บเงินจากรายการขาย: ${lbl}`,
      jobNo: rec.jobNo || "",
      customerId: rec.customerId || "",
      createdBy: user.id,
      fromSaleId: rec.id
    };
    onPaymentsUpdate([...payments, payRec]);
    addLog(user, "เก็บเงินแล้ว (โอนไปยอดชำระ)", `${lbl} ${fmt(rec.amount)} ฿`, "add");
    setConfirmPay(null);
  };
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV(PBar, {
      mode: mode,
      setMode: setMode,
      sel: sel,
      setSel: setSel,
      opts: opts
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        flexWrap: "wrap"
      },
      children: [/*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setEditRec(null);
          setShow(true);
        },
        children: "+ เพิ่มรายการขาย"
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        className: "btn-export",
        onClick: handleExport,
        children: "⬇ Export CSV"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV(JobFilterBar, {
      jobs: allJobs,
      customers: customers,
      jobFilter: jobFilter,
      setJobFilter: setJobFilter,
      groupFilter: groupFilter,
      setGroupFilter: setGroupFilter,
      custFilter: custFilter,
      setCustFilter: setCustFilter
    }, void 0, false), cats.map(cat => {
      const items = cat.items || [];
      const catRecs = jobFiltered.filter(r => items.find(i => i.id === r.itemId) || r.categoryId === cat.id);
      const catTot = catRecs.reduce((a, r) => a + (r.amount || 0), 0);
      const catPaid = catRecs.filter(r => paidSaleIds.has(r.id)).reduce((a, r) => a + (r.amount || 0), 0);
      return /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: cat.color
              }
            }, void 0, false), cat.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12
            },
            children: [catPaid > 0 && /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 11,
                color: "#a29bfe"
              },
              children: ["เก็บแล้ว ", fmt(catPaid), " ฿"]
            }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontFamily: "Rajdhani",
                fontWeight: 700,
                color: cat.color
              },
              children: [fmt(catTot), " ฿"]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "ลูกค้า"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "Job งาน"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "วันที่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "จำนวนเงิน (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "สถานะ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "หมายเหตุ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {}, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: [catRecs.length === 0 && /*#__PURE__*/_jsxDEV("tr", {
              children: /*#__PURE__*/_jsxDEV("td", {
                colSpan: 7,
                className: "empty",
                children: "ไม่มีข้อมูล"
              }, void 0, false)
            }, void 0, false), catRecs.map(r => {
              const item = allItems.find(i => i.id === r.itemId);
              const isPend = pendIds.has(r.id);
              const isPaid = paidSaleIds.has(r.id);
              return /*#__PURE__*/_jsxDEV("tr", {
                className: isPend ? "pendrow" : "",
                style: isPaid ? {
                  background: "rgba(162,155,254,.06)"
                } : {},
                children: [/*#__PURE__*/_jsxDEV("td", {
                  children: [resolveItemLabel(r, allItems), isPend && /*#__PURE__*/_jsxDEV("span", {
                    className: "pbadge",
                    children: "รอลบ"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    fontSize: 11,
                    color: "var(--text2)"
                  },
                  children: resolveCustomer(r, customers)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
                    className: "job-badge",
                    children: r.jobNo
                  }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      color: "var(--text3)",
                      fontSize: 11
                    },
                    children: "-"
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    color: "var(--text2)",
                    fontSize: 11
                  },
                  children: fmtDate(r.date)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  children: fmt(r.amount)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: isPaid ? /*#__PURE__*/_jsxDEV("span", {
                    className: "tag",
                    style: {
                      background: "rgba(162,155,254,.2)",
                      color: "#a29bfe"
                    },
                    children: "✓ เก็บเงินแล้ว"
                  }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                    className: "tag",
                    style: {
                      background: "rgba(255,211,42,.12)",
                      color: "var(--yellow)"
                    },
                    children: "รอเก็บเงิน"
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    color: "var(--text2)",
                    fontSize: 11
                  },
                  children: r.note || "-"
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    display: "flex",
                    gap: 3
                  },
                  children: [!isPend && !isPaid && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    title: "เก็บเงินแล้ว",
                    style: {
                      color: "#a29bfe",
                      fontSize: 13
                    },
                    onClick: () => setConfirmPay(r),
                    children: "💳"
                  }, void 0, false), !isPend && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    onClick: () => {
                      setEditRec(r);
                      setShow(true);
                    },
                    children: "✏️"
                  }, void 0, false), !isPend && canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    onClick: () => doDel(r.id),
                    children: "🗑️"
                  }, void 0, false), !isPend && !canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    title: "ขอลบ",
                    onClick: () => reqDel(r),
                    children: "🔔"
                  }, void 0, false)]
                }, void 0, true)]
              }, r.id, true);
            }), catRecs.length > 0 && /*#__PURE__*/_jsxDEV("tr", {
              className: "tot",
              children: [/*#__PURE__*/_jsxDEV("td", {
                colSpan: 4,
                children: "รวม"
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                children: fmt(catTot)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)]
      }, cat.id, true);
    }), show && /*#__PURE__*/_jsxDEV(RecModal, {
      title: "รายการขาย",
      cats: cats,
      record: editRec,
      onSave: onSave,
      onClose: () => {
        setShow(false);
        setEditRec(null);
      },
      type: "sale",
      customers: customers
    }, void 0, false), confirmPay && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setConfirmPay(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        style: {
          width: 400
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          style: {
            color: "#a29bfe"
          },
          children: "💳 ยืนยันการเก็บเงิน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            marginBottom: 16,
            fontSize: 14,
            lineHeight: 1.7
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            children: ["รายการ: ", /*#__PURE__*/_jsxDEV("strong", {
              children: allItems.find(i => i.id === confirmPay.itemId)?.label || "-"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            children: ["จำนวน: ", /*#__PURE__*/_jsxDEV("strong", {
              style: {
                color: "#a29bfe",
                fontFamily: "Rajdhani",
                fontSize: 16
              },
              children: [fmt(confirmPay.amount), " ฿"]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginTop: 10
            },
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "fl",
              children: "วันที่เก็บเงิน"
            }, void 0, false), /*#__PURE__*/_jsxDEV(DateInput, {
              value: confirmPay.date,
              onChange: v => setConfirmPay(p => ({
                ...p,
                date: v
              }))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginTop: 10
            },
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "fl",
              children: "หมายเหตุ (ถ้ามี)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              className: "fi",
              value: confirmPay.payNote || "",
              onChange: e => setConfirmPay(p => ({
                ...p,
                payNote: e.target.value
              })),
              placeholder: "เช่น เลข INV, รายละเอียดเพิ่มเติม"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginTop: 10,
              fontSize: 12,
              color: "var(--text2)"
            },
            children: ["ระบบจะเพิ่มรายการนี้ไปยังหน้า ", /*#__PURE__*/_jsxDEV("strong", {
              children: "ยอดชำระเงิน"
            }, void 0, false), " โดยอัตโนมัติ"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setConfirmPay(null),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            style: {
              background: "linear-gradient(135deg,#6c5ce7,#a29bfe)"
            },
            onClick: () => markPaid(confirmPay),
            children: "✓ ยืนยันเก็บเงินแล้ว"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}

// ─── EXPENSES TAB ─────────────────────────────────────────────────────────────
function ExpensesTab({
  records,
  cats,
  user,
  onUpdate,
  delReqs,
  onDelReqUpdate,
  addLog,
  customers
}) {
  const {
    mode,
    setMode,
    sel,
    setSel,
    opts
  } = usePeriod(records);
  const [show, setShow] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [jobFilter, setJobFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [custFilter, setCustFilter] = useState("");
  const filtered = filterPeriod(records, mode, sel);
  const pendIds = new Set(delReqs.filter(r => r.status === "pending" && r.type === "expense").map(r => r.recordId));
  const allJobs = [...new Set(filtered.filter(r => r.jobNo).map(r => r.jobNo))].sort();
  const jobFiltered = filtered.filter(r => {
    if (jobFilter && r.jobNo !== jobFilter) return false;
    if (custFilter && r.customerId !== custFilter) return false;
    if (groupFilter && !custFilter) {
      const grp = (customers || []).find(g => g.id === groupFilter);
      const custIds = (grp?.items || []).map(c => c.id);
      if (custIds.length > 0 && !custIds.includes(r.customerId)) return false;
    }
    return true;
  });
  const total = jobFiltered.reduce((a, r) => a + (r.amount || 0), 0);
  const handleExport = () => {
    const rows = jobFiltered.map(r => ({
      "วันที่": fmtDate(r.date),
      "หมวดหมู่": cats.find(c => c.id === r.categoryId)?.label || "-",
      "รายละเอียด": r.description || "-",
      "ลูกค้า": resolveCustomer(r, customers),
      "Job งาน": r.jobNo || "-",
      "จำนวนเงิน (฿)": r.amount || 0,
      "หมายเหตุ": r.note || "-"
    }));
    exportCSV(rows, `ค่าใช้จ่าย_${new Date().toISOString().slice(0, 10)}.csv`);
  };
  const onSave = rec => {
    if (editRec) {
      onUpdate(records.map(r => r.id === rec.id ? rec : r));
      addLog(user, "แก้ไขค่าใช้จ่าย", `${rec.description} ${fmt(rec.amount)} ฿`, "edit");
    } else {
      onUpdate([...records, {
        ...rec,
        id: Date.now().toString(),
        createdBy: user.id
      }]);
      addLog(user, "เพิ่มค่าใช้จ่าย", `${rec.description} ${fmt(rec.amount)} ฿`, "add");
    }
    setShow(false);
    setEditRec(null);
  };
  const reqDel = rec => {
    const req = {
      id: Date.now().toString(),
      type: "expense",
      recordId: rec.id,
      requestedBy: user.id,
      requestedByName: user.name,
      status: "pending",
      detail: `${rec.description} ${fmt(rec.amount)} ฿ (${fmtDate(rec.date)})`,
      time: nowStr()
    };
    onDelReqUpdate([...delReqs, req]);
    addLog(user, "ขอลบค่าใช้จ่าย", req.detail, "delete_req");
  };
  const doDel = id => {
    onUpdate(records.filter(r => r.id !== id));
    addLog(user, "ลบค่าใช้จ่าย", `id:${id}`, "delete");
  };
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV(PBar, {
      mode: mode,
      setMode: setMode,
      sel: sel,
      setSel: setSel,
      opts: opts
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 12
      },
      children: [/*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setEditRec(null);
          setShow(true);
        },
        children: "+ เพิ่มรายการค่าใช้จ่าย"
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        className: "btn-export",
        onClick: handleExport,
        children: "⬇ Export CSV"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV(JobFilterBar, {
      jobs: allJobs,
      customers: customers,
      jobFilter: jobFilter,
      setJobFilter: setJobFilter,
      groupFilter: groupFilter,
      setGroupFilter: setGroupFilter,
      custFilter: custFilter,
      setCustFilter: setCustFilter
    }, void 0, false), cats.map(cat => {
      const catRecs = jobFiltered.filter(r => r.categoryId === cat.id);
      const catTot = catRecs.reduce((a, r) => a + (r.amount || 0), 0);
      const subItems = cat.items || [];
      return /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: cat.color
              }
            }, void 0, false), cat.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: cat.color
            },
            children: [fmt(catTot), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV(RecTable, {
          rows: catRecs,
          pendIds: pendIds,
          user: user,
          onEdit: r => {
            setEditRec(r);
            setShow(true);
          },
          onDel: doDel,
          onReq: reqDel,
          isExpense: true,
          customers: customers,
          cats: cats
        }, void 0, false)]
      }, cat.id, true);
    }), /*#__PURE__*/_jsxDEV("div", {
      style: {
        textAlign: "right",
        padding: "10px 0",
        fontFamily: "Rajdhani",
        fontSize: 16,
        fontWeight: 700,
        color: "#ff6b35"
      },
      children: ["รวมค่าใช้จ่าย: ", fmt(total), " ฿"]
    }, void 0, true), show && /*#__PURE__*/_jsxDEV(RecModal, {
      title: "ค่าใช้จ่าย",
      cats: cats,
      record: editRec,
      onSave: onSave,
      onClose: () => {
        setShow(false);
        setEditRec(null);
      },
      type: "expense",
      customers: customers
    }, void 0, false)]
  }, void 0, true);
}
function RecTable({
  rows,
  pendIds,
  user,
  onEdit,
  onDel,
  onReq,
  isExpense,
  customers,
  cats
}) {
  return /*#__PURE__*/_jsxDEV("table", {
    className: "tbl",
    children: [/*#__PURE__*/_jsxDEV("thead", {
      children: /*#__PURE__*/_jsxDEV("tr", {
        children: [/*#__PURE__*/_jsxDEV("th", {
          children: "รายการ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
          children: "ลูกค้า"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
          children: "Job งาน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
          children: "วันที่"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
          style: {
            textAlign: "right"
          },
          children: "จำนวนเงิน (฿)"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
          children: "หมายเหตุ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {}, void 0, false)]
      }, void 0, true)
    }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
      children: [rows.length === 0 && /*#__PURE__*/_jsxDEV("tr", {
        children: /*#__PURE__*/_jsxDEV("td", {
          colSpan: 6,
          className: "empty",
          children: "ไม่มีข้อมูล"
        }, void 0, false)
      }, void 0, false), rows.map(r => {
        const isPend = pendIds.has(r.id);
        const allSubItems = (cats || []).flatMap(c => (c.items || []).map(i => ({
          ...i,
          catId: c.id
        })));
        const subLabel = allSubItems.find(i => i.id === r.subItemId)?.label || "";
        const displayLabel = subLabel ? subLabel + (r.description ? ` — ${r.description}` : "") : r.description || "-";
        return /*#__PURE__*/_jsxDEV("tr", {
          className: isPend ? "pendrow" : "",
          children: [/*#__PURE__*/_jsxDEV("td", {
            children: [/*#__PURE__*/_jsxDEV("strong", {
              children: displayLabel
            }, void 0, false), isPend && /*#__PURE__*/_jsxDEV("span", {
              className: "pbadge",
              children: "รอลบ"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
            style: {
              fontSize: 11,
              color: "var(--text2)"
            },
            children: resolveCustomer(r, customers)
          }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
            children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
              className: "job-badge",
              children: r.jobNo
            }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
              style: {
                color: "var(--text3)",
                fontSize: 11
              },
              children: "-"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
            style: {
              color: "var(--text2)",
              fontSize: 11
            },
            children: fmtDate(r.date)
          }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
            className: "num",
            children: fmt(r.amount)
          }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
            style: {
              color: "var(--text2)",
              fontSize: 11
            },
            children: r.note || "-"
          }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
            style: {
              display: "flex",
              gap: 3
            },
            children: [!isPend && /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              onClick: () => onEdit(r),
              children: "✏️"
            }, void 0, false), !isPend && canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              onClick: () => onDel(r.id),
              children: "🗑️"
            }, void 0, false), !isPend && !canDel(user.role) && /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              title: "ขอลบ",
              onClick: () => onReq(r),
              children: "🔔"
            }, void 0, false)]
          }, void 0, true)]
        }, r.id, true);
      })]
    }, void 0, true)]
  }, void 0, true);
}

// ─── LOG TAB ──────────────────────────────────────────────────────────────────
const LIC = {
  login: {
    icon: "🔑",
    bg: "rgba(0,212,255,.12)"
  },
  logout: {
    icon: "🚪",
    bg: "rgba(136,153,187,.12)"
  },
  add: {
    icon: "➕",
    bg: "rgba(0,230,118,.12)"
  },
  edit: {
    icon: "✏️",
    bg: "rgba(255,211,42,.12)"
  },
  delete: {
    icon: "🗑️",
    bg: "rgba(255,71,87,.12)"
  },
  delete_req: {
    icon: "🔔",
    bg: "rgba(255,211,42,.12)"
  },
  approve: {
    icon: "✅",
    bg: "rgba(0,230,118,.12)"
  },
  reject: {
    icon: "❌",
    bg: "rgba(255,71,87,.12)"
  },
  restore: {
    icon: "♻️",
    bg: "rgba(162,155,254,.12)"
  },
  info: {
    icon: "ℹ️",
    bg: "rgba(162,155,254,.12)"
  }
};
function LogTab({
  actLog,
  delReqs,
  sales,
  expenses,
  payments,
  onDelReqUpdate,
  onSalesUpdate,
  onExpUpdate,
  onPayUpdate,
  onActLogUpdate,
  user,
  addLog,
  trash,
  setTrash,
  reloadSales,
  reloadExpenses,
  reloadPayments
}) {
  const [sub, setSub] = React.useState("activity");
  const restoreFromTrash = async item => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/trash/' + item._id + '/restore', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setTrash(prev => prev.filter(t => t._id !== item._id));
        if (item.type === 'sale') await reloadSales();else if (item.type === 'expense') await reloadExpenses();else if (item.type === 'payment') await reloadPayments();
        addLog(user, "กู้คืนจากถังขยะ", item.type + ": " + (item.data?.description || item.data?.amount || ""), "restore");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const permDelete = async item => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/trash/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTrash(prev => prev.filter(t => t._id !== item._id));
    } catch (e) {
      console.error(e);
    }
  };
  const pending = delReqs.filter(r => r.status === "pending");
  const approve = req => {
    if (req.type === "sale") onSalesUpdate(sales.filter(r => r.id !== req.recordId));else if (req.type === "payment") onPayUpdate(payments.filter(r => r.id !== req.recordId));else onExpUpdate(expenses.filter(r => r.id !== req.recordId));
    onDelReqUpdate(delReqs.map(r => r.id === req.id ? {
      ...r,
      status: "approved",
      approvedBy: user.name,
      approvedTime: nowStr()
    } : r));
    addLog(user, "อนุมัติลบรายการ", `${req.detail} (ขอโดย:${req.requestedByName})`, "approve");
  };
  const reject = req => {
    onDelReqUpdate(delReqs.map(r => r.id === req.id ? {
      ...r,
      status: "rejected",
      approvedBy: user.name,
      approvedTime: nowStr()
    } : r));
    addLog(user, "ปฏิเสธคำขอลบ", `${req.detail}`, "reject");
  };
  const markRestore = logEntry => {
    // If it's a delete_req log, also cancel the matching pending request
    if (logEntry.type === "delete_req") {
      // Find matching pending delReq by requestedBy + detail similarity
      const pendingReq = delReqs.find(r => r.status === "pending" && r.requestedBy === logEntry.userId && logEntry.detail && logEntry.detail.includes(r.detail?.split(" ")[0] || ""));
      if (pendingReq) {
        onDelReqUpdate(delReqs.map(r => r.id === pendingReq.id ? {
          ...r,
          status: "rejected",
          approvedBy: user.name + " (ยกเลิกเอง)",
          approvedTime: nowStr()
        } : r));
      }
    }
    const updated = actLog.map(l => l.id === logEntry.id ? {
      ...l,
      restored: true
    } : l);
    onActLogUpdate(updated);
    addLog(user, "กู้คืน/ยกเลิกคำขอ", `${logEntry.action}: ${logEntry.detail}`, "restore");
  };
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 16
      },
      children: [/*#__PURE__*/_jsxDEV("button", {
        className: `pb${sub === "activity" ? " on" : ""}`,
        onClick: () => setSub("activity"),
        children: "📝 ประวัติการใช้งาน"
      }, void 0, false), canManage(user.role) && /*#__PURE__*/_jsxDEV("button", {
        className: `pb${sub === "trash" ? " on" : ""}`,
        onClick: () => setSub("trash"),
        style: {
          color: "#ff4757"
        },
        children: ["🗑️ ถังขยะ ", trash && trash.length > 0 ? `(${trash.length})` : ""]
      }, void 0, true), canViewDelReqs(user.role) && /*#__PURE__*/_jsxDEV("button", {
        className: `pb${sub === "delreqs" ? " on" : ""}`,
        onClick: () => setSub("delreqs"),
        children: ["🗑️ คำขอลบ", pending.length > 0 && /*#__PURE__*/_jsxDEV("span", {
          className: "badge",
          children: pending.length
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), sub === "activity" && /*#__PURE__*/_jsxDEV("div", {
      className: "sec",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "shead",
        children: [/*#__PURE__*/_jsxDEV("span", {
          className: "stitle",
          children: "📝 ประวัติการเข้าใช้งาน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontSize: 11,
            color: "var(--text2)"
          },
          children: [actLog.length, " รายการ"]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          maxHeight: 520,
          overflowY: "auto"
        },
        children: [actLog.length === 0 && /*#__PURE__*/_jsxDEV("div", {
          className: "empty",
          children: "ยังไม่มีประวัติ"
        }, void 0, false), actLog.map(log => {
          const ic = LIC[log.type] || LIC.info;
          return /*#__PURE__*/_jsxDEV("div", {
            className: "lrow",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "lic",
              style: {
                background: ic.bg
              },
              children: ic.icon
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                flex: 1
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 2
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontWeight: 600,
                    fontSize: 12
                  },
                  children: log.userName
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  className: `tag tag-${log.userRole}`,
                  children: ROLE_LABEL[log.userRole]
                }, void 0, false), log.restored && /*#__PURE__*/_jsxDEV("span", {
                  className: "tag",
                  style: {
                    background: "rgba(162,155,254,.2)",
                    color: "var(--purple)"
                  },
                  children: "กู้คืนแล้ว"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 12,
                  color: "var(--text2)"
                },
                children: [/*#__PURE__*/_jsxDEV("strong", {
                  style: {
                    color: "var(--text)"
                  },
                  children: log.action
                }, void 0, false), log.detail ? ` — ${log.detail}` : ""]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 10,
                  color: "var(--text3)",
                  marginTop: 2
                },
                children: ["🕐 ", log.time]
              }, void 0, true)]
            }, void 0, true), !log.restored && ["delete", "add", "edit", "delete_req"].includes(log.type) && (canViewDelReqs(user.role) || log.userId === user.id && (
            // own add/edit/delete actions
            ["add", "edit", "delete"].includes(log.type) ||
            // own pending delete requests (not yet approved/rejected)
            log.type === "delete_req" && delReqs.some(r => r.status === "pending" && r.requestedBy === log.userId))) && /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              title: log.type === "delete_req" ? "ยกเลิกคำขอลบ" : "กู้คืน/บันทึก",
              onClick: () => markRestore(log),
              style: {
                color: log.type === "delete_req" ? "var(--yellow)" : "var(--green)"
              },
              children: log.type === "delete_req" ? "↩" : "♻️"
            }, void 0, false)]
          }, log.id, true);
        })]
      }, void 0, true)]
    }, void 0, true), sub === "delreqs" && /*#__PURE__*/_jsxDEV("div", {
      children: [pending.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "pbanner",
        children: ["⚠️ มีคำขอลบรออนุมัติ ", pending.length, " รายการ"]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: /*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: "🗑️ คำขอลบรายการทั้งหมด"
          }, void 0, false)
        }, void 0, false), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "ประเภท"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "ขอโดย"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "เวลา"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "สถานะ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "ดำเนินการ"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: [delReqs.length === 0 && /*#__PURE__*/_jsxDEV("tr", {
              children: /*#__PURE__*/_jsxDEV("td", {
                colSpan: 6,
                className: "empty",
                children: "ไม่มีคำขอ"
              }, void 0, false)
            }, void 0, false), [...delReqs].reverse().map(req => /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("td", {
                children: /*#__PURE__*/_jsxDEV("span", {
                  className: `tag ${req.type === "sale" ? "tag-admin" : "tag-user"}`,
                  children: req.type === "sale" ? "ยอดขาย" : "ค่าใช้จ่าย"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  fontSize: 11
                },
                children: req.detail
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  fontSize: 11
                },
                children: req.requestedByName
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  fontSize: 10,
                  color: "var(--text2)"
                },
                children: req.time
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                children: [/*#__PURE__*/_jsxDEV("span", {
                  className: `tag tag-${req.status}`,
                  children: req.status === "pending" ? "รอดำเนินการ" : req.status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธ"
                }, void 0, false), req.approvedBy && /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: 10,
                    color: "var(--text3)"
                  },
                  children: ["โดย: ", req.approvedBy]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                children: req.status === "pending" && /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 5
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: "btnapv",
                    onClick: () => approve(req),
                    children: "✓ อนุมัติ"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btnrej",
                    onClick: () => reject(req),
                    children: "✕ ปฏิเสธ"
                  }, void 0, false)]
                }, void 0, true)
              }, void 0, false)]
            }, req.id, true))]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true), sub === "trash" && canManage(user.role) && /*#__PURE__*/_jsxDEV("div", {
      className: "sec",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "shead",
        children: /*#__PURE__*/_jsxDEV("span", {
          className: "stitle",
          children: "🗑️ ถังขยะ (กู้คืนได้ภายใน 7 วัน)"
        }, void 0, false)
      }, void 0, false), /*#__PURE__*/_jsxDEV("table", {
        className: "tbl",
        children: [/*#__PURE__*/_jsxDEV("thead", {
          children: /*#__PURE__*/_jsxDEV("tr", {
            children: [/*#__PURE__*/_jsxDEV("th", {
              children: "ประเภท"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "รายการ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "จำนวนเงิน"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "วันที่ลบ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "ลบโดย"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "ดำเนินการ"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
          children: [(!trash || trash.length === 0) && /*#__PURE__*/_jsxDEV("tr", {
            children: /*#__PURE__*/_jsxDEV("td", {
              colSpan: 6,
              className: "empty",
              children: "ถังขยะว่างเปล่า"
            }, void 0, false)
          }, void 0, false), (trash || []).map(item => /*#__PURE__*/_jsxDEV("tr", {
            children: [/*#__PURE__*/_jsxDEV("td", {
              children: /*#__PURE__*/_jsxDEV("span", {
                className: `tag ${item.type === "sale" ? "tag-admin" : item.type === "payment" ? "tag-manager" : "tag-user"}`,
                children: item.type === "sale" ? "ยอดขาย" : item.type === "payment" ? "ยอดชำระ" : "ค่าใช้จ่าย"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              style: {
                fontSize: 11
              },
              children: item.data?.description || item.data?.itemId || "-"
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              style: {
                fontFamily: "Rajdhani",
                fontWeight: 700
              },
              children: [fmt(item.data?.amount), " ฿"]
            }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
              style: {
                fontSize: 11,
                color: "var(--text2)"
              },
              children: item.deletedAt ? new Date(item.deletedAt).toLocaleDateString('th-TH') : "-"
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              style: {
                fontSize: 11
              },
              children: item.deletedByName || "-"
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  gap: 5
                },
                children: [/*#__PURE__*/_jsxDEV("button", {
                  className: "btnapv",
                  onClick: () => restoreFromTrash(item),
                  children: "♻️ กู้คืน"
                }, void 0, false), user.role === "admin" && /*#__PURE__*/_jsxDEV("button", {
                  className: "btnrej",
                  onClick: () => permDelete(item),
                  children: "🗑️ ลบถาวร"
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, item._id, true))]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}

// ─── MANAGE TAB ───────────────────────────────────────────────────────────────
function ManageTab({
  sCats,
  onSCatsUpdate,
  eCats,
  onECatsUpdate,
  pCats,
  onPCatsUpdate,
  customers,
  onCustomersUpdate,
  addLog,
  user
}) {
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "mgrid2",
      style: {
        marginBottom: 16
      },
      children: [/*#__PURE__*/_jsxDEV(SCatPanel, {
        cats: sCats,
        onUpdate: onSCatsUpdate,
        addLog: addLog,
        user: user
      }, void 0, false), /*#__PURE__*/_jsxDEV(ECatPanel, {
        cats: eCats,
        onUpdate: onECatsUpdate,
        addLog: addLog,
        user: user
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV(CustPanel, {
      cats: customers,
      onUpdate: onCustomersUpdate,
      addLog: addLog,
      user: user
    }, void 0, false)]
  }, void 0, true);
}
function UsersPanel({
  users,
  onUpdate,
  addLog,
  me
}) {
  const [show, setShow] = useState(false);
  const [editU, setEditU] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "user"
  });
  const open = u => {
    setEditU(u);
    setForm(u ? {
      ...u
    } : {
      username: "",
      password: "",
      name: "",
      role: "user"
    });
    setShow(true);
  };
  const del = u => {
    if (users.length > 1) {
      onUpdate(users.filter(x => x.id !== u.id));
      addLog(me, "ลบผู้ใช้", u.name, "delete");
    }
  };
  const save = () => {
    if (!form.username || !form.name) return;
    if (editU) {
      onUpdate(users.map(u => u.id === editU.id ? {
        ...form,
        id: u.id
      } : u));
      addLog(me, "แก้ไขผู้ใช้", form.name, "edit");
    } else {
      onUpdate([...users, {
        ...form,
        id: Date.now().toString()
      }]);
      addLog(me, "เพิ่มผู้ใช้", `${form.name} (${ROLE_LABEL[form.role]})`, "add");
    }
    setShow(false);
  };
  return /*#__PURE__*/_jsxDEV("div", {
    className: "mcard",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "mhead",
      children: ["👤 จัดการผู้ใช้งาน ", /*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => open(null),
        children: "+ เพิ่ม"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "mbody",
      children: /*#__PURE__*/_jsxDEV("table", {
        className: "tbl",
        children: [/*#__PURE__*/_jsxDEV("thead", {
          children: /*#__PURE__*/_jsxDEV("tr", {
            children: [/*#__PURE__*/_jsxDEV("th", {
              children: "ชื่อ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "Username"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
              children: "สิทธิ์"
            }, void 0, false), /*#__PURE__*/_jsxDEV("th", {}, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
          children: users.map(u => /*#__PURE__*/_jsxDEV("tr", {
            children: [/*#__PURE__*/_jsxDEV("td", {
              children: u.name
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              style: {
                color: "var(--text2)"
              },
              children: u.username
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              children: /*#__PURE__*/_jsxDEV("span", {
                className: `tag tag-${u.role}`,
                children: ROLE_LABEL[u.role]
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
              style: {
                display: "flex",
                gap: 3
              },
              children: [/*#__PURE__*/_jsxDEV("button", {
                className: "bico",
                onClick: () => open(u),
                children: "✏️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                className: "bico",
                onClick: () => del(u),
                children: "🗑️"
              }, void 0, false)]
            }, void 0, true)]
          }, u.id, true))
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), show && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShow(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: editU ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"
        }, void 0, false), [["name", "ชื่อ-นามสกุล", "text"], ["username", "Username", "text"], ["password", "Password", "password"]].map(([k, l, t]) => /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: l
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            type: t,
            value: form[k] || "",
            onChange: e => setForm(f => ({
              ...f,
              [k]: e.target.value
            }))
          }, void 0, false)]
        }, k, true)), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "สิทธิ์"
          }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
            className: "fsel",
            value: form.role,
            onChange: e => setForm(f => ({
              ...f,
              role: e.target.value
            })),
            children: [/*#__PURE__*/_jsxDEV("option", {
              value: "admin",
              children: "แอดมิน — เต็มสิทธิ์ทุกอย่าง"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "manager",
              children: "ผู้จัดการ — เพิ่ม/แก้ไข/ลบ + อนุมัติคำขอ (ยกเว้นจัดการผู้ใช้)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "user",
              children: "ผู้ใช้งาน — เพิ่ม/แก้ไข/ขอลบ + ดูประวัติการเข้าใช้งาน"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "viewer",
              children: "ผู้ชม — ดูหน้าภาพรวมเท่านั้น"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShow(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: save,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}
function SCatPanel({
  cats,
  onUpdate,
  addLog,
  user
}) {
  const [showC, setShowC] = useState(false);
  const [showI, setShowI] = useState(false);
  const [tgt, setTgt] = useState(null);
  const [cf, setCf] = useState({
    label: "",
    color: "#00d4ff"
  });
  const [itf, setItf] = useState({
    label: ""
  });
  const addC = () => {
    if (!cf.label) return;
    onUpdate([...cats, {
      id: Date.now().toString(),
      label: cf.label,
      color: cf.color,
      items: []
    }]);
    addLog(user, "เพิ่มหมวดยอดขาย", cf.label, "add");
    setShowC(false);
  };
  const delC = id => {
    onUpdate(cats.filter(c => c.id !== id));
  };
  const addI = () => {
    if (!itf.label) return;
    onUpdate(cats.map(c => c.id === tgt ? {
      ...c,
      items: [...(c.items || []), {
        id: Date.now().toString(),
        label: itf.label
      }]
    } : c));
    setShowI(false);
    setItf({
      label: ""
    });
  };
  const delI = (cId, iId) => onUpdate(cats.map(c => c.id === cId ? {
    ...c,
    items: c.items.filter(i => i.id !== iId)
  } : c));
  return /*#__PURE__*/_jsxDEV("div", {
    className: "mcard",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "mhead",
      children: ["💰 หมวดหมู่การขาย ", /*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setCf({
            label: "",
            color: "#00d4ff"
          });
          setShowC(true);
        },
        children: "+ หมวดหมู่"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "mbody",
      children: cats.map(cat => /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginBottom: 12
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6
          },
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontWeight: 600,
              color: cat.color,
              fontSize: 12
            },
            children: ["● ", cat.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              gap: 4
            },
            children: [/*#__PURE__*/_jsxDEV("button", {
              className: "btnadd",
              style: {
                fontSize: 10,
                padding: "2px 7px"
              },
              onClick: () => {
                setTgt(cat.id);
                setItf({
                  label: ""
                });
                setShowI(true);
              },
              children: "+ รายการ"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              onClick: () => delC(cat.id),
              children: "🗑️"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), (cat.items || []).map(item => /*#__PURE__*/_jsxDEV("div", {
          className: "irow",
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 12
            },
            children: item.label
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "bico",
            onClick: () => delI(cat.id, item.id),
            children: "✕"
          }, void 0, false)]
        }, item.id, true))]
      }, cat.id, true))
    }, void 0, false), showC && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowC(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: "เพิ่มหมวดหมู่การขาย"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อ"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: cf.label,
            onChange: e => setCf(f => ({
              ...f,
              label: e.target.value
            }))
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "สี"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            type: "color",
            value: cf.color,
            onChange: e => setCf(f => ({
              ...f,
              color: e.target.value
            })),
            style: {
              width: "100%",
              height: 36,
              borderRadius: 6,
              border: "1px solid var(--border2)",
              cursor: "pointer"
            }
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowC(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addC,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), showI && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowI(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: ["เพิ่มรายการใน ", cats.find(c => c.id === tgt)?.label]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อรายการ"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: itf.label,
            onChange: e => setItf({
              label: e.target.value
            }),
            onKeyDown: e => e.key === "Enter" && addI()
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowI(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addI,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}
function ECatPanel({
  cats,
  onUpdate,
  addLog,
  user
}) {
  const [showC, setShowC] = useState(false);
  const [showI, setShowI] = useState(false);
  const [tgt, setTgt] = useState(null);
  const [cf, setCf] = useState({
    label: "",
    color: "#ff6b35"
  });
  const [itf, setItf] = useState({
    label: ""
  });
  const addC = () => {
    if (!cf.label) return;
    onUpdate([...cats, {
      id: Date.now().toString(),
      label: cf.label,
      color: cf.color,
      items: []
    }]);
    addLog(user, "เพิ่มหมวดค่าใช้จ่าย", cf.label, "add");
    setShowC(false);
    setCf({
      label: "",
      color: "#ff6b35"
    });
  };
  const delC = id => {
    onUpdate(cats.filter(c => c.id !== id));
  };
  const addI = () => {
    if (!itf.label) return;
    onUpdate(cats.map(c => c.id === tgt ? {
      ...c,
      items: [...(c.items || []), {
        id: Date.now().toString(),
        label: itf.label
      }]
    } : c));
    setShowI(false);
    setItf({
      label: ""
    });
  };
  const delI = (cId, iId) => onUpdate(cats.map(c => c.id === cId ? {
    ...c,
    items: c.items.filter(i => i.id !== iId)
  } : c));
  return /*#__PURE__*/_jsxDEV("div", {
    className: "mcard",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "mhead",
      children: ["📋 หมวดหมู่ค่าใช้จ่าย ", /*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setCf({
            label: "",
            color: "#ff6b35"
          });
          setShowC(true);
        },
        children: "+ หมวดหมู่"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "mbody",
      children: cats.map(cat => /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginBottom: 12
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "irow",
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 7
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
                flexShrink: 0
              }
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 12,
                fontWeight: 600
              },
              children: cat.label
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              gap: 4
            },
            children: [/*#__PURE__*/_jsxDEV("button", {
              className: "btnadd",
              style: {
                fontSize: 10,
                padding: "2px 7px"
              },
              onClick: () => {
                setTgt(cat.id);
                setItf({
                  label: ""
                });
                setShowI(true);
              },
              children: "+ รายการย่อย"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "bico",
              onClick: () => delC(cat.id),
              children: "✕"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), (cat.items || []).map(item => /*#__PURE__*/_jsxDEV("div", {
          className: "irow",
          style: {
            marginLeft: 12,
            marginTop: 3
          },
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 11,
              color: "var(--text2)"
            },
            children: ["↳ ", item.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            className: "bico",
            onClick: () => delI(cat.id, item.id),
            children: "✕"
          }, void 0, false)]
        }, item.id, true))]
      }, cat.id, true))
    }, void 0, false), showC && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowC(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: "เพิ่มหมวดหมู่ค่าใช้จ่าย"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อ"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: cf.label,
            onChange: e => setCf(f => ({
              ...f,
              label: e.target.value
            }))
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "สี"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            type: "color",
            value: cf.color,
            onChange: e => setCf(f => ({
              ...f,
              color: e.target.value
            })),
            style: {
              width: "100%",
              height: 36,
              borderRadius: 6,
              border: "1px solid var(--border2)",
              cursor: "pointer"
            }
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowC(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addC,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), showI && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowI(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: ["เพิ่มรายการย่อยใน ", cats.find(c => c.id === tgt)?.label]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อรายการย่อย"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: itf.label,
            onChange: e => setItf({
              label: e.target.value
            }),
            onKeyDown: e => e.key === "Enter" && addI()
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowI(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addI,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}

// ─── CUSTOMER PANEL (Manage) ──────────────────────────────────────────────────
function CustPanel({
  cats,
  onUpdate,
  addLog,
  user
}) {
  const [showC, setShowC] = useState(false);
  const [showI, setShowI] = useState(false);
  const [showJob, setShowJob] = useState(false); // add Job to existing customer
  const [tgt, setTgt] = useState(null); // target group id
  const [tgtCust, setTgtCust] = useState(null); // target customer id
  const [cf, setCf] = useState({
    label: "",
    color: "#00d4ff"
  });
  const [itf, setItf] = useState({
    label: "",
    contact: ""
  });
  const [jobLabel, setJobLabel] = useState("");
  const addC = () => {
    if (!cf.label) return;
    onUpdate([...cats, {
      id: Date.now().toString(),
      label: cf.label,
      color: cf.color,
      items: []
    }]);
    addLog(user, "เพิ่มกลุ่มลูกค้า", cf.label, "add");
    setShowC(false);
    setCf({
      label: "",
      color: "#00d4ff"
    });
  };
  const delC = id => {
    onUpdate(cats.filter(c => c.id !== id));
  };
  const addI = () => {
    if (!itf.label) return;
    const newItem = {
      id: Date.now().toString(),
      label: itf.label,
      contact: itf.contact,
      jobs: []
    };
    onUpdate(cats.map(c => c.id === tgt ? {
      ...c,
      items: [...(c.items || []), newItem]
    } : c));
    addLog(user, "เพิ่มลูกค้า", itf.label, "add");
    setShowI(false);
    setItf({
      label: "",
      contact: ""
    });
  };
  const delI = (cId, iId) => onUpdate(cats.map(c => c.id === cId ? {
    ...c,
    items: c.items.filter(i => i.id !== iId)
  } : c));
  // Add a Job under a customer
  const addJob = () => {
    if (!jobLabel.trim()) return;
    onUpdate(cats.map(grp => ({
      ...grp,
      items: (grp.items || []).map(cust => {
        if (cust.id !== tgtCust) return cust;
        const existingJobs = cust.jobs || [];
        const newJob = {
          id: Date.now().toString(),
          label: jobLabel.trim()
        };
        return {
          ...cust,
          jobs: [...existingJobs, newJob]
        };
      })
    })));
    addLog(user, "เพิ่ม Job งาน", jobLabel, "add");
    setShowJob(false);
    setJobLabel("");
  };
  const delJob = (grpId, custId, jobId) => {
    onUpdate(cats.map(grp => grp.id !== grpId ? grp : {
      ...grp,
      items: (grp.items || []).map(cust => cust.id !== custId ? cust : {
        ...cust,
        jobs: (cust.jobs || []).filter(j => j.id !== jobId)
      })
    }));
  };
  return /*#__PURE__*/_jsxDEV("div", {
    className: "mcard",
    style: {
      marginTop: 0
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "mhead",
      children: ["👥 หมวดหมู่ลูกค้า", /*#__PURE__*/_jsxDEV("button", {
        className: "btnadd",
        onClick: () => {
          setCf({
            label: "",
            color: "#00d4ff"
          });
          setShowC(true);
        },
        children: "+ เพิ่มกลุ่มลูกค้า"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "mbody",
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 14
        },
        children: cats.map(cat => /*#__PURE__*/_jsxDEV("div", {
          style: {
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden"
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderBottom: "1px solid var(--border)",
              background: "var(--card2)"
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontWeight: 600,
                color: cat.color,
                fontSize: 13
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: cat.color,
                  marginRight: 7
                }
              }, void 0, false), cat.label, /*#__PURE__*/_jsxDEV("span", {
                style: {
                  marginLeft: 8,
                  fontSize: 11,
                  color: "var(--text2)",
                  fontWeight: 400
                },
                children: ["(", (cat.items || []).length, " ราย)"]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                gap: 4
              },
              children: [/*#__PURE__*/_jsxDEV("button", {
                className: "btnadd",
                style: {
                  fontSize: 10,
                  padding: "2px 7px"
                },
                onClick: () => {
                  setTgt(cat.id);
                  setItf({
                    label: "",
                    jobNo: "",
                    contact: ""
                  });
                  setShowI(true);
                },
                children: "+ ลูกค้า"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                className: "bico",
                onClick: () => delC(cat.id),
                children: "🗑️"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              padding: 8
            },
            children: [(cat.items || []).length === 0 && /*#__PURE__*/_jsxDEV("div", {
              style: {
                fontSize: 12,
                color: "var(--text3)",
                textAlign: "center",
                padding: "8px 0"
              },
              children: "ยังไม่มีลูกค้า"
            }, void 0, false), (cat.items || []).map(item => /*#__PURE__*/_jsxDEV("div", {
              style: {
                marginBottom: 6,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden"
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px"
                },
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: 12,
                      fontWeight: 600
                    },
                    children: item.label
                  }, void 0, false), item.contact && /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: 10,
                      color: "var(--text2)"
                    },
                    children: ["📞 ", item.contact]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 4,
                    alignItems: "center"
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: "btnadd",
                    style: {
                      fontSize: 10,
                      padding: "2px 7px",
                      color: "var(--green)",
                      background: "rgba(0,230,118,.08)",
                      borderColor: "rgba(0,230,118,.25)"
                    },
                    onClick: () => {
                      setTgtCust(item.id);
                      setJobLabel("");
                      setShowJob(true);
                    },
                    children: "+ Job"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    onClick: () => delI(cat.id, item.id),
                    children: "✕"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), (item.jobs || []).length > 0 && /*#__PURE__*/_jsxDEV("div", {
                style: {
                  borderTop: "1px solid var(--border)",
                  padding: "4px 8px",
                  background: "var(--bg3)"
                },
                children: (item.jobs || []).map(job => /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "3px 4px"
                  },
                  children: [/*#__PURE__*/_jsxDEV("span", {
                    className: "job-badge",
                    style: {
                      fontSize: 11
                    },
                    children: ["📋 ", job.label]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                    className: "bico",
                    style: {
                      fontSize: 11
                    },
                    onClick: () => delJob(cat.id, item.id, job.id),
                    children: "✕"
                  }, void 0, false)]
                }, job.id, true))
              }, void 0, false)]
            }, item.id, true))]
          }, void 0, true)]
        }, cat.id, true))
      }, void 0, false)
    }, void 0, false), showC && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowC(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: "เพิ่มกลุ่มลูกค้า"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อกลุ่ม"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: cf.label,
            onChange: e => setCf(f => ({
              ...f,
              label: e.target.value
            })),
            placeholder: "เช่น ลูกค้าองค์กร"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "สี"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            type: "color",
            value: cf.color,
            onChange: e => setCf(f => ({
              ...f,
              color: e.target.value
            })),
            style: {
              width: "100%",
              height: 36,
              borderRadius: 6,
              border: "1px solid var(--border2)",
              cursor: "pointer"
            }
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowC(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addC,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), showI && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowI(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          children: ["เพิ่มลูกค้าใน ", cats.find(c => c.id === tgt)?.label]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อลูกค้า / บริษัท"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: itf.label,
            onChange: e => setItf(f => ({
              ...f,
              label: e.target.value
            })),
            placeholder: "ชื่อลูกค้า"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: ["เบอร์ติดต่อ ", /*#__PURE__*/_jsxDEV("span", {
              style: {
                color: "var(--text3)",
                fontWeight: 400
              },
              children: "(ไม่บังคับ)"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: itf.contact,
            onChange: e => setItf(f => ({
              ...f,
              contact: e.target.value
            })),
            placeholder: "08x-xxx-xxxx"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowI(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            onClick: addI,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), showJob && /*#__PURE__*/_jsxDEV("div", {
      className: "ov",
      onClick: () => setShowJob(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "mtitle",
          style: {
            color: "var(--green)"
          },
          children: "+ เพิ่ม Job งาน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            marginBottom: 12,
            fontSize: 13,
            color: "var(--text2)"
          },
          children: ["ลูกค้า: ", /*#__PURE__*/_jsxDEV("strong", {
            style: {
              color: "var(--text)"
            },
            children: cats.flatMap(g => g.items || []).find(c => c.id === tgtCust)?.label || "-"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "fmb",
          children: [/*#__PURE__*/_jsxDEV("label", {
            className: "fl",
            children: "ชื่อ Job งาน / รหัส Job"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            className: "fi",
            value: jobLabel,
            onChange: e => setJobLabel(e.target.value),
            onKeyDown: e => e.key === "Enter" && addJob(),
            placeholder: "เช่น JOB-2025-001 หรือ งานสำรวจโรงงาน A",
            autoFocus: true
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "mact",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btncancel",
            onClick: () => setShowJob(false),
            children: "ยกเลิก"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btnsave",
            style: {
              background: "linear-gradient(135deg,#00aa55,#00d470)"
            },
            onClick: addJob,
            children: "บันทึก"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}

// ─── CUSTOMERS TAB ────────────────────────────────────────────────────────────
function CustomersTab({
  customers,
  sales,
  expenses,
  payments,
  sCats,
  eCats
}) {
  const [selCat, setSelCat] = useState("");
  const [selCust, setSelCust] = useState("");
  const [selJob, setSelJob] = useState(""); // "" = all jobs of selected customer

  // Flatten all customers with their group info
  const allCustomers = customers.flatMap(g => (g.items || []).map(c => ({
    ...c,
    groupId: g.id,
    groupLabel: g.label,
    groupColor: g.color,
    jobNo: c.jobNo || (c.jobs || [])[0]?.label || ""
  })));

  // Filter by group
  const filteredCusts = selCat ? allCustomers.filter(c => c.groupId === selCat) : allCustomers;

  // Get selected customer
  const activeCust = selCust ? allCustomers.find(c => c.id === selCust) : null;

  // Jobs list for selected customer
  const custJobList = activeCust ? (activeCust.jobs || []).length > 0 ? activeCust.jobs || [] : activeCust.jobNo ? [{
    id: "_legacy",
    label: activeCust.jobNo
  }] : [] : [];
  const allSaleCatItems = (sCats || []).flatMap(c => (c.items || []).map(i => ({
    ...i,
    catId: c.id
  })));

  // Filter by customerId OR jobNo — optionally narrowed by selJob
  const filterByCust = recs => {
    if (!activeCust) return [];
    const custJobLabels = new Set([...(activeCust.jobNo ? [activeCust.jobNo] : []), ...(activeCust.jobs || []).map(j => j.label)]);
    return recs.filter(r => {
      const matchesCust = r.customerId && r.customerId === activeCust.id || r.jobNo && custJobLabels.has(r.jobNo);
      if (!matchesCust) return false;
      // If a specific job is selected, filter further
      if (selJob) return r.jobNo === selJob;
      return true;
    });
  };
  const custSales = activeCust ? filterByCust(sales) : [];
  const custExpenses = activeCust ? filterByCust(expenses) : [];
  const custPayments = activeCust ? filterByCust(payments) : [];
  const handleExport = () => {
    if (!activeCust) return;
    const saleRows = custSales.map(r => ({
      "ประเภท": "ยอดขาย",
      "ลูกค้า": activeCust.label,
      "Job งาน": activeCust.jobNo || "-",
      "รายการ": resolveItemLabel(r, allSaleCatItems),
      "วันที่": fmtDate(r.date),
      "จำนวนเงิน (฿)": r.amount || 0,
      "สถานะ": payments.some(p => p.fromSaleId === r.id) ? "เก็บแล้ว" : "รอเก็บ",
      "หมายเหตุ": r.note || "-"
    }));
    const payRows = custPayments.map(r => ({
      "ประเภท": "ยอดชำระ",
      "ลูกค้า": activeCust.label,
      "Job งาน": activeCust.jobNo || "-",
      "รายการ": r.saleItemLabel || r.description || "-",
      "วันที่": fmtDate(r.date),
      "จำนวนเงิน (฿)": r.amount || 0,
      "สถานะ": r.fromSaleId ? "จากยอดขาย" : "บันทึกเอง",
      "หมายเหตุ": r.note || "-"
    }));
    const expRows = custExpenses.map(r => ({
      "ประเภท": "ค่าใช้จ่าย",
      "ลูกค้า": activeCust.label,
      "Job งาน": activeCust.jobNo || "-",
      "รายการ": r.description || "-",
      "วันที่": fmtDate(r.date),
      "จำนวนเงิน (฿)": r.amount || 0,
      "สถานะ": "-",
      "หมายเหตุ": r.note || "-"
    }));
    exportCSV([...saleRows, ...payRows, ...expRows], `ลูกค้า_${activeCust.label}_${activeCust.jobNo || "all"}.csv`);
  };
  const totSales = custSales.reduce((a, r) => a + (r.amount || 0), 0);
  const totExpenses = custExpenses.reduce((a, r) => a + (r.amount || 0), 0);
  const totPayments = custPayments.reduce((a, r) => a + (r.amount || 0), 0);
  const outstanding = totSales - totPayments;
  const profit = totPayments - totExpenses;
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 16,
        flexWrap: "wrap",
        alignItems: "flex-start"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          minWidth: 180
        },
        children: [/*#__PURE__*/_jsxDEV("label", {
          style: {
            display: "block",
            fontSize: 11,
            color: "var(--text2)",
            marginBottom: 5
          },
          children: "กลุ่มลูกค้า"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: selCat,
          onChange: e => {
            setSelCat(e.target.value);
            setSelCust("");
          },
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "— ทั้งหมด —"
          }, void 0, false), customers.map(g => /*#__PURE__*/_jsxDEV("option", {
            value: g.id,
            children: g.label
          }, g.id, false))]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          minWidth: 200
        },
        children: [/*#__PURE__*/_jsxDEV("label", {
          style: {
            display: "block",
            fontSize: 11,
            color: "var(--text2)",
            marginBottom: 5
          },
          children: "ลูกค้า"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: selCust,
          onChange: e => {
            setSelCust(e.target.value);
            setSelJob("");
          },
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "— เลือกลูกค้า —"
          }, void 0, false), filteredCusts.map(c => /*#__PURE__*/_jsxDEV("option", {
            value: c.id,
            children: c.label
          }, c.id, false))]
        }, void 0, true)]
      }, void 0, true), custJobList.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        style: {
          minWidth: 180
        },
        children: [/*#__PURE__*/_jsxDEV("label", {
          style: {
            display: "block",
            fontSize: 11,
            color: "var(--text2)",
            marginBottom: 5
          },
          children: "Job งาน"
        }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
          className: "fsel",
          value: selJob,
          onChange: e => setSelJob(e.target.value),
          children: [/*#__PURE__*/_jsxDEV("option", {
            value: "",
            children: "— ทั้งหมด —"
          }, void 0, false), custJobList.map(j => /*#__PURE__*/_jsxDEV("option", {
            value: j.label,
            children: j.label
          }, j.id, false))]
        }, void 0, true)]
      }, void 0, true), activeCust?.contact && /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "flex-end"
        },
        children: /*#__PURE__*/_jsxDEV("div", {
          style: {
            padding: "7px 13px",
            background: "var(--card2)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            fontSize: 12,
            color: "var(--text2)",
            marginBottom: 1
          },
          children: ["📞 ", activeCust.contact]
        }, void 0, true)
      }, void 0, false), (selCat || selCust || selJob) && /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "flex-end"
        },
        children: /*#__PURE__*/_jsxDEV("button", {
          className: "chip",
          style: {
            borderColor: "var(--red)",
            color: "var(--red)",
            background: "rgba(255,71,87,.08)",
            marginBottom: 1
          },
          onClick: () => {
            setSelCat("");
            setSelCust("");
            setSelJob("");
          },
          children: "✕ ล้าง"
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true), !activeCust ?
    /*#__PURE__*/
    /* ─ Overview grid of all customers ─ */
    _jsxDEV("div", {
      children: [customers.length === 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "empty",
        children: "ยังไม่มีลูกค้า กรุณาเพิ่มในหน้า ⚙️ จัดการ"
      }, void 0, false), customers.map(grp => grp.items?.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        style: {
          marginBottom: 16
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: grp.color
              }
            }, void 0, false), grp.label]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 12,
              color: "var(--text2)"
            },
            children: [grp.items.length, " ราย"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "ลูกค้า"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "ติดต่อ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "ยอดขาย (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "ยอดชำระ (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "ค้างชำระ (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "ค่าใช้จ่าย (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {}, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: [grp.items.map(cust => {
              const matchFn = r => r.customerId && r.customerId === cust.id || cust.jobNo && r.jobNo === cust.jobNo;
              const cS = sales.filter(matchFn).reduce((a, r) => a + (r.amount || 0), 0);
              const cP = payments.filter(matchFn).reduce((a, r) => a + (r.amount || 0), 0);
              const cE = expenses.filter(matchFn).reduce((a, r) => a + (r.amount || 0), 0);
              const cOut = cS - cP;
              return /*#__PURE__*/_jsxDEV("tr", {
                style: {
                  cursor: "pointer"
                },
                onClick: () => {
                  setSelCat(grp.id);
                  setSelCust(cust.id);
                },
                children: [/*#__PURE__*/_jsxDEV("td", {
                  style: {
                    fontWeight: 600
                  },
                  children: cust.label
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    color: "var(--text2)",
                    fontSize: 11
                  },
                  children: cust.contact || "-"
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  style: {
                    color: "#00d4ff"
                  },
                  children: fmt(cS)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  style: {
                    color: "#a29bfe"
                  },
                  children: fmt(cP)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  style: {
                    color: cOut > 0 ? "var(--yellow)" : "var(--green)"
                  },
                  children: fmt(cOut)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  className: "num",
                  style: {
                    color: "#ff6b35"
                  },
                  children: fmt(cE)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: /*#__PURE__*/_jsxDEV("button", {
                    className: "btnadd",
                    style: {
                      fontSize: 11,
                      padding: "3px 9px"
                    },
                    onClick: e => {
                      e.stopPropagation();
                      setSelCat(grp.id);
                      setSelCust(cust.id);
                    },
                    children: "ดูรายละเอียด"
                  }, void 0, false)
                }, void 0, false)]
              }, cust.id, true);
            }), /*#__PURE__*/_jsxDEV("tr", {
              style: {
                background: "rgba(0,212,255,.04)"
              },
              children: [/*#__PURE__*/_jsxDEV("td", {
                colSpan: 2,
                style: {
                  fontWeight: 700,
                  fontSize: 12,
                  color: "var(--text2)"
                },
                children: ["รวม ", grp.label]
              }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#00d4ff",
                  fontWeight: 700
                },
                children: fmt(grp.items.reduce((sum, cust) => {
                  const mFn = r => r.customerId && r.customerId === cust.id || cust.jobNo && r.jobNo === cust.jobNo;
                  return sum + sales.filter(mFn).reduce((a, r) => a + (r.amount || 0), 0);
                }, 0))
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#a29bfe",
                  fontWeight: 700
                },
                children: fmt(grp.items.reduce((sum, cust) => {
                  const mFn = r => r.customerId && r.customerId === cust.id || cust.jobNo && r.jobNo === cust.jobNo;
                  return sum + payments.filter(mFn).reduce((a, r) => a + (r.amount || 0), 0);
                }, 0))
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  fontWeight: 700
                },
                children: fmt(grp.items.reduce((sum, cust) => {
                  const mFn = r => r.customerId && r.customerId === cust.id || cust.jobNo && r.jobNo === cust.jobNo;
                  const s = sales.filter(mFn).reduce((a, r) => a + (r.amount || 0), 0);
                  const p = payments.filter(mFn).reduce((a, r) => a + (r.amount || 0), 0);
                  return sum + (s - p);
                }, 0))
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#ff6b35",
                  fontWeight: 700
                },
                children: fmt(grp.items.reduce((sum, cust) => {
                  const mFn = r => r.customerId && r.customerId === cust.id || cust.jobNo && r.jobNo === cust.jobNo;
                  return sum + expenses.filter(mFn).reduce((a, r) => a + (r.amount || 0), 0);
                }, 0))
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {}, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)]
      }, grp.id, true))]
    }, void 0, true) :
    /*#__PURE__*/
    /* ─ Detail view for selected customer ─ */
    _jsxDEV("div", {
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16
        },
        children: [/*#__PURE__*/_jsxDEV("button", {
          className: "pb",
          onClick: () => setSelCust(""),
          children: "← กลับ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text)"
          },
          children: activeCust.label
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontSize: 12,
            color: "var(--text2)"
          },
          children: ["กลุ่ม: ", activeCust.groupLabel]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          className: "btn-export",
          onClick: handleExport,
          style: {
            marginLeft: "auto"
          },
          children: "⬇ Export CSV"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "sgrid",
        style: {
          marginBottom: 16
        },
        children: [{
          l: "ยอดขายรวม (PO)",
          v: fmt(totSales),
          c: "#00d4ff"
        }, {
          l: "ยอดชำระแล้ว",
          v: fmt(totPayments),
          c: "#a29bfe"
        }, {
          l: "ยอดรอออก (INV)",
          v: fmt(outstanding),
          c: outstanding > 0 ? "var(--yellow)" : "var(--green)"
        }, {
          l: "ค่าใช้จ่าย",
          v: fmt(totExpenses),
          c: "#ff6b35"
        }, {
          l: "กำไรสุทธิ",
          v: fmt(profit),
          c: profit >= 0 ? "var(--green)" : "var(--red)"
        }].map(c => /*#__PURE__*/_jsxDEV("div", {
          className: "scard",
          style: {
            "--ca": c.c
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "slabel",
            children: c.l
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sval",
            style: {
              color: c.c
            },
            children: c.v
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sunit",
            children: "บาท"
          }, void 0, false)]
        }, c.l, true))
      }, void 0, false), custSales.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        style: {
          marginBottom: 14
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: "#00d4ff"
              }
            }, void 0, false), "ยอดขาย"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: "#00d4ff"
            },
            children: [fmt(totSales), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "Job งาน"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "วันที่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "จำนวนเงิน (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "สถานะ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "หมายเหตุ"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: custSales.map(r => /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("td", {
                children: resolveItemLabel(r, allSaleCatItems)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
                  className: "job-badge",
                  children: r.jobNo
                }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    color: "var(--text3)",
                    fontSize: 11
                  },
                  children: "-"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: fmtDate(r.date)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#00d4ff"
                },
                children: fmt(r.amount)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                children: payments.some(p => p.fromSaleId === r.id) ? /*#__PURE__*/_jsxDEV("span", {
                  className: "tag",
                  style: {
                    background: "rgba(162,155,254,.2)",
                    color: "#a29bfe"
                  },
                  children: "✓ เก็บแล้ว"
                }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                  className: "tag",
                  style: {
                    background: "rgba(255,211,42,.12)",
                    color: "var(--yellow)"
                  },
                  children: "รอเก็บ"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: r.note || "-"
              }, void 0, false)]
            }, r.id, true))
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), custPayments.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        style: {
          marginBottom: 14
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: "#a29bfe"
              }
            }, void 0, false), "ยอดชำระเงิน"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: "#a29bfe"
            },
            children: [fmt(totPayments), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "รายการ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "Job งาน"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "วันที่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "จำนวนเงิน (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "หมายเหตุ"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: custPayments.map(r => /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("td", {
                children: [r.saleItemLabel || allSaleCatItems.find(i => i.id === r.itemId)?.label || r.description || r.itemId || "-", r.fromSaleId && /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 10,
                    marginLeft: 4,
                    color: "var(--green)"
                  },
                  children: "↩ ยอดขาย"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
                  className: "job-badge",
                  children: r.jobNo
                }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    color: "var(--text3)",
                    fontSize: 11
                  },
                  children: "-"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: fmtDate(r.date)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#a29bfe"
                },
                children: fmt(r.amount)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: r.note || "-"
              }, void 0, false)]
            }, r.id, true))
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), custExpenses.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "sec",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "shead",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "stitle",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "sdot",
              style: {
                background: "#ff6b35"
              }
            }, void 0, false), "ค่าใช้จ่าย"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontFamily: "Rajdhani",
              fontWeight: 700,
              color: "#ff6b35"
            },
            children: [fmt(totExpenses), " ฿"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("table", {
          className: "tbl",
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("th", {
                children: "หมวดหมู่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "รายละเอียด"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "Job งาน"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "วันที่"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                style: {
                  textAlign: "right"
                },
                children: "จำนวนเงิน (฿)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                children: "หมายเหตุ"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: custExpenses.map(r => /*#__PURE__*/_jsxDEV("tr", {
              children: [/*#__PURE__*/_jsxDEV("td", {
                style: {
                  fontSize: 11,
                  color: "var(--text2)"
                },
                children: eCats.find(c => c.id === r.categoryId)?.label || "-"
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                children: r.description || "-"
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                children: r.jobNo ? /*#__PURE__*/_jsxDEV("span", {
                  className: "job-badge",
                  children: r.jobNo
                }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    color: "var(--text3)",
                    fontSize: 11
                  },
                  children: "-"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: fmtDate(r.date)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                className: "num",
                style: {
                  color: "#ff6b35"
                },
                children: fmt(r.amount)
              }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  color: "var(--text2)",
                  fontSize: 11
                },
                children: r.note || "-"
              }, void 0, false)]
            }, r.id, true))
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), custSales.length === 0 && custPayments.length === 0 && custExpenses.length === 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "empty",
        style: {
          marginTop: 20
        },
        children: ["ยังไม่มีรายการที่เชื่อมกับ Job: ", /*#__PURE__*/_jsxDEV("strong", {
          children: activeCust.jobNo || "ไม่ระบุ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("br", {}, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontSize: 12
          },
          children: "กรุณาระบุ \"เลข Job งาน\" ให้ตรงกันในหน้ายอดขาย / ค่าใช้จ่าย"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}
ReactDOM.render(React.createElement(App), document.getElementById('root'));
