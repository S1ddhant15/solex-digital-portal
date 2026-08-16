const openPortalButton = document.getElementById("openPortalButton");
const launcherMessage = document.getElementById("launcherMessage");
const launcherFallback = document.getElementById("launcherFallback");

function openPortalWindow() {
  const width = screen.availWidth || window.innerWidth;
  const height = screen.availHeight || window.innerHeight;
  const features = [
    "popup=yes",
    "resizable=yes",
    "scrollbars=yes",
    `width=${width}`,
    `height=${height}`,
    "left=0",
    "top=0"
  ].join(",");
  const portalWindow = window.open("index.html?standalone=1", "solexDigitalOperationsPortal", features);
  if (!portalWindow) {
    launcherMessage.textContent = "The popup was blocked. Allow popups for this site or use the link below.";
    launcherFallback.style.display = "inline";
    return;
  }
  try {
    portalWindow.moveTo(0, 0);
    portalWindow.resizeTo(width, height);
    portalWindow.focus();
  } catch {}
  launcherFallback.style.display = "none";
  launcherMessage.textContent = "Portal opened. You can keep this launcher tab open or close it.";
}

openPortalButton.addEventListener("click", openPortalWindow);

window.addEventListener("message", event => {
  if (event.origin !== location.origin || event.data?.type !== "solex-portal-closed") return;
  launcherMessage.textContent = "Portal closed successfully. Select Open Digital Operations Portal to start again.";
});
