import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Target, Wallet, FileBarChart,
  Tags, Settings, Sun, Moon, Plus, Trash2, Pencil, X, Check, AlertTriangle,
  TrendingUp, TrendingDown, Utensils, Car, Home, Zap, HeartPulse, GraduationCap,
  Film, ShoppingBag, Repeat, Plane, PawPrint, PiggyBank, MoreHorizontal,
  Briefcase, Laptop, Gift, ShoppingCart, RotateCcw, Menu, CircleDollarSign,
  Receipt, CalendarDays, ChevronLeft, ChevronRight, Flag, Award
} from "lucide-react";

/* ============================== TOKENS ============================== */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

const THEME = {
  light: {
    bg: "#F6F3EC", surface: "#FFFFFF", surfaceAlt: "#FBF9F4",
    ink: "#1C2430", inkSub: "#636D7A", border: "#E4DFD1",
    shadow: "0 1px 2px rgba(28,36,48,0.04), 0 4px 16px rgba(28,36,48,0.05)",
  },
  dark: {
    bg: "#10151C", surface: "#171F29", surfaceAlt: "#1D2733",
    ink: "#EAEDF1", inkSub: "#8E99A8", border: "#2A3542",
    shadow: "0 1px 2px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.35)",
  },
};

const C = {
  income: "#1F7A5C", incomeSoft: "#E4F1EB",
  expense: "#B5563C", expenseSoft: "#F5E7E1",
  amber: "#C98A2C", amberSoft: "#F6EAD5",
  rose: "#B33F4B", roseSoft: "#F5E1E3",
  blue: "#2E6FA7", blueSoft: "#E3EDF5",
};

const CAT_PALETTE = [
  "#1F7A5C", "#2E86AB", "#B5563C", "#C98A2C", "#7B4B94", "#3D5A80",
  "#A44A3F", "#5C7A29", "#9C6644", "#2F6690", "#8E5572", "#4C6444",
  "#B33F4B", "#6B7280",
];

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MONTHS_FULL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const PAYMENT_METHODS = ["Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Transferencia", "Otro"];
const PRIORITIES = ["Necesidad", "Deseo"];

const EXPENSE_ICONS = { Utensils, Car, Home, Zap, HeartPulse, GraduationCap, Film, ShoppingBag, Repeat, Plane, PawPrint, PiggyBank, TrendingUp, MoreHorizontal };
const INCOME_ICONS = { Briefcase, Laptop, TrendingUp, Gift, ShoppingCart, RotateCcw, MoreHorizontal, CircleDollarSign };
const ALL_ICONS = { ...EXPENSE_ICONS, ...INCOME_ICONS };
const ICON_NAMES = Object.keys(ALL_ICONS);

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "alimentacion", name: "Alimentación", icon: "Utensils", color: CAT_PALETTE[0] },
  { id: "transporte", name: "Transporte", icon: "Car", color: CAT_PALETTE[1] },
  { id: "vivienda", name: "Vivienda", icon: "Home", color: CAT_PALETTE[2] },
  { id: "servicios", name: "Servicios", icon: "Zap", color: CAT_PALETTE[3] },
  { id: "salud", name: "Salud", icon: "HeartPulse", color: CAT_PALETTE[4] },
  { id: "educacion", name: "Educación", icon: "GraduationCap", color: CAT_PALETTE[5] },
  { id: "entretenimiento", name: "Entretenimiento", icon: "Film", color: CAT_PALETTE[6] },
  { id: "compras", name: "Compras", icon: "ShoppingBag", color: CAT_PALETTE[7] },
  { id: "suscripciones", name: "Suscripciones", icon: "Repeat", color: CAT_PALETTE[8] },
  { id: "viajes", name: "Viajes", icon: "Plane", color: CAT_PALETTE[9] },
  { id: "mascotas", name: "Mascotas", icon: "PawPrint", color: CAT_PALETTE[10] },
  { id: "ahorro", name: "Ahorro", icon: "PiggyBank", color: CAT_PALETTE[11] },
  { id: "inversiones", name: "Inversiones", icon: "TrendingUp", color: CAT_PALETTE[12] },
  { id: "otros", name: "Otros", icon: "MoreHorizontal", color: CAT_PALETTE[13] },
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: "salario", name: "Salario", icon: "Briefcase", color: CAT_PALETTE[0] },
  { id: "freelance", name: "Freelance", icon: "Laptop", color: CAT_PALETTE[1] },
  { id: "inversiones_ing", name: "Inversiones", icon: "TrendingUp", color: CAT_PALETTE[12] },
  { id: "regalos", name: "Regalos", icon: "Gift", color: CAT_PALETTE[4] },
  { id: "ventas", name: "Ventas", icon: "ShoppingCart", color: CAT_PALETTE[7] },
  { id: "reembolsos", name: "Reembolsos", icon: "RotateCcw", color: CAT_PALETTE[9] },
  { id: "otros_ing", name: "Otros", icon: "MoreHorizontal", color: CAT_PALETTE[13] },
];

/* ============================== HELPERS ============================== */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtMoney = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 2 }).format(Number(n) || 0);
const fmtMoneyShort = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1000) return "S/ " + (v / 1000).toFixed(1) + "k";
  return "S/ " + v.toFixed(0);
};
const parseDate = (d) => (d ? new Date(d + "T00:00:00") : null);
const daysBetween = (a, b) => (b - a) / 86400000;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const pct = (part, whole) => (whole > 0 ? clamp(part / whole, 0, 1) : 0);

function seedData() {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const dISO = (year, month, day) => new Date(year, month, day).toISOString().slice(0, 10);
  const incomes = [
    { id: uid(), date: dISO(y, m, 1), description: "Sueldo mensual", category: "salario", amount: 4200, paymentMethod: "Transferencia", notes: "" },
    { id: uid(), date: dISO(y, m, 12), description: "Proyecto freelance", category: "freelance", amount: 850, paymentMethod: "Transferencia", notes: "Diseño de landing page" },
    { id: uid(), date: dISO(y, m - 1, 1), description: "Sueldo mensual", category: "salario", amount: 4200, paymentMethod: "Transferencia", notes: "" },
    { id: uid(), date: dISO(y, m - 2, 1), description: "Sueldo mensual", category: "salario", amount: 4100, paymentMethod: "Transferencia", notes: "" },
  ];
  const expenses = [
    { id: uid(), date: dISO(y, m, 2), description: "Supermercado", category: "alimentacion", subcategory: "Mercado", amount: 320, paymentMethod: "Tarjeta de débito", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 3), description: "Alquiler", category: "vivienda", subcategory: "", amount: 1400, paymentMethod: "Transferencia", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 4), description: "Internet + luz", category: "servicios", subcategory: "", amount: 210, paymentMethod: "Tarjeta de débito", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 5), description: "Gasolina", category: "transporte", subcategory: "Combustible", amount: 150, paymentMethod: "Efectivo", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 7), description: "Cine con amigos", category: "entretenimiento", subcategory: "", amount: 65, paymentMethod: "Tarjeta de crédito", priority: "Deseo", notes: "" },
    { id: uid(), date: dISO(y, m, 9), description: "Netflix + Spotify", category: "suscripciones", subcategory: "", amount: 55, paymentMethod: "Tarjeta de crédito", priority: "Deseo", notes: "" },
    { id: uid(), date: dISO(y, m, 11), description: "Consulta médica", category: "salud", subcategory: "", amount: 120, paymentMethod: "Efectivo", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 14), description: "Zapatillas nuevas", category: "compras", subcategory: "Calzado", amount: 280, paymentMethod: "Tarjeta de crédito", priority: "Deseo", notes: "" },
    { id: uid(), date: dISO(y, m, 16), description: "Curso online", category: "educacion", subcategory: "", amount: 190, paymentMethod: "Tarjeta de débito", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m, 18), description: "Comida para mascota", category: "mascotas", subcategory: "", amount: 90, paymentMethod: "Efectivo", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m - 1, 5), description: "Alquiler", category: "vivienda", subcategory: "", amount: 1400, paymentMethod: "Transferencia", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m - 1, 10), description: "Supermercado", category: "alimentacion", subcategory: "", amount: 380, paymentMethod: "Tarjeta de débito", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m - 1, 20), description: "Viaje corto", category: "viajes", subcategory: "", amount: 540, paymentMethod: "Tarjeta de crédito", priority: "Deseo", notes: "" },
    { id: uid(), date: dISO(y, m - 2, 8), description: "Alquiler", category: "vivienda", subcategory: "", amount: 1400, paymentMethod: "Transferencia", priority: "Necesidad", notes: "" },
    { id: uid(), date: dISO(y, m - 2, 15), description: "Supermercado", category: "alimentacion", subcategory: "", amount: 300, paymentMethod: "Tarjeta de débito", priority: "Necesidad", notes: "" },
  ];
  const goals = [
    { id: uid(), name: "Fondo de emergencia", description: "3 meses de gastos cubiertos", targetAmount: 12000, currentAmount: 5400, startDate: dISO(y, m - 4, 1), targetDate: dISO(y, m + 5, 1) },
    { id: uid(), name: "Viaje a Cusco", description: "Vacaciones de fin de año", targetAmount: 3000, currentAmount: 950, startDate: dISO(y, m - 2, 1), targetDate: dISO(y, m + 3, 1) },
    { id: uid(), name: "Laptop nueva", description: "Reemplazar equipo de trabajo", targetAmount: 5500, currentAmount: 5500, startDate: dISO(y, m - 6, 1), targetDate: dISO(y, m - 1, 1) },
  ];
  const budgets = { alimentacion: 900, transporte: 350, entretenimiento: 200, compras: 250, suscripciones: 80, vivienda: 1400, servicios: 250 };
  return { incomes, expenses, goals, budgets };
}

