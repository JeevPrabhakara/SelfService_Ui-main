import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogData } from './DialogData';

@Component({
selector: 'secrete-key-popup',
templateUrl: './secrete-key-popup.component.html'
})
export class SecreteKeyPupupComponent implements OnInit {

constructor(
public dialogRef: MatDialogRef<SecreteKeyPupupComponent>,
@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

close(): void {
this.dialogRef.close();
}

ngOnInit() {
}

}
