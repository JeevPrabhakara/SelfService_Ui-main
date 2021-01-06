import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ShortNumberPipe } from './filters/filter.pipe';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule
    ],
    declarations: [ShortNumberPipe],
    exports: [
    ]
})
export class SharedPipesModule { }
