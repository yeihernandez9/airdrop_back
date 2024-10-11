import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigdbModule } from './configdb/configdb.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { ConfigService } from './config/config.service';
import { Configuration } from './config/config.key';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [ConfigModule, ConfigdbModule, UserModule, RoleModule, AuthModule, SharedModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    console.log('lisent port', this._configService.get(Configuration.PORT));
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
