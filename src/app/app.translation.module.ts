import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/US/', '.json');
}

const translationOptions = {
    loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
    }
};

@NgModule({
    imports: [TranslateModule.forRoot(translationOptions)],
    exports: [TranslateModule],
    providers: [TranslateService]
})
export class AppTranslationModule {
    constructor(private translate: TranslateService) {
        translate.addLangs(['en']);
        translate.setDefaultLang('en');
        translate.use('en');
    }
}
