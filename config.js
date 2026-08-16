const PORTAL_CONFIG = {
  mode: "demo",
  sessionHours: 8,
  apps: {
    mes: {
      name: "MES Portal",
      short: "Manufacturing Intelligence",
      description: "Production, quality, maintenance and management dashboards in one operational view.",
      icon: "▦",
      color: "blue",
      url: "https://s1ddhant15.github.io/solex-mes-portal/dashboard.html"
    },
    sama: {
      name: "SAMA",
      short: "AI Maintenance Assistant",
      description: "Machine troubleshooting, alarms, preventive maintenance, spares and equipment knowledge.",
      icon: "✦",
      color: "orange",
      url: "https://s1ddhant15.github.io/solex-ai-maintenance/"
    },
    learning: {
      name: "e‑Vidhyalaya",
      short: "Learning & Development",
      description: "Courses, assessments, progress tracking, skill development and employee certificates.",
      icon: "▶",
      color: "navy",
      url: "https://s1ddhant15.github.io/solex-e-vidhalaya/"
    }
  },
  demoUsers: [
    { id: "SX1001", password: "Admin@123", name: "Siddhant Tripathi", department: "Operations Excellence", role: "Administrator", apps: ["mes", "sama", "learning"], admin: true },
    { id: "SX2001", password: "Maint@123", name: "Maintenance User", department: "Maintenance", role: "Engineer", apps: ["mes", "sama", "learning"], admin: false },
    { id: "SX3001", password: "Prod@123", name: "Production User", department: "Production", role: "Executive", apps: ["mes", "learning"], admin: false },
    { id: "SX4001", password: "Quality@123", name: "Quality User", department: "Quality", role: "Engineer", apps: ["mes", "learning"], admin: false },
    { id: "SX5001", password: "Learn@123", name: "L&D User", department: "Human Resources", role: "Learning Administrator", apps: ["learning"], admin: false }
  ]
};
