import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(@Inject(LoadingService) private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Démarrer le loading
    this.loadingService.setLoading(true, request.url);

    return next.handle(request).pipe(
      finalize(() => {
        // Arrêter le loading
        this.loadingService.setLoading(false, request.url);
      })
    );
  }
}