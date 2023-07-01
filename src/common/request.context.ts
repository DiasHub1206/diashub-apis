import { get } from 'async-local-storage';
import { User } from 'src/user/entity/user.entity';
export class RequestContext {
  constructor(public userId: string) {}

  public static from(user: User): RequestContext {
    const userContext = new RequestContext(user.id);
    return userContext;
  }
}

export const getRequestContext = async () => {
  const request = await get('request');
  const userContext = new RequestContext(request?.userId);
  return userContext;
};
