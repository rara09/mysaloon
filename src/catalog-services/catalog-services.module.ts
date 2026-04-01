import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogServiceEntity } from '../entities/catalog-service.entity';
import { CatalogServicesService } from './catalog-services.service';
import { CatalogServicesController } from './catalog-services.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogServiceEntity])],
  controllers: [CatalogServicesController],
  providers: [CatalogServicesService],
  exports: [CatalogServicesService],
})
export class CatalogServicesModule {}
