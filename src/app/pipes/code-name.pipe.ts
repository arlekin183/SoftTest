import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codeName'
})
export class CodeNamePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return !!value.name ? value.name : value;
  }
}
