import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class ScriptService {

    constructor(
        protected zone: NgZone,
    ) {
    }

    registerScript(url: string, globalVar: string, onReady: (globalVar: any) => void): void {
        if ((window as any)[globalVar]) {
            // global variable is present = script was already loaded
            this.zone.run(() => {
                onReady((window as any)[globalVar]);
            });
            return;
        }

        // prepare script elem
        const scriptElem = document.createElement('script');
        scriptElem.id = this.getElemId(globalVar);
        scriptElem.innerHTML = '';
        scriptElem.onload = () => {
            this.zone.run(() => {
                onReady((window as any)[globalVar]);
            });
        };
        scriptElem.src = url;
        scriptElem.async = true;
        scriptElem.defer = true;

        // add script to header
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    }

    cleanup(globalVar: string): void {
        (window as any)[globalVar] = undefined;

        // remove script from DOM
        const scriptElem = document.getElementById(this.getElemId(globalVar));

        if (scriptElem) {
            scriptElem.remove();
        }
    }

    private getElemId(globalVar: string): string {
        return `ngx-paypal-script-elem-${globalVar}`;
    }
}
