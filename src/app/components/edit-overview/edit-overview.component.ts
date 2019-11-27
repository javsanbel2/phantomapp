import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { OverviewComponent } from '../overview/overview.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-overview',
  templateUrl: './edit-overview.component.html',
  styleUrls: ['./edit-overview.component.css']
})
export class EditOverviewComponent implements OnInit {

  bookmarkForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OverviewComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const URL_PATTERN = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
    this.bookmarkForm = new FormGroup({
      url: new FormControl(this.data.url, [Validators.required, Validators.pattern(URL_PATTERN)])
    });
  }

  onClose(editedBookmark = {}) {
    this.dialogRef.close(editedBookmark);
  }

  async saveBookmark(bookmarkForm) {
    const bookmarkUrl = this.bookmarkForm.value.url;
    const urlExists = await this.checkIfUrlExists(bookmarkUrl);

    if (this.bookmarkForm.valid && !urlExists) {
      this.onClose({id: this.data.id, url:bookmarkUrl});
    }
  }

  checkIfUrlExists(url) {
    return this.http.get(url).toPromise().
      then((data: any) => data.status === 200).
      catch(i => false)
  }

  hasError(controlName: string, errorName: string) {
    return this.bookmarkForm.controls[controlName].hasError(errorName);
  }

}
