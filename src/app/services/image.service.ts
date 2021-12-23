import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private domSanitizer: DomSanitizer) { }

  sanitizeResource(base64img: any) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(base64img);
  }

  arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