/* ============================== PERSISTENCE ============================== */
const STORAGE_KEY = "expense-tracker:state:v1";
async function loadState() {
  try {
    const res = await window.storage.get(STORAGE_KEY, false);
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) { /* not found or error — fall through */ }
  return null;
}
async function saveState(state) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(state), false);
  } catch (e) { console.error("No se pudo guardar", e); }
}

/* ============================== SMALL UI PARTS ============================== */
function Icon({ name, size = 18, color, strokeWidth = 2 }) {
  const Cmp = ALL_ICONS[name] || MoreHorizontal;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}

function CatBadge({ cat, size = 34 }) {
  if (!cat) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32, background: cat.color + "22",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon name={cat.icon} size={size * 0.52} color={cat.color} />
    </div>
  );
}

function ProgressBar({ value, color, track, height = 8 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 999, background: track, overflow: "hidden" }}>
      <div style={{ width: `${clamp(value, 0, 1) * 100}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  );
}

function StatusPill({ label, tone, t }) {
  const map = {
    green: { bg: C.incomeSoft, fg: C.income },
    yellow: { bg: C.amberSoft, fg: C.amber },
    red: { bg: C.roseSoft, fg: C.rose },
    blue: { bg: C.blueSoft, fg: C.blue },
  };
  const s = map[tone] || map.blue;
  return (
    <span style={{
      fontFamily: "'Public Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "3px 10px",
      borderRadius: 999, background: s.bg, color: s.fg, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [themeName, setThemeName] = useState("light");
  const t = THEME[themeName];
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [expenseCats, setExpenseCats] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCats, setIncomeCats] = useState(DEFAULT_INCOME_CATEGORIES);

  const now = new Date();
  const [fMonth, setFMonth] = useState(now.getMonth());
  const [fYear, setFYear] = useState(now.getFullYear());
  const [fCategory, setFCategory] = useState("all");
  const [fPayment, setFPayment] = useState("all");
  const [fType, setFType] = useState("all");
  const [fPriority, setFPriority] = useState("all");

  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved) {
        setIncomes(saved.incomes || []);
        setExpenses(saved.expenses || []);
        setGoals(saved.goals || []);
        setBudgets(saved.budgets || {});
        setExpenseCats(saved.expenseCats || DEFAULT_EXPENSE_CATEGORIES);
        setIncomeCats(saved.incomeCats || DEFAULT_INCOME_CATEGORIES);
        setThemeName(saved.theme || "light");
      } else {
        const seed = seedData();
        setIncomes(seed.incomes);
        setExpenses(seed.expenses);
        setGoals(seed.goals);
        setBudgets(seed.budgets);
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState({ incomes, expenses, goals, budgets, expenseCats, incomeCats, theme: themeName });
    }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [incomes, expenses, goals, budgets, expenseCats, incomeCats, themeName, ready]);

  const catById = useMemo(() => {
    const map = {};
    expenseCats.forEach((c) => (map["e:" + c.id] = c));
    incomeCats.forEach((c) => (map["i:" + c.id] = c));
    return map;
  }, [expenseCats, incomeCats]);

  const allYears = useMemo(() => {
    const ys = new Set([now.getFullYear()]);
    incomes.forEach((i) => ys.add(new Date(i.date).getFullYear()));
    expenses.forEach((e) => ys.add(new Date(e.date).getFullYear()));
    return Array.from(ys).sort((a, b) => b - a);
  }, [incomes, expenses]);

  /* ---------- CRUD ---------- */
  const addIncome = (data) => setIncomes((p) => [{ id: uid(), ...data }, ...p]);
  const updateIncome = (id, data) => setIncomes((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  const deleteIncome = (id) => setIncomes((p) => p.filter((x) => x.id !== id));

  const addExpense = (data) => setExpenses((p) => [{ id: uid(), ...data }, ...p]);
  const updateExpense = (id, data) => setExpenses((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  const deleteExpense = (id) => setExpenses((p) => p.filter((x) => x.id !== id));

  const addGoal = (data) => setGoals((p) => [{ id: uid(), ...data }, ...p]);
  const updateGoal = (id, data) => setGoals((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  const deleteGoal = (id) => setGoals((p) => p.filter((x) => x.id !== id));

  const setBudget = (catId, amount) => setBudgets((p) => ({ ...p, [catId]: amount }));

  const addExpenseCategory = (cat) => setExpenseCats((p) => [...p, { id: uid(), ...cat }]);
  const updateExpenseCategory = (id, data) => setExpenseCats((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const deleteExpenseCategory = (id) => setExpenseCats((p) => p.filter((c) => c.id !== id));
  const addIncomeCategory = (cat) => setIncomeCats((p) => [...p, { id: uid(), ...cat }]);
  const updateIncomeCategory = (id, data) => setIncomeCats((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const deleteIncomeCategory = (id) => setIncomeCats((p) => p.filter((c) => c.id !== id));

  /* ---------- DERIVED / FILTERED ---------- */
  const txAll = useMemo(() => {
    const inc = incomes.map((x) => ({ ...x, type: "ingreso" }));
    const exp = expenses.map((x) => ({ ...x, type: "gasto" }));
    return [...inc, ...exp].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes, expenses]);

  const txFiltered = useMemo(() => {
    return txAll.filter((x) => {
      const d = new Date(x.date);
      if (fMonth !== "all" && d.getMonth() !== fMonth) return false;
      if (fYear !== "all" && d.getFullYear() !== fYear) return false;
      if (fType !== "all" && x.type !== fType) return false;
      if (fCategory !== "all" && x.category !== fCategory) return false;
      if (fPayment !== "all" && x.paymentMethod !== fPayment) return false;
      if (fPriority !== "all" && x.type === "gasto" && x.priority !== fPriority) return false;
      return true;
    });
  }, [txAll, fMonth, fYear, fType, fCategory, fPayment, fPriority]);

  const monthIncomes = useMemo(() => txFiltered.filter((x) => x.type === "ingreso"), [txFiltered]);
  const monthExpenses = useMemo(() => txFiltered.filter((x) => x.type === "gasto"), [txFiltered]);
  const sumIncomes = monthIncomes.reduce((s, x) => s + Number(x.amount), 0);
  const sumExpenses = monthExpenses.reduce((s, x) => s + Number(x.amount), 0);
  const balance = sumIncomes - sumExpenses;

  const totalSavings = useMemo(() => {
    const ti = incomes.reduce((s, x) => s + Number(x.amount), 0);
    const te = expenses.reduce((s, x) => s + Number(x.amount), 0);
    return ti - te;
  }, [incomes, expenses]);

  const daysElapsedInMonth = useMemo(() => {
    if (fYear === now.getFullYear() && fMonth === now.getMonth()) return now.getDate();
    return new Date(fYear === "all" ? now.getFullYear() : fYear, (fMonth === "all" ? 11 : fMonth) + 1, 0).getDate();
  }, [fMonth, fYear]);
  const avgDaily = sumExpenses / Math.max(1, daysElapsedInMonth);

  const avgMonthly = useMemo(() => {
    const byMonth = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const k = d.getFullYear() + "-" + d.getMonth();
      byMonth[k] = (byMonth[k] || 0) + Number(e.amount);
    });
    const vals = Object.values(byMonth);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }, [expenses]);

  const catSpendMap = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => (map[e.category] = (map[e.category] || 0) + Number(e.amount)));
    return map;
  }, [monthExpenses]);
  const catSpendSorted = Object.entries(catSpendMap).sort((a, b) => b[1] - a[1]);
  const topCat = catSpendSorted[0];
  const lowCat = catSpendSorted[catSpendSorted.length - 1];

  const goalsWithStatus = useMemo(() => goals.map((g) => ({ ...g, ...computeGoalStatus(g) })), [goals]);
  const goalsCompleted = goalsWithStatus.filter((g) => g.status === "Completado").length;
  const goalsPending = goalsWithStatus.length - goalsCompleted;

  const budgetRows = useMemo(() => {
    return expenseCats.map((c) => {
      const b = Number(budgets[c.id]) || 0;
      const spentThisMonth = expenses
        .filter((e) => e.category === c.id && new Date(e.date).getMonth() === now.getMonth() && new Date(e.date).getFullYear() === now.getFullYear())
        .reduce((s, e) => s + Number(e.amount), 0);
      const ratio = b > 0 ? spentThisMonth / b : 0;
      const color = ratio > 0.9 ? "red" : ratio > 0.7 ? "yellow" : "green";
      return { cat: c, budget: b, spent: spentThisMonth, remaining: b - spentThisMonth, ratio, color };
    }).filter((r) => r.budget > 0);
  }, [expenseCats, budgets, expenses]);

  const alerts = useMemo(() => {
    const list = [];
    budgetRows.forEach((r) => {
      if (r.ratio >= 1) list.push({ tone: "red", text: `Presupuesto de "${r.cat.name}" superado (${Math.round(r.ratio * 100)}%)` });
      else if (r.ratio >= 0.9) list.push({ tone: "yellow", text: `Presupuesto de "${r.cat.name}" cerca del límite (${Math.round(r.ratio * 100)}%)` });
    });
    goalsWithStatus.forEach((g) => {
      if (g.status === "Retrasado") list.push({ tone: "red", text: `Objetivo "${g.name}" está retrasado` });
    });
    return list;
  }, [budgetRows, goalsWithStatus]);

  /* ---------- CHART DATA (year-based, ignores month filter) ---------- */
  const chartYear = fYear === "all" ? now.getFullYear() : fYear;
  const monthlyEvolution = useMemo(() => {
    return MONTHS_ES.map((label, idx) => {
      const inc = incomes.filter((x) => { const d = new Date(x.date); return d.getFullYear() === chartYear && d.getMonth() === idx; }).reduce((s, x) => s + Number(x.amount), 0);
      const exp = expenses.filter((x) => { const d = new Date(x.date); return d.getFullYear() === chartYear && d.getMonth() === idx; }).reduce((s, x) => s + Number(x.amount), 0);
      return { mes: label, Ingresos: inc, Gastos: exp, Balance: inc - exp };
    });
  }, [incomes, expenses, chartYear]);

  const dailyExpensesThisMonth = useMemo(() => {
    const dim = new Date(chartYear, (fMonth === "all" ? now.getMonth() : fMonth) + 1, 0).getDate();
    const arr = Array.from({ length: dim }, (_, i) => ({ dia: i + 1, Gastos: 0 }));
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getFullYear() === chartYear && d.getMonth() === (fMonth === "all" ? now.getMonth() : fMonth)) {
        arr[d.getDate() - 1].Gastos += Number(e.amount);
      }
    });
    return arr;
  }, [expenses, chartYear, fMonth]);

  const paymentDist = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => { const k = e.paymentMethod || "Sin especificar"; map[k] = (map[k] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [monthExpenses]);

  const savingsEvolution = useMemo(() => {
    const sorted = [...incomes.map((x) => ({ ...x, sign: 1 })), ...expenses.map((x) => ({ ...x, sign: -1 }))].sort((a, b) => new Date(a.date) - new Date(b.date));
    let running = 0;
    const byMonthKey = {};
    sorted.forEach((x) => {
      running += x.sign * Number(x.amount);
      const d = new Date(x.date);
      const k = d.getFullYear() + "-" + String(d.getMonth()).padStart(2, "0");
      byMonthKey[k] = running;
    });
    return Object.entries(byMonthKey).map(([k, v]) => {
      const [y, m] = k.split("-").map(Number);
      return { mes: MONTHS_ES[m] + " " + String(y).slice(2), Ahorro: Math.round(v) };
    });
  }, [incomes, expenses]);

  const categoryTrend = useMemo(() => {
    const top5 = catSpendSorted.slice(0, 5).map(([id]) => id);
    return MONTHS_ES.map((label, idx) => {
      const row = { mes: label };
      top5.forEach((catId) => {
        const cat = expenseCats.find((c) => c.id === catId);
        row[cat ? cat.name : catId] = expenses
          .filter((e) => e.category === catId && new Date(e.date).getFullYear() === chartYear && new Date(e.date).getMonth() === idx)
          .reduce((s, e) => s + Number(e.amount), 0);
      });
      return row;
    });
  }, [expenses, catSpendSorted, chartYear, expenseCats]);

  const top10Expenses = useMemo(() => [...monthExpenses].sort((a, b) => b.amount - a.amount).slice(0, 10), [monthExpenses]);

  const donutData = catSpendSorted.map(([catId, val]) => {
    const cat = expenseCats.find((c) => c.id === catId);
    return { name: cat ? cat.name : catId, value: val, color: cat ? cat.color : "#888" };
  });

  /* ---------- STYLES ---------- */
  const page = { minHeight: "100vh", background: t.bg, color: t.ink, fontFamily: "'Public Sans', sans-serif", transition: "background 0.25s ease" };
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const display = { fontFamily: "'Fraunces', serif" };

  if (!ready) {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ ...mono, color: t.inkSub }}>Cargando…</div>
      </div>
    );
  }

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ingresos", label: "Ingresos", icon: ArrowUpCircle },
    { id: "gastos", label: "Gastos", icon: ArrowDownCircle },
    { id: "objetivos", label: "Objetivos", icon: Target },
    { id: "presupuestos", label: "Presupuestos", icon: Wallet },
    { id: "reportes", label: "Reportes", icon: FileBarChart },
    { id: "categorias", label: "Categorías", icon: Tags },
  ];

  return (
    <div style={page}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Public Sans', sans-serif; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${C.income}55; outline-offset: 1px; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 8px; }
        table { border-collapse: collapse; width: 100%; }
        @media (max-width: 860px) {
          .et-sidebar { position: fixed; z-index: 40; height: 100%; transform: translateX(-100%); transition: transform .25s ease; }
          .et-sidebar.open { transform: translateX(0); }
          .et-main { margin-left: 0 !important; }
        }
      `}</style>

      <div style={{ display: "flex" }}>
        {/* SIDEBAR */}
        <div className={`et-sidebar${navOpen ? " open" : ""}`} style={{
          width: 236, flexShrink: 0, background: t.surface, borderRight: `1px solid ${t.border}`,
          padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.income, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Receipt size={18} color="#fff" />
            </div>
            <div>
              <div style={{ ...display, fontWeight: 600, fontSize: 17, lineHeight: 1 }}>Ledger</div>
              <div style={{ fontSize: 11, color: t.inkSub, marginTop: 2 }}>Finanzas personales</div>
            </div>
          </div>

          {TABS.map((tb) => {
            const Ic = tb.icon;
            const active = tab === tb.id;
            return (
              <button key={tb.id} onClick={() => { setTab(tb.id); setNavOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
                border: "none", cursor: "pointer", textAlign: "left",
                background: active ? (themeName === "light" ? "#EAF3EE" : "#1B3B2E") : "transparent",
                color: active ? C.income : t.ink, fontSize: 14, fontWeight: active ? 600 : 500,
              }}>
                <Ic size={17} /> {tb.label}
              </button>
            );
          })}

          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
            <button onClick={() => setThemeName(themeName === "light" ? "dark" : "light")} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
              border: `1px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.ink,
              fontSize: 13, width: "100%",
            }}>
              {themeName === "light" ? <Moon size={15} /> : <Sun size={15} />}
              {themeName === "light" ? "Modo oscuro" : "Modo claro"}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="et-main" style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px",
            borderBottom: `1px solid ${t.border}`, background: t.surface, position: "sticky", top: 0, zIndex: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setNavOpen(!navOpen)} style={{ display: "none", border: "none", background: "none", cursor: "pointer" }} className="et-menu-btn">
                <Menu size={20} color={t.ink} />
              </button>
              <div style={{ ...display, fontSize: 21, fontWeight: 600 }}>{TABS.find((x) => x.id === tab)?.label}</div>
            </div>
            <div style={{ ...mono, fontSize: 13, color: t.inkSub }}>{MONTHS_FULL[now.getMonth()]} {now.getFullYear()}</div>
          </div>

          <div style={{ padding: "22px 24px 60px", maxWidth: 1320 }}>
            {tab === "dashboard" && (
              <Dashboard {...{
                t, themeName, fMonth, setFMonth, fYear, setFYear, fCategory, setFCategory, fPayment, setFPayment,
                fType, setFType, fPriority, setFPriority, allYears, expenseCats, incomeCats,
                sumIncomes, sumExpenses, balance, totalSavings, avgDaily, avgMonthly, topCat, lowCat,
                txCount: txFiltered.length, goalsCompleted, goalsPending, alerts, donutData,
                monthlyEvolution, dailyExpensesThisMonth, paymentDist, savingsEvolution, categoryTrend,
                goalsWithStatus, top10Expenses, chartYear, mono, display,
              }} />
            )}
            {tab === "ingresos" && (
              <IncomesTab {...{ t, mono, display, incomes, incomeCats, addIncome, updateIncome, deleteIncome }} />
            )}
            {tab === "gastos" && (
              <ExpensesTab {...{ t, mono, display, expenses, expenseCats, addExpense, updateExpense, deleteExpense }} />
            )}
            {tab === "objetivos" && (
              <GoalsTab {...{ t, mono, display, themeName, goals, goalsWithStatus, addGoal, updateGoal, deleteGoal }} />
            )}
            {tab === "presupuestos" && (
              <BudgetsTab {...{ t, mono, display, expenseCats, budgets, setBudget, budgetRows }} />
            )}
            {tab === "reportes" && (
              <ReportsTab {...{
                t, mono, display, themeName, incomes, expenses, expenseCats, incomeCats, goalsWithStatus,
                chartYear, fYear, setFYear, allYears, monthlyEvolution, savingsEvolution,
              }} />
            )}
            {tab === "categorias" && (
              <CategoriesTab {...{
                t, mono, display, expenseCats, incomeCats,
                addExpenseCategory, updateExpenseCategory, deleteExpenseCategory,
                addIncomeCategory, updateIncomeCategory, deleteIncomeCategory,
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== GOAL STATUS ============================== */
function computeGoalStatus(goal) {
  const start = new Date(goal.startDate);
  const target = new Date(goal.targetDate);
  const now = new Date();
  const totalDays = Math.max(1, daysBetween(start, target));
  const elapsedDays = clamp(daysBetween(start, now), 0, totalDays);
  const expectedPct = clamp(elapsedDays / totalDays, 0, 1);
  const actualPct = pct(Number(goal.currentAmount), Number(goal.targetAmount));
  const remainingAmount = Math.max(0, Number(goal.targetAmount) - Number(goal.currentAmount));
  const remainingDays = Math.max(0, daysBetween(now, target));
  const remainingMonths = Math.max(1 / 30, remainingDays / 30);
  const neededMonthly = remainingAmount / remainingMonths;

  let status = "En progreso", color = "green";
  if (actualPct >= 1) { status = "Completado"; color = "green"; }
  else if (now > target) { status = "Retrasado"; color = "red"; }
  else {
    const diff = expectedPct - actualPct;
    if (diff > 0.15) { status = "Retrasado"; color = "red"; }
    else if (diff > 0.05) { status = "En progreso"; color = "yellow"; }
    else { status = "En progreso"; color = "green"; }
  }
  return { status, color, expectedPct, actualPct, remainingAmount, remainingDays, neededMonthly };
}

/* ============================== SHARED CARD/CHART WRAPPERS ============================== */
function Card({ t, children, style }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, boxShadow: t.shadow, ...style }}>
      {children}
    </div>
  );
}

function ChartCard({ t, title, subtitle, height = 280, children, display }) {
  return (
    <Card t={t} style={{ padding: "18px 18px 10px" }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ ...display, fontSize: 15, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: t.inkSub, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ width: "100%", height }}>{children}</div>
    </Card>
  );
}

function StatCard({ t, mono, label, value, sub, tone = "ink", icon: Ic }) {
  const toneColor = { ink: t.ink, income: C.income, expense: C.expense, amber: C.amber, rose: C.rose }[tone];
  return (
    <Card t={t} style={{ padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12.5, color: t.inkSub, fontWeight: 600 }}>{label}</div>
        {Ic && <Ic size={16} color={t.inkSub} />}
      </div>
      <div style={{ ...mono, fontSize: 22, fontWeight: 600, color: toneColor, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: t.inkSub, marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

function tooltipStyle(t) {
  return { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 12, fontFamily: "'Public Sans', sans-serif", color: t.ink };
}

/* ============================== FILTER BAR ============================== */
function FilterBar({ t, mono, fMonth, setFMonth, fYear, setFYear, fCategory, setFCategory, fPayment, setFPayment, fType, setFType, fPriority, setFPriority, allYears, expenseCats, incomeCats }) {
  const sel = { padding: "7px 10px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.ink, fontSize: 13 };
  const allCats = [...expenseCats, ...incomeCats];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 18 }}>
      <select style={sel} value={fMonth} onChange={(e) => setFMonth(e.target.value === "all" ? "all" : Number(e.target.value))}>
        <option value="all">Todos los meses</option>
        {MONTHS_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
      <select style={sel} value={fYear} onChange={(e) => setFYear(e.target.value === "all" ? "all" : Number(e.target.value))}>
        <option value="all">Todos los años</option>
        {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <select style={sel} value={fType} onChange={(e) => setFType(e.target.value)}>
        <option value="all">Todos los movimientos</option>
        <option value="ingreso">Solo ingresos</option>
        <option value="gasto">Solo gastos</option>
      </select>
      <select style={sel} value={fCategory} onChange={(e) => setFCategory(e.target.value)}>
        <option value="all">Todas las categorías</option>
        {allCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select style={sel} value={fPayment} onChange={(e) => setFPayment(e.target.value)}>
        <option value="all">Todos los métodos de pago</option>
        {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select style={sel} value={fPriority} onChange={(e) => setFPriority(e.target.value)}>
        <option value="all">Necesidad y deseo</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function Dashboard(props) {
  const {
    t, themeName, mono, display, sumIncomes, sumExpenses, balance, totalSavings, avgDaily, avgMonthly,
    topCat, lowCat, txCount, goalsCompleted, goalsPending, alerts, donutData, monthlyEvolution,
    dailyExpensesThisMonth, paymentDist, savingsEvolution, categoryTrend, goalsWithStatus, top10Expenses,
    expenseCats,
  } = props;

  const topCatName = topCat ? (expenseCats.find((c) => c.id === topCat[0])?.name || topCat[0]) : "—";
  const lowCatName = lowCat ? (expenseCats.find((c) => c.id === lowCat[0])?.name || lowCat[0]) : "—";
  const catTrendKeys = categoryTrend[0] ? Object.keys(categoryTrend[0]).filter((k) => k !== "mes") : [];

  return (
    <div>
      <FilterBar {...props} />

      {alerts.length > 0 && (
        <Card t={t} style={{ padding: "14px 16px", marginBottom: 18, borderColor: C.roseSoft }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color={C.rose} />
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Alertas</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ fontSize: 13, color: a.tone === "red" ? C.rose : C.amber }}>• {a.text}</div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard t={t} mono={mono} label="Ingresos del periodo" value={fmtMoney(sumIncomes)} tone="income" icon={ArrowUpCircle} />
        <StatCard t={t} mono={mono} label="Gastos del periodo" value={fmtMoney(sumExpenses)} tone="expense" icon={ArrowDownCircle} />
        <StatCard t={t} mono={mono} label="Balance del periodo" value={fmtMoney(balance)} tone={balance >= 0 ? "income" : "rose"} icon={Wallet} />
        <StatCard t={t} mono={mono} label="Ahorro total acumulado" value={fmtMoney(totalSavings)} tone="income" icon={PiggyBank} />
        <StatCard t={t} mono={mono} label="Gasto promedio diario" value={fmtMoney(avgDaily)} />
        <StatCard t={t} mono={mono} label="Gasto promedio mensual" value={fmtMoney(avgMonthly)} />
        <StatCard t={t} mono={mono} label="Categoría con mayor gasto" value={topCatName} sub={topCat ? fmtMoney(topCat[1]) : ""} tone="expense" />
        <StatCard t={t} mono={mono} label="Categoría con menor gasto" value={lowCatName} sub={lowCat ? fmtMoney(lowCat[1]) : ""} tone="income" />
        <StatCard t={t} mono={mono} label="N° de transacciones" value={txCount} icon={Receipt} />
        <StatCard t={t} mono={mono} label="Objetivos" value={`${goalsCompleted} cumplidos`} sub={`${goalsPending} pendientes`} icon={Target} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16 }}>
        <ChartCard t={t} display={display} title="Gastos por categoría" subtitle="Distribución del periodo filtrado">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
                {donutData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Evolución de ingresos y gastos" subtitle="Por mes durante el año">
          <ResponsiveContainer>
            <LineChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.inkSub }} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Ingresos" stroke={C.income} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Gastos" stroke={C.expense} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Balance mensual" subtitle="Ingresos menos gastos por mes">
          <ResponsiveContainer>
            <BarChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.inkSub }} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Bar dataKey="Balance" radius={[6, 6, 0, 0]}>
                {monthlyEvolution.map((d, i) => <Cell key={i} fill={d.Balance >= 0 ? C.income : C.rose} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Gastos diarios del mes" subtitle="Detalle día a día">
          <ResponsiveContainer>
            <AreaChart data={dailyExpensesThisMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: t.inkSub }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} labelFormatter={(l) => "Día " + l} />
              <Area type="monotone" dataKey="Gastos" stroke={C.expense} fill={C.expense + "33"} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Distribución de métodos de pago" subtitle="Gastos del periodo filtrado">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={paymentDist} dataKey="value" nameKey="name" innerRadius="0%" outerRadius="85%" paddingAngle={2}>
                {paymentDist.map((d, i) => <Cell key={i} fill={CAT_PALETTE[i % CAT_PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Evolución del ahorro" subtitle="Balance acumulado histórico">
          <ResponsiveContainer>
            <AreaChart data={savingsEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: t.inkSub }} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Area type="monotone" dataKey="Ahorro" stroke={C.income} fill={C.income + "33"} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Comparativa ingresos vs gastos" subtitle="Por mes durante el año">
          <ResponsiveContainer>
            <BarChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.inkSub }} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Ingresos" fill={C.income} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Gastos" fill={C.expense} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Avance de objetivos financieros" subtitle="Porcentaje alcanzado por objetivo" height={Math.max(220, goalsWithStatus.length * 46)}>
          <ResponsiveContainer>
            <BarChart data={goalsWithStatus.map((g) => ({ name: g.name, Progreso: Math.round(g.actualPct * 100) }))} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: t.inkSub }} unit="%" />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: t.inkSub }} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => v + "%"} />
              <Bar dataKey="Progreso" radius={[0, 6, 6, 0]}>
                {goalsWithStatus.map((g, i) => <Cell key={i} fill={g.color === "green" ? C.income : g.color === "yellow" ? C.amber : C.rose} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Tendencia de gastos por categoría" subtitle="Top 5 categorías durante el año">
          <ResponsiveContainer>
            <LineChart data={categoryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.inkSub }} />
              <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {catTrendKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={CAT_PALETTE[i % CAT_PALETTE.length]} strokeWidth={2} dot={false} />)}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard t={t} display={display} title="Top 10 gastos" subtitle="Movimientos más altos del periodo" height={Math.max(220, top10Expenses.length * 32)}>
          <ResponsiveContainer>
            <BarChart data={top10Expenses.map((e) => ({ name: e.description.slice(0, 18), Monto: Number(e.amount) }))} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis type="number" tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: t.inkSub }} />
              <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
              <Bar dataKey="Monto" fill={C.expense} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ============================== FORM FIELDS ============================== */
function Field({ label, children, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: t.inkSub }}>{label}</label>
      {children}
    </div>
  );
}
function inputStyle(t) {
  return { padding: "9px 11px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.ink, fontSize: 13.5, width: "100%" };
}
function btnPrimary(bg) {
  return { padding: "9px 16px", borderRadius: 9, border: "none", background: bg, color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };
}
function btnGhost(t) {
  return { padding: "9px 14px", borderRadius: 9, border: `1px solid ${t.border}`, background: "transparent", color: t.ink, fontSize: 13.5, cursor: "pointer" };
}
function iconBtn(t) {
  return { border: "none", background: "transparent", cursor: "pointer", padding: 6, borderRadius: 7, display: "flex" };
}

/* ============================== INCOMES TAB ============================== */
function IncomesTab({ t, mono, display, incomes, incomeCats, addIncome, updateIncome, deleteIncome }) {
  const blank = { date: todayISO(), description: "", category: incomeCats[0]?.id || "", amount: "", paymentMethod: "", notes: "" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!form.description || !form.amount) return;
    if (editingId) { updateIncome(editingId, { ...form, amount: Number(form.amount) }); setEditingId(null); }
    else addIncome({ ...form, amount: Number(form.amount) });
    setForm(blank); setShowForm(false);
  };
  const startEdit = (row) => { setForm({ ...row, amount: String(row.amount) }); setEditingId(row.id); setShowForm(true); };

  const total = incomes.reduce((s, x) => s + Number(x.amount), 0);
  const sorted = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.inkSub }}>Total registrado: <b style={{ ...mono, color: C.income }}>{fmtMoney(total)}</b></div>
        <button style={btnPrimary(C.income)} onClick={() => { setForm(blank); setEditingId(null); setShowForm(!showForm); }}>
          <Plus size={15} /> Nuevo ingreso
        </button>
      </div>

      {showForm && (
        <Card t={t} style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
            <Field t={t} label="Fecha"><input type="date" style={inputStyle(t)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field t={t} label="Descripción"><input style={inputStyle(t)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej. Sueldo mensual" /></Field>
            <Field t={t} label="Categoría">
              <select style={inputStyle(t)} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {incomeCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field t={t} label="Monto (S/)"><input type="number" style={inputStyle(t)} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></Field>
            <Field t={t} label="Método de pago (opcional)">
              <select style={inputStyle(t)} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                <option value="">Sin especificar</option>
                {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field t={t} label="Notas (opcional)"><input style={inputStyle(t)} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btnPrimary(C.income)} onClick={submit}><Check size={15} /> Guardar</button>
            <button style={btnGhost(t)} onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
          </div>
        </Card>
      )}

      <Card t={t} style={{ overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ background: t.surfaceAlt }}>
              {["Fecha", "Descripción", "Categoría", "Método", "Monto", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11.5, color: t.inkSub, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const cat = incomeCats.find((c) => c.id === row.category);
              return (
                <tr key={row.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, ...mono, color: t.inkSub, whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13.5 }}>{row.description}{row.notes ? <div style={{ fontSize: 11, color: t.inkSub }}>{row.notes}</div> : null}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><CatBadge cat={cat} size={24} /><span style={{ fontSize: 12.5 }}>{cat?.name}</span></div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12.5, color: t.inkSub }}>{row.paymentMethod || "—"}</td>
                  <td style={{ padding: "10px 14px", ...mono, fontWeight: 600, color: C.income, whiteSpace: "nowrap" }}>{fmtMoney(row.amount)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      <button style={iconBtn(t)} onClick={() => startEdit(row)}><Pencil size={14} color={t.inkSub} /></button>
                      <button style={iconBtn(t)} onClick={() => deleteIncome(row.id)}><Trash2 size={14} color={C.rose} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: t.inkSub, fontSize: 13 }}>Aún no hay ingresos registrados.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================== EXPENSES TAB ============================== */
function ExpensesTab({ t, mono, display, expenses, expenseCats, addExpense, updateExpense, deleteExpense }) {
  const blank = { date: todayISO(), description: "", category: expenseCats[0]?.id || "", subcategory: "", amount: "", paymentMethod: PAYMENT_METHODS[0], priority: "Necesidad", notes: "" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!form.description || !form.amount) return;
    if (editingId) { updateExpense(editingId, { ...form, amount: Number(form.amount) }); setEditingId(null); }
    else addExpense({ ...form, amount: Number(form.amount) });
    setForm(blank); setShowForm(false);
  };
  const startEdit = (row) => { setForm({ ...row, amount: String(row.amount) }); setEditingId(row.id); setShowForm(true); };

  const total = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.inkSub }}>Total registrado: <b style={{ ...mono, color: C.expense }}>{fmtMoney(total)}</b></div>
        <button style={btnPrimary(C.expense)} onClick={() => { setForm(blank); setEditingId(null); setShowForm(!showForm); }}>
          <Plus size={15} /> Nuevo gasto
        </button>
      </div>

      {showForm && (
        <Card t={t} style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
            <Field t={t} label="Fecha"><input type="date" style={inputStyle(t)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field t={t} label="Descripción"><input style={inputStyle(t)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej. Supermercado" /></Field>
            <Field t={t} label="Categoría">
              <select style={inputStyle(t)} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {expenseCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field t={t} label="Subcategoría (opcional)"><input style={inputStyle(t)} value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} /></Field>
            <Field t={t} label="Monto (S/)"><input type="number" style={inputStyle(t)} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></Field>
            <Field t={t} label="Método de pago">
              <select style={inputStyle(t)} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field t={t} label="Prioridad">
              <select style={inputStyle(t)} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field t={t} label="Notas (opcional)"><input style={inputStyle(t)} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btnPrimary(C.expense)} onClick={submit}><Check size={15} /> Guardar</button>
            <button style={btnGhost(t)} onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
          </div>
        </Card>
      )}

      <Card t={t} style={{ overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ background: t.surfaceAlt }}>
              {["Fecha", "Descripción", "Categoría", "Método", "Prioridad", "Monto", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11.5, color: t.inkSub, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const cat = expenseCats.find((c) => c.id === row.category);
              return (
                <tr key={row.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, ...mono, color: t.inkSub, whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13.5 }}>
                    {row.description}
                    {row.subcategory ? <div style={{ fontSize: 11, color: t.inkSub }}>{row.subcategory}</div> : null}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><CatBadge cat={cat} size={24} /><span style={{ fontSize: 12.5 }}>{cat?.name}</span></div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12.5, color: t.inkSub }}>{row.paymentMethod}</td>
                  <td style={{ padding: "10px 14px" }}><StatusPill t={t} label={row.priority} tone={row.priority === "Necesidad" ? "blue" : "yellow"} /></td>
                  <td style={{ padding: "10px 14px", ...mono, fontWeight: 600, color: C.expense, whiteSpace: "nowrap" }}>{fmtMoney(row.amount)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      <button style={iconBtn(t)} onClick={() => startEdit(row)}><Pencil size={14} color={t.inkSub} /></button>
                      <button style={iconBtn(t)} onClick={() => deleteExpense(row.id)}><Trash2 size={14} color={C.rose} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: t.inkSub, fontSize: 13 }}>Aún no hay gastos registrados.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================== GOALS TAB ============================== */
function GoalsTab({ t, mono, display, themeName, goals, goalsWithStatus, addGoal, updateGoal, deleteGoal }) {
  const blank = { name: "", description: "", targetAmount: "", currentAmount: "0", startDate: todayISO(), targetDate: "" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!form.name || !form.targetAmount || !form.targetDate) return;
    const data = { ...form, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount) };
    if (editingId) { updateGoal(editingId, data); setEditingId(null); } else addGoal(data);
    setForm(blank); setShowForm(false);
  };
  const startEdit = (g) => { setForm({ ...g, targetAmount: String(g.targetAmount), currentAmount: String(g.currentAmount) }); setEditingId(g.id); setShowForm(true); };

  const colorMap = { green: C.income, yellow: C.amber, red: C.rose };
  const trackColor = themeName === "light" ? "#EEEAE0" : "#232E3A";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={btnPrimary(C.blue)} onClick={() => { setForm(blank); setEditingId(null); setShowForm(!showForm); }}>
          <Plus size={15} /> Nuevo objetivo
        </button>
      </div>

      {showForm && (
        <Card t={t} style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
            <Field t={t} label="Nombre del objetivo"><input style={inputStyle(t)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field t={t} label="Descripción"><input style={inputStyle(t)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field t={t} label="Monto objetivo (S/)"><input type="number" style={inputStyle(t)} value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} /></Field>
            <Field t={t} label="Monto acumulado (S/)"><input type="number" style={inputStyle(t)} value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} /></Field>
            <Field t={t} label="Fecha de inicio"><input type="date" style={inputStyle(t)} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field t={t} label="Fecha objetivo"><input type="date" style={inputStyle(t)} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btnPrimary(C.blue)} onClick={submit}><Check size={15} /> Guardar</button>
            <button style={btnGhost(t)} onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {goalsWithStatus.map((g) => (
          <Card key={g.id} t={t} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ ...display, fontSize: 16, fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: t.inkSub, marginTop: 2 }}>{g.description}</div>
              </div>
              <StatusPill t={t} label={g.status} tone={g.color} />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: t.inkSub, marginBottom: 5 }}>
                <span style={{ ...mono }}>{fmtMoney(g.currentAmount)}</span>
                <span style={{ ...mono }}>{fmtMoney(g.targetAmount)}</span>
              </div>
              <ProgressBar value={g.actualPct} color={colorMap[g.color]} track={trackColor} height={10} />
              <div style={{ ...mono, fontSize: 12, color: colorMap[g.color], marginTop: 5, fontWeight: 600 }}>{Math.round(g.actualPct * 100)}% completado</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: t.inkSub }}>Restante</div>
                <div style={{ ...mono, fontSize: 13, fontWeight: 600 }}>{fmtMoney(g.remainingAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.inkSub }}>Tiempo restante</div>
                <div style={{ ...mono, fontSize: 13, fontWeight: 600 }}>{Math.max(0, Math.round(g.remainingDays))} días</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: t.inkSub }}>Ahorro mensual necesario</div>
                <div style={{ ...mono, fontSize: 13, fontWeight: 600, color: C.blue }}>{fmtMoney(g.neededMonthly)} / mes</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button style={btnGhost(t)} onClick={() => startEdit(g)}><Pencil size={13} style={{ marginRight: 5 }} />Editar</button>
              <button style={{ ...btnGhost(t), color: C.rose, borderColor: C.roseSoft }} onClick={() => deleteGoal(g.id)}><Trash2 size={13} style={{ marginRight: 5 }} />Eliminar</button>
            </div>
          </Card>
        ))}
        {goalsWithStatus.length === 0 && (
          <div style={{ color: t.inkSub, fontSize: 13, padding: 20 }}>Aún no hay objetivos definidos.</div>
        )}
      </div>
    </div>
  );
}

/* ============================== BUDGETS TAB ============================== */
function BudgetsTab({ t, mono, display, expenseCats, budgets, setBudget, budgetRows }) {
  const colorMap = { green: C.income, yellow: C.amber, red: C.rose };
  return (
    <div>
      <div style={{ fontSize: 13, color: t.inkSub, marginBottom: 16 }}>
        Define un presupuesto mensual por categoría. Se compara automáticamente contra el gasto del mes actual.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {expenseCats.map((c) => {
          const row = budgetRows.find((r) => r.cat.id === c.id);
          const budgetVal = budgets[c.id] || "";
          const spent = row ? row.spent : 0;
          const ratio = row ? row.ratio : 0;
          const color = row ? colorMap[row.color] : t.inkSub;
          return (
            <Card key={c.id} t={t} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <CatBadge cat={c} />
                <div style={{ ...display, fontWeight: 600, fontSize: 14.5 }}>{c.name}</div>
              </div>
              <Field t={t} label="Presupuesto mensual (S/)">
                <input type="number" style={inputStyle(t)} placeholder="0.00" value={budgetVal}
                  onChange={(e) => setBudget(c.id, e.target.value === "" ? undefined : Number(e.target.value))} />
              </Field>
              {row && (
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={ratio} color={color} track={t.surfaceAlt} height={9} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11.5, color: t.inkSub }}>
                    <span style={mono}>{fmtMoney(spent)} gastado</span>
                    <span style={{ ...mono, color }}>{Math.round(ratio * 100)}%</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: t.inkSub, marginTop: 2 }}>
                    Restante: <b style={{ ...mono, color: t.ink }}>{fmtMoney(row.remaining)}</b>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== REPORTS TAB ============================== */
function ReportsTab({ t, mono, display, themeName, incomes, expenses, expenseCats, incomeCats, goalsWithStatus, chartYear, fYear, setFYear, allYears, monthlyEvolution, savingsEvolution }) {
  const [monthA, setMonthA] = useState(new Date().getMonth());
  const [monthB, setMonthB] = useState(Math.max(0, new Date().getMonth() - 1));

  const inYear = (arr) => arr.filter((x) => new Date(x.date).getFullYear() === chartYear);
  const yearIncomes = inYear(incomes), yearExpenses = inYear(expenses);
  const yearIncomeTotal = yearIncomes.reduce((s, x) => s + Number(x.amount), 0);
  const yearExpenseTotal = yearExpenses.reduce((s, x) => s + Number(x.amount), 0);

  const now = new Date();
  const thisMonthExpenses = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const thisMonthIncomes = incomes.filter((e) => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const mIncome = thisMonthIncomes.reduce((s, x) => s + Number(x.amount), 0);
  const mExpense = thisMonthExpenses.reduce((s, x) => s + Number(x.amount), 0);

  const catExpenseRanking = useMemoLike(expenseCats, expenses, "category");
  const catIncomeRanking = useMemoLike(incomeCats, incomes, "category");

  const monthTotal = (list, m) => list.filter((x) => new Date(x.date).getMonth() === m && new Date(x.date).getFullYear() === chartYear).reduce((s, x) => s + Number(x.amount), 0);
  const compareData = [
    { name: MONTHS_FULL[monthA], Ingresos: monthTotal(incomes, monthA), Gastos: monthTotal(expenses, monthA) },
    { name: MONTHS_FULL[monthB], Ingresos: monthTotal(incomes, monthB), Gastos: monthTotal(expenses, monthB) },
  ];

  const completedGoals = goalsWithStatus.filter((g) => g.status === "Completado");
  const sel = { padding: "7px 10px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.ink, fontSize: 13 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 12.5, color: t.inkSub }}>Año de análisis:</span>
        <select style={sel} value={fYear === "all" ? chartYear : fYear} onChange={(e) => setFYear(Number(e.target.value))}>
          {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Resumen mensual / anual */}
      <div>
        <div style={{ ...display, fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Resumen mensual (mes actual)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
          <StatCard t={t} mono={mono} label="Ingresos" value={fmtMoney(mIncome)} tone="income" />
          <StatCard t={t} mono={mono} label="Gastos" value={fmtMoney(mExpense)} tone="expense" />
          <StatCard t={t} mono={mono} label="Balance" value={fmtMoney(mIncome - mExpense)} tone={mIncome - mExpense >= 0 ? "income" : "rose"} />
          <StatCard t={t} mono={mono} label="% ahorrado" value={mIncome > 0 ? Math.round(((mIncome - mExpense) / mIncome) * 100) + "%" : "—"} />
        </div>
      </div>

      <div>
        <div style={{ ...display, fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Resumen anual ({chartYear})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
          <StatCard t={t} mono={mono} label="Ingresos del año" value={fmtMoney(yearIncomeTotal)} tone="income" />
          <StatCard t={t} mono={mono} label="Gastos del año" value={fmtMoney(yearExpenseTotal)} tone="expense" />
          <StatCard t={t} mono={mono} label="Balance del año" value={fmtMoney(yearIncomeTotal - yearExpenseTotal)} tone={yearIncomeTotal - yearExpenseTotal >= 0 ? "income" : "rose"} />
          <StatCard t={t} mono={mono} label="Transacciones" value={yearIncomes.length + yearExpenses.length} />
        </div>
      </div>

      {/* Evolución patrimonio */}
      <ChartCard t={t} display={display} title="Evolución del patrimonio" subtitle="Balance acumulado histórico">
        <ResponsiveContainer>
          <AreaChart data={savingsEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: t.inkSub }} />
            <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
            <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
            <Area type="monotone" dataKey="Ahorro" stroke={C.blue} fill={C.blue + "33"} strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gastos e ingresos por categoría */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px,1fr))", gap: 16 }}>
        <RankingTable t={t} mono={mono} display={display} title="Gastos por categoría" rows={catExpenseRanking} total={yearExpenseTotal} color={C.expense} />
        <RankingTable t={t} mono={mono} display={display} title="Ingresos por categoría" rows={catIncomeRanking} total={yearIncomeTotal} color={C.income} />
      </div>

      {/* Comparación entre meses */}
      <ChartCard t={t} display={display} title="Comparación entre meses" subtitle="Selecciona dos meses para comparar">
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <select style={sel} value={monthA} onChange={(e) => setMonthA(Number(e.target.value))}>{MONTHS_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
          <select style={sel} value={monthB} onChange={(e) => setMonthB(Number(e.target.value))}>{MONTHS_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={compareData}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.inkSub }} />
            <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
            <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Ingresos" fill={C.income} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Gastos" fill={C.expense} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tendencias */}
      <ChartCard t={t} display={display} title="Tendencias" subtitle="Ingresos y gastos mes a mes">
        <ResponsiveContainer>
          <LineChart data={monthlyEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.inkSub }} />
            <YAxis tick={{ fontSize: 11, fill: t.inkSub }} tickFormatter={fmtMoneyShort} width={54} />
            <Tooltip contentStyle={tooltipStyle(t)} formatter={(v) => fmtMoney(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Ingresos" stroke={C.income} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Gastos" stroke={C.expense} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Balance" stroke={C.blue} strokeWidth={2} dot={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Objetivos alcanzados */}
      <Card t={t} style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Award size={17} color={C.income} />
          <div style={{ ...display, fontSize: 15, fontWeight: 600 }}>Objetivos alcanzados</div>
        </div>
        {completedGoals.length === 0 && <div style={{ fontSize: 13, color: t.inkSub }}>Todavía no se ha completado ningún objetivo.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {completedGoals.map((g) => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: t.surfaceAlt, borderRadius: 10 }}>
              <span style={{ fontSize: 13.5 }}>{g.name}</span>
              <span style={{ ...mono, fontSize: 13, fontWeight: 600, color: C.income }}>{fmtMoney(g.targetAmount)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function useMemoLike(cats, list, key) {
  const map = {};
  list.forEach((x) => (map[x[key]] = (map[x[key]] || 0) + Number(x.amount)));
  return Object.entries(map)
    .map(([id, amount]) => ({ cat: cats.find((c) => c.id === id), amount }))
    .filter((r) => r.cat)
    .sort((a, b) => b.amount - a.amount);
}

function RankingTable({ t, mono, display, title, rows, total, color }) {
  return (
    <Card t={t} style={{ padding: 18 }}>
      <div style={{ ...display, fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => (
          <div key={r.cat.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: t.inkSub, width: 16 }}>{i + 1}</span>
                <CatBadge cat={r.cat} size={24} />
                <span style={{ fontSize: 13 }}>{r.cat.name}</span>
              </div>
              <span style={{ ...mono, fontSize: 12.5, fontWeight: 600 }}>{fmtMoney(r.amount)}</span>
            </div>
            <ProgressBar value={pct(r.amount, total)} color={color} track={t.surfaceAlt} height={6} />
          </div>
        ))}
        {rows.length === 0 && <div style={{ fontSize: 13, color: t.inkSub }}>Sin datos disponibles.</div>}
      </div>
    </Card>
  );
}

/* ============================== CATEGORIES TAB ============================== */
function CategoriesTab({ t, mono, display, expenseCats, incomeCats, addExpenseCategory, updateExpenseCategory, deleteExpenseCategory, addIncomeCategory, updateIncomeCategory, deleteIncomeCategory }) {
  const [which, setWhich] = useState("expense");
  const cats = which === "expense" ? expenseCats : incomeCats;
  const addFn = which === "expense" ? addExpenseCategory : addIncomeCategory;
  const updFn = which === "expense" ? updateExpenseCategory : updateIncomeCategory;
  const delFn = which === "expense" ? deleteExpenseCategory : deleteIncomeCategory;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("MoreHorizontal");
  const [color, setColor] = useState(CAT_PALETTE[0]);
  const [editingId, setEditingId] = useState(null);

  const submit = () => {
    if (!name.trim()) return;
    if (editingId) { updFn(editingId, { name, icon, color }); setEditingId(null); }
    else addFn({ name, icon, color });
    setName(""); setIcon("MoreHorizontal"); setColor(CAT_PALETTE[0]);
  };
  const startEdit = (c) => { setName(c.name); setIcon(c.icon); setColor(c.color); setEditingId(c.id); };

  const iconSet = which === "expense" ? EXPENSE_ICONS : INCOME_ICONS;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setWhich("expense")} style={{ ...btnGhost(t), background: which === "expense" ? C.expenseSoft : "transparent", borderColor: which === "expense" ? C.expense : t.border, color: which === "expense" ? C.expense : t.ink, fontWeight: 600 }}>Categorías de gasto</button>
        <button onClick={() => setWhich("income")} style={{ ...btnGhost(t), background: which === "income" ? C.incomeSoft : "transparent", borderColor: which === "income" ? C.income : t.border, color: which === "income" ? C.income : t.ink, fontWeight: 600 }}>Categorías de ingreso</button>
      </div>

      <Card t={t} style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ ...display, fontSize: 14.5, fontWeight: 600, marginBottom: 12 }}>{editingId ? "Editar categoría" : "Nueva categoría"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr auto", gap: 12, alignItems: "end" }}>
          <Field t={t} label="Nombre"><input style={inputStyle(t)} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field t={t} label="Ícono">
            <select style={inputStyle(t)} value={icon} onChange={(e) => setIcon(e.target.value)}>
              {Object.keys(iconSet).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </Field>
          <Field t={t} label="Color">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CAT_PALETTE.map((c) => (
                <button key={c} onClick={() => setColor(c)} style={{
                  width: 22, height: 22, borderRadius: 6, background: c, border: color === c ? `2px solid ${t.ink}` : "2px solid transparent", cursor: "pointer",
                }} />
              ))}
            </div>
          </Field>
          <button style={btnPrimary(which === "expense" ? C.expense : C.income)} onClick={submit}>
            {editingId ? <Pencil size={14} /> : <Plus size={14} />} {editingId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {cats.map((c) => (
          <Card key={c.id} t={t} style={{ padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <CatBadge cat={c} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: t.inkSub }}>{c.icon}</div>
            </div>
            <button style={iconBtn(t)} onClick={() => startEdit(c)}><Pencil size={14} color={t.inkSub} /></button>
            <button style={iconBtn(t)} onClick={() => delFn(c.id)}><Trash2 size={14} color={C.rose} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}
