// export class BookmarkCollection {
//   get: Array<Bookmark>;

//   constructor(data: Array<any>) {
//     this.get = data.map((v,i) => new Bookmark(i,v));
//   }
// }

export class Bookmark {
  id: String;
  url: String;

  constructor(data: any) {
    this.id = data.id || '';
    this.url = data.url || '';
  }
}