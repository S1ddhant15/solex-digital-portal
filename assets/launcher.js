const openPortalButton = document.getElementById("openPortalButton");
const launcherMessage = document.getElementById("launcherMessage");
const launcherFallback = document.getElementById("launcherFallback");

function createLauncherPortalFrame() {
  let frame = document.getElementById("launcherPortalFrame");
  if (frame) return frame;
  frame = document.createElement("iframe");
  frame.id = "launcherPortalFrame";
  frame.className = "launcher-host-frame";
  frame.title = "Solex Digital Operations Portal";
  frame.allow = "fullscreen";
  frame.src = "index.html?standalone=1&launcherHost=1";
  document.body.appendChild(frame);
  return frame;
}

async function openPortalFullscreen() {
  createLauncherPortalFrame();
  document.body.classList.add("launcher-portal-active");
  launcherFallback.style.display = "none";
  launcherMessage.textContent = "";
  const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (!request || document.fullscreenElement || document.webkitFullscreenElement) return;
  try {
    await request.call(document.documentElement);
  } catch {
    launcherMessage.textContent = "Browser fullscreen was blocked. Select Open Digital Operations Portal again.";
  }
}

async function closeLauncherPortal() {
  sessionStorage.removeItem("solexPortalSession");
  document.getElementById("launcherPortalFrame")?.remove();
  document.body.classList.remove("launcher-portal-active");
  try {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if ((document.fullscreenElement || document.webkitFullscreenElement) && exit) await exit.call(document);
  } catch {}
  try {
    if (window.opener && !window.opener.closed) window.opener.postMessage({ type: "solex-portal-closed" }, location.origin);
  } catch {}
  window.close();
}

openPortalButton.addEventListener("click", openPortalFullscreen);

window.addEventListener("message", event => {
  if (event.origin !== location.origin) return;
  if (event.data?.type === "solex-launcher-close") closeLauncherPortal();
});
