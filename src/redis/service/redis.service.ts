import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IUserInformation } from 'src/interface/user-info.interface';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  public async setTempUser(
    token: string,
    userinfo: IUserInformation,
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
  public async getTempUser(token: string): Promise<IUserInformation> {
    return await this.cache.get(token);
  }

  public async deleteTempUser(token: string): Promise<void> {
    await this.cache.del(token);
  }
}
