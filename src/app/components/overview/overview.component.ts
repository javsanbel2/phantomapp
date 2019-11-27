import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Session } from 'src/app/shared/models/Session';
import { Bookmark } from 'src/app/shared/models/Bookmark';
import { MatDialog } from '@angular/material';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { EditOverviewComponent } from '../edit-overview/edit-overview.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {

  // Pagination
  ITEMS_PER_PAGE: number = 20;
  actualPage: number = 0;
  totalPages: number = 0;
  previousActive: Boolean;
  nextActive: Boolean;

  // Variables
  bookmarks: Array<Bookmark> = [];
  bookmarksRendered: Array<Bookmark> = [];
  bookmarkForm: FormGroup;

  constructor(private storageService: StorageService,
    private http: HttpClient,
    protected dialog: MatDialog) {
    // Load bookmarks from Local storage
    this.bookmarks = storageService.loadSessionData().
    bookmarks.map(i => new Bookmark(i));
  }

  ngOnInit() {
    const URL_PATTERN = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
    this.bookmarkForm = new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern(URL_PATTERN)])
    });
    this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
    this.refreshPagination();
  }

  // CRUD OPERATIONS: Add, Edit, Delete

  // Add Bookmark checking if exists
  async addBookmark(bookmarkForm) {
    const bookmarkUrl = this.bookmarkForm.value.url;
    const urlExists = await this.checkIfUrlExists(bookmarkUrl);

    if (this.bookmarkForm.valid && !urlExists) {
      this.showMessageModal('Bookmark submitted does not exist.')
    } else if (this.bookmarkForm.valid && urlExists) {
      this.showMessageModal('You succesfully added the bookmark.')
      // Get last ID of array and add Bookmark to Array
      const lastElement = this.bookmarks[0];
      const idBookmark = lastElement ? Number(lastElement.id) : 0;
      const bookmark = new Bookmark({ id: idBookmark + 1, url: bookmarkUrl })
      this.bookmarks = [bookmark, ...this.bookmarks];
      // Refresh pagination of table
      this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
      this.refreshPagination();
      // Update local storage
      this.updateStorage(this.bookmarks);
    }
  }

  editBookmark(bookmark) {
    if (bookmark) {
      this.dialog.open(EditOverviewComponent, {
        width: '350px',
        data: {
          id: bookmark.id,
          url: bookmark.url,
        }
      }).afterClosed().subscribe(editedBookmark => {
        if (editedBookmark) {
          const newBookmark = new Bookmark(editedBookmark)
          this.bookmarks = this.bookmarks.map(i => i.id !== newBookmark.id ? i : newBookmark)
          this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
          this.refreshPagination();
          // Update local storage
          this.updateStorage(this.bookmarks);
        }
      });
    }
  }

  deleteBookmark(bookmark) {
    if (bookmark) {
      this.dialog.open(DeleteModalComponent, {
        width: '350px',
        data: {
          entity: bookmark,
          entityType: 'bookmark'
        }
      }).afterClosed().subscribe(isDeleted => {
          if (isDeleted) {
            this.bookmarks = this.bookmarks.filter(i => i.id !== bookmark.id);
            this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
            this.refreshPagination();
            // Update local storage
            this.updateStorage(this.bookmarks);
        }
      });
    }
  }

  // UTILS: Modals, Storage, Forms, Pagination

  isSecureProtocol(url: string) {
    return url.startsWith('https');
  }

  showMessageModal (message) {
    this.dialog.open(MessageModalComponent, {
      width: '350px',
      data: {
        message: message,
      }
    });
  }

  updateStorage(bookmarks) {
    this.storageService.setCurrentSession(new Session(this.bookmarks));
  }

  checkIfUrlExists(url) {
    const headers = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin' : '*'
      })
    }
    return this.http.request(new HttpRequest('GET', url, headers)).toPromise();
  }

  hasError(controlName: string, errorName: string) {
    return this.bookmarkForm.controls[controlName].hasError(errorName);
  }

  paginate(arr, page) {
    const basePage = this.ITEMS_PER_PAGE * page;
    return arr.slice(basePage, basePage + this.ITEMS_PER_PAGE);  
  }

  previousPage() {
    this.actualPage -= 1;
    this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
    this.refreshPagination();
  }

  nextPage() {
    this.actualPage = this.actualPage + 1;
    this.bookmarksRendered = this.paginate(this.bookmarks, this.actualPage);
    this.refreshPagination();
  }

  refreshPagination() {
    const roundUpPages = Number(Math.ceil(this.bookmarks.length / this.ITEMS_PER_PAGE).toFixed(0)); 
    this.totalPages = roundUpPages === 0 ? 1 : roundUpPages;
    this.nextActive = this.actualPage+1 !== this.totalPages;
    this.previousActive = this.actualPage > 0;
  }

}
