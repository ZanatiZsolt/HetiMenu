// serviceWorkerRegistration.js

// Regisztrálja a service workert
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker regisztrálva: ", registration);
        })
        .catch((error) => {
          console.error("Service Worker regisztrációs hiba: ", error);
        });
    });
  }
}

// Ha szeretnéd elutasítani a service worker-t
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Service Worker törlés hiba: ", error);
      });
  }
}