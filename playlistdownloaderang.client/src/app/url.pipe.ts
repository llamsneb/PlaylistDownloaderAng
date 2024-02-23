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
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
