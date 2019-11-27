export class Session {
  bookmarks: Array<String>;

  constructor(bookmarks?) {
    this.bookmarks = bookmarks || [];
  }
}