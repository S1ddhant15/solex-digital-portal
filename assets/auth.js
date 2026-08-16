const SESSION_KEY = "solexPortalSession";

function getSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!session || Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch { return null; }
}

function createSession(user) {
  const safeUser = { id: user.id, name: user.name, department: user.department, role: user.role, apps: user.apps, admin: user.admin };
  const session = { user: safeUser, loginAt: new Date().toISOString(), expiresAt: Date.now() + PORTAL_CONFIG.sessionHours * 3600000 };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.replace("index.html");
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  if (getSession()) location.replace("portal.html");
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("employeeId").value.trim().toUpperCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    const user = PORTAL_CONFIG.demoUsers.find(item => item.id === id && item.password === password);
    if (!user) {
      message.textContent = "Incorrect Employee ID or password.";
      loginForm.classList.add("shake");
      setTimeout(() => loginForm.classList.remove("shake"), 400);
      return;
    }
    message.textContent = "Access verified. Opening your workspace…";
    message.className = "form-message success";
    createSession(user);
    setTimeout(() => location.replace("portal.html"), 450);
  });
  document.getElementById("togglePassword").addEventListener("click", event => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
    event.currentTarget.textContent = input.type === "password" ? "Show" : "Hide";
  });
}
