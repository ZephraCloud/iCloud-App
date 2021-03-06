import { Tray, Menu, app, shell } from "electron";
import { Browser } from "./browser";
import { get, set } from "./store";
import { erase } from "./discord";
import { init as initAutoLaunch } from "./autoLaunch";
import { checkForUpdates } from "./updater";

import * as path from "path";

export class TrayManager {
    private tray: Tray;

    constructor() {
        this.tray = new Tray(
            path.join(app.getAppPath(), "assets/drive@32.png")
        );
        this.tray.setToolTip("iCloud (E)");
        this.tray.setContextMenu(this.createContextMenu());

        this.tray.on("click", () => {
            new Browser();
        });

        app.on("before-quit", this.tray.destroy);
    }

    private createContextMenu(): Electron.Menu {
        return Menu.buildFromTemplate([
            {
                label: `${
                    app.isPackaged ? "iCloud" : "iCloud - DEV"
                } V.${app.getVersion()}`,
                icon: path.join(app.getAppPath(), "assets/drive@32.png"),
                enabled: false
            },
            {
                label: "GitHub",
                icon: path.join(app.getAppPath(), "assets/github@16.png"),
                click: () => {
                    shell.openExternal(
                        "https://github.com/ZephraCloud/iCloud-App"
                    );
                }
            },
            { type: "separator" },
            {
                label: "Check for Updates",
                click() {
                    checkForUpdates();
                }
            },
            { type: "separator" },
            {
                label: "Settings",
                enabled: false
            },
            {
                label: "Auto Launch",
                type: "checkbox",
                checked: get("autoLaunch"),
                click() {
                    set("autoLaunch", !get("autoLaunch"));
                    initAutoLaunch();
                }
            },
            {
                label: "Save Apple-ID Password (Encrypted)",
                type: "checkbox",
                checked: get("savePassword"),
                click() {
                    set("savePassword", !get("savePassword"));
                }
            },
            {
                label: "Discord-RPC",
                type: "checkbox",
                checked: get("discordRPC"),
                click() {
                    const oldValue = get("discordRPC");

                    set("discordRPC", !oldValue);

                    if (oldValue) erase();
                }
            },
            { type: "separator" },
            {
                label: "Restart",
                click() {
                    app.relaunch();
                    app.exit();
                }
            },
            {
                label: "Quit",
                click() {
                    app.quit();
                }
            }
        ]);
    }

    update() {
        this.tray.setContextMenu(this.createContextMenu());
    }
}
