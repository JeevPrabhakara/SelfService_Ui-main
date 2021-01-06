import { MatButtonModule, MatCheckboxModule, MatGridListModule, MatCardModule, MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const Material = [MatButtonModule, MatCheckboxModule, MatGridListModule,
   MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule,
   MatMenuModule, MatSelectModule, MatAutocompleteModule, MatDialogModule,
  MatButtonToggleModule, MatTabsModule, MatChipsModule, MatProgressBarModule];
@NgModule({
  imports: [Material],
  exports: [Material]
})

export class MaterialModule {
}
