import { Component, OnInit, Inject } from '@angular/core';
import { OverviewComponent } from 'src/app/components/overview/overview.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onClose(isDeleted = false) {
    this.dialogRef.close(isDeleted);
  }

  deleteEntity() {
    if (this.data && this.data.entityType === 'bookmark') {
      this.onClose(true);
    }
  }

}
