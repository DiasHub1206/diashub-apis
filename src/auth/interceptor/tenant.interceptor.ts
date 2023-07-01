import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { set } from 'async-local-storage';
import { RequestContext } from '../../common/request.context';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user: RequestContext = request.user;
    console.log('User is ', user);
    set('request', user);
    return next.handle();
  }
}
