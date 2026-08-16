const session = getSession();
if (!session) location.replace("index.html");

const user = session.user;
const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".sidebar nav button");

function initials(name) { return name.split(/\s+/).map(word => word[0]).slice(0, 2).join("").toUpperCase(); }
function showView(id) {
  views.forEach(view => view.classList.remove("active-view"));
  document.getElementById(id).classList.add("active-view");
  if (window.matchMedia("(max-width: 760px)").matches) setSidebar(false);
}
function setSidebar(open) {
  document.body.classList.toggle("sidebar-collapsed", !open);
  ["menuButton", "appMenuButton"].forEach(id => {
    const menuButton = document.getElementById(id);
    if (!menuButton) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close portal navigation" : "Open portal navigation");
  });
}
function toast(message) {
  const element = document.getElementById("toast");
  element.textContent = message; element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2500);
}
function openApp(key) {
  if (!user.apps.includes(key)) return toast("You do not have access to this application.");
  const app = PORTAL_CONFIG.apps[key];
  let appUrl = app.url;
  if (key === "sama" && user.samaLanding) {
    appUrl = new URL(user.samaLanding, app.url).href;
  }
  document.getElementById("frameTitle").textContent = app.name;
  document.getElementById("frameDescription").textContent = app.short;
  document.getElementById("appFrame").src = appUrl;
  document.getElementById("openNewTab").href = appUrl;
  document.getElementById("pageTitle").textContent = app.name;
  setSidebar(false);
  document.body.classList.add("app-open");
  showView("appView");
}

function closeApp() {
  document.getElementById("appFrame").src = "about:blank";
  document.body.classList.remove("app-open");
  showView("homeView");
  document.getElementById("pageTitle").textContent = "Digital Operations Overview";
}

async function closePortalWindow() {
  sessionStorage.removeItem("solexPortalSession");
  if (window.parent !== window) {
    window.parent.postMessage({ type: "solex-portal-close" }, location.origin);
    return;
  }
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "solex-portal-closed" }, location.origin);
    }
  } catch {}
  try {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if ((document.fullscreenElement || document.webkitFullscreenElement) && exit) await exit.call(document);
  } catch {}
  window.close();
  setTimeout(() => {
    location.replace("index.html?closed=1");
  }, 180);
}

document.getElementById("userName").textContent = user.name;
document.getElementById("userDepartment").textContent = user.department;
document.getElementById("userInitials").textContent = initials(user.name);
document.getElementById("welcomeName").textContent = user.name.split(" ")[0];
document.getElementById("availableApps").textContent = user.apps.length;
document.getElementById("departmentKpi").textContent = user.department;
document.getElementById("lastLogin").textContent = new Date(session.loginAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
document.getElementById("adminNav").hidden = !user.admin;

document.getElementById("appGrid").innerHTML = Object.entries(PORTAL_CONFIG.apps).map(([key, app]) => {
  const allowed = user.apps.includes(key);
  return `<article class="app-card ${app.color} ${allowed ? "" : "locked"}">
    <div class="app-card-head"><div class="app-icon">${app.icon}</div><b class="access-pill">${allowed ? "AVAILABLE" : "RESTRICTED"}</b></div><span>${app.short}</span><h3>${app.name}</h3><p>${app.description}</p>
    <div class="card-footer"><b>${allowed ? "Access granted" : "Restricted"}</b><button data-app="${key}" ${allowed ? "" : "disabled"}>${allowed ? "Open application →" : "No access"}</button></div>
  </article>`;
}).join("");

document.querySelectorAll("[data-app]").forEach(button => button.addEventListener("click", () => openApp(button.dataset.app)));
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.view;
  if (target === "home") { closeApp(); return; }
  if (document.body.classList.contains("app-open")) {
    document.getElementById("appFrame").src = "about:blank";
    document.body.classList.remove("app-open");
    setSidebar(false);
  }
  if (target === "profile") { showView("profileView"); document.getElementById("pageTitle").textContent = "My Profile"; }
  if (target === "admin" && user.admin) { showView("adminView"); document.getElementById("pageTitle").textContent = "Access Administration"; }
}));
document.getElementById("backButton").addEventListener("click", closeApp);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("app-open")) closeApp();
});
document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("closePortalButton").addEventListener("click", closePortalWindow);
document.getElementById("appClosePortalButton").addEventListener("click", closePortalWindow);
document.getElementById("menuButton").addEventListener("click", () => setSidebar(document.body.classList.contains("sidebar-collapsed")));
document.getElementById("appMenuButton").addEventListener("click", event => {
  event.stopPropagation();
  setSidebar(document.body.classList.contains("sidebar-collapsed"));
});
document.addEventListener("click", event => {
  if (!window.matchMedia("(max-width: 760px)").matches || document.body.classList.contains("sidebar-collapsed")) return;
  if (!document.getElementById("sidebar").contains(event.target) && !document.getElementById("menuButton").contains(event.target)) setSidebar(false);
});

document.getElementById("profileDetails").innerHTML = `<div><span>Employee ID</span><b>${user.id}</b></div><div><span>Name</span><b>${user.name}</b></div><div><span>Department</span><b>${user.department}</b></div><div><span>Role</span><b>${user.role}</b></div><div><span>Application access</span><b>${user.apps.map(key => PORTAL_CONFIG.apps[key].name).join(", ")}</b></div><div><span>SAMA permission profile</span><b>${userPermissions.length ? userPermissions.length + " permissions" : "Not assigned"}</b></div>`;
document.getElementById("userTable").innerHTML = `<div class="table-wrap"><table><thead><tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Role</th><th>Applications</th><th>SAMA rights</th></tr></thead><tbody>${PORTAL_CONFIG.demoUsers.map(item => `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.department}</td><td>${item.role}</td><td>${item.apps.join(", ")}</td><td>${(item.permissions || []).length}</td></tr>`).join("")}</tbody></table></div>`;

function updateClock() { document.getElementById("liveClock").textContent = new Date().toLocaleString("en-IN", {weekday:"short", day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit"}); }
updateClock(); setInterval(updateClock, 1000);

const requestedApp = new URLSearchParams(location.search).get("app");
if (requestedApp && PORTAL_CONFIG.apps[requestedApp]) openApp(requestedApp);
