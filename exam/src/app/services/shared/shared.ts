import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function errorHandler(error: HttpErrorResponse) {
    return throwError(error.error.message || 'Unknown error!');
  }