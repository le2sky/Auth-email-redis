import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

export interface UserInfo {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  public async setTempUser(
    token: string,
    userinfo: UserInfo,
  ): Promise<boolean> {
    try {
      await this.cache.set(token, userinfo, {
        ttl: 600,
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  public async getTempUser(token: string): Promise<UserInfo> {
    return await this.cache.get(token);
  }

  public async deleteTempUser(token: string): Promise<void> {
    await this.cache.del(token);
  }
}
