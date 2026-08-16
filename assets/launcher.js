const openPortalButton = document.getElementById("openPortalButton");
const launcherMessage = document.getElementById("launcherMessage");
const launcherFallback = document.getElementById("launcherFallback");

function openPortalWindow() {
  const width = screen.availWidth || window.innerWidth;
  const height = screen.availHeight || window.innerHeight;
  const features = [
    "popup=yes",
    "toolbar=no",
    "location=no",
    "menubar=no",
    "status=no",
    "resizable=yes",
    "scrollbars=yes",
    `width=${width}`,
    `height=${height}`,
    "left=0",
    "top=0"
  ].join(",");
  const portalWindow = window.open("index.html?standalone=1", "solexDigitalOperationsPortal", features);
  if (!portalWindow) {
    launcherMessage.textContent = "Popup blocked. Allow popups for this site and try again.";
    launcherFallback.style.display = "inline";
    return;
  }
  try {
    portalWindow.moveTo(0, 0);
    portalWindow.resizeTo(width, height);
    portalWindow.focus();
  } catch {}
  launcherFallback.style.display = "none";
  launcherMessage.textContent = "";
}

openPortalButton.addEventListener("click", openPortalWindow);

window.addEventListener("message", event => {
  if (event.origin !== location.origin || event.data?.type !== "solex-portal-closed") return;
  launcherMessage.textContent = "";
});
