/************************************************
*                                               *
*                  BOOTSTRAP                    *
*                                               *
************************************************/

import "styles/init.scss";
import { configure } from "mobx";

/**
 * Service Worker Registration
 */
if (process.env.NODE_ENV === "production") {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
            .then((reg) => {
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === "installed") {
                            // update about application updates!
                        }
                    };
                };
            });
    }
}

/**
 * App State
 */
configure({
    enforceActions: "observed"
});
