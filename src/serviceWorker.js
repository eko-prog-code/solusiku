const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/
    )
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;

            // Skip localhost specific checks in production
            registerValidSW(swUrl, config);
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            console.log('Service Worker registered successfully with scope:', registration.scope);

            registration.onupdatefound = () => {
                console.log('Update found for Service Worker.');

                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }

                installingWorker.onstatechange = () => {
                    console.log('Service Worker state changed to:', installingWorker.state);
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                'New content is available and will be used when all tabs for this page are closed.'
                            );

                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            console.log('Content is cached for offline use.');

                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    // This function is not needed in production since localhost checks are not required
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister().then(() => {
                    console.log('Service Worker unregistered successfully.');
                });
            })
            .catch((error) => {
                console.error('Error during Service Worker unregistration:', error.message);
            });
    }
}
