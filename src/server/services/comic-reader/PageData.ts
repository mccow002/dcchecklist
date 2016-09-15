export class PageData {
    Page: string;
    ImageBuffer: Buffer;

    constructor(page: string, imageStr: Buffer) {
        this.Page = page;
        this.ImageBuffer = imageStr;
    }
}