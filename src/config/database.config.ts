import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 3306),
      username: this.configService.get<string>('DB_USERNAME', 'root'),
      password: this.configService.get<string>('DB_PASSWORD', ''),
      database: this.configService.get<string>('DB_DATABASE', 'mysaloon'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: isProduction ? [__dirname + '/../../migrations/*{.ts,.js}'] : [],
      synchronize: !isProduction, // Désactivé en production, utilisez les migrations
      migrationsRun: false, // Ne pas exécuter automatiquement, utilisez les scripts npm
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

