import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'url',
  standalone: true
})
export class UrlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { /*empty*/ }

  // receives uri and verifies security
  transform(value: string): any {
    //const url = 'https://open.spotify.com/embed/';
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }


  //transform(value: unknown, ...args: unknown[]): unknown {
  //  return null;
  //}

}
