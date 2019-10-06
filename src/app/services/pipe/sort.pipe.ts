import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(items: Array<any>, field: string): Array<any> {
    if (!isArray(items)) {
      return;
    }
    items.sort(
      (a: any, b: any) => {
        if (a[field] < b[field]) {
          return -1;
        } else {
          return 0;
        }
      }
    );
    return items;
  }
}
