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
  const safeUser = {
    id: user.id,
    name: user.name,
    department: user.department,
    role: user.role,
    apps: user.apps,
    admin: user.admin,
    permissions: user.permissions || [],
    samaLanding: user.samaLanding || ""
  };
  const session = { user: safeUser, loginAt: new Date().toISOString(), expiresAt: Date.now() + PORTAL_CONFIG.sessionHours * 3600000 };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  if (window.parent !== window) {
    window.parent.postMessage({ type: "solex-portal-logout" }, location.origin);
    return;
  }
  location.replace("index.html");
}

function portalDestination() {
  const incoming = new URLSearchParams(location.search);
  const destination = new URLSearchParams();
  const app = incoming.get("app");
  if (app) destination.set("app", app);
  if (incoming.get("standalone") === "1") destination.set("standalone", "1");
  const query = destination.toString();
  return query ? `portal.html?${query}` : "portal.html";
}

function requestPortalFullscreen() {
  if (document.fullscreenElement || document.webkitFullscreenElement) return Promise.resolve(true);
  const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (!request) return Promise.resolve(false);
  try {
    const result = request.call(document.documentElement);
    return Promise.resolve(result).then(() => true).catch(() => false);
  } catch { return Promise.resolve(false); }
}

function isStandaloneLaunch() {
  return new URLSearchParams(location.search).get("standalone") === "1";
}

function isLauncherHosted() {
  return new URLSearchParams(location.search).get("launcherHost") === "1";
}

function launchStandalonePortal() {
  if (document.getElementById("standalonePortalFrame")) return;
  const destination = new URL(portalDestination(), location.href);
  destination.searchParams.set("embedded", "1");
  const frame = document.createElement("iframe");
  frame.id = "standalonePortalFrame";
  frame.className = "standalone-portal-frame";
  frame.title = "Solex Digital Operations Portal";
  frame.allow = "fullscreen";
  frame.src = destination.href;
  document.body.appendChild(frame);
  document.body.classList.add("portal-embedded");
}

async function exitPortalFullscreen() {
  try {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if ((document.fullscreenElement || document.webkitFullscreenElement) && exit) await exit.call(document);
  } catch {}
}

async function closeStandalonePortal() {
  sessionStorage.removeItem(SESSION_KEY);
  if (window.parent !== window) {
    window.parent.postMessage({ type: "solex-launcher-close" }, location.origin);
    return;
  }
  try {
    if (window.opener && !window.opener.closed) window.opener.postMessage({ type: "solex-portal-closed" }, location.origin);
  } catch {}
  await exitPortalFullscreen();
  window.close();
  setTimeout(() => location.replace("index.html?closed=1"), 180);
}

async function resetStandaloneLogin() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById("standalonePortalFrame")?.remove();
  document.body.classList.remove("portal-embedded", "auth-success");
  await exitPortalFullscreen();
  const message = document.getElementById("loginMessage");
  if (message) {
    message.textContent = "You have been logged out.";
    message.className = "form-message";
  }
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  if (getSession()) {
    if (isStandaloneLaunch()) launchStandalonePortal();
    else location.replace(portalDestination());
  }
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
    document.body.classList.add("auth-success");
    createSession(user);
    if (isStandaloneLaunch()) {
      const fullscreenReady = isLauncherHosted() ? Promise.resolve(true) : requestPortalFullscreen();
      fullscreenReady.finally(() => setTimeout(launchStandalonePortal, 220));
    } else {
      setTimeout(() => location.replace(portalDestination()), 450);
    }
  });
  document.getElementById("togglePassword").addEventListener("click", event => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
    event.currentTarget.textContent = input.type === "password" ? "Show" : "Hide";
  });
}

window.addEventListener("message", event => {
  if (event.origin !== location.origin || !loginForm) return;
  if (event.data?.type === "solex-portal-close") closeStandalonePortal();
  if (event.data?.type === "solex-portal-logout") resetStandaloneLogin();
});
