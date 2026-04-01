import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CatalogServicesService } from './catalog-services.service';
import { CreateCatalogServiceDto } from './dto/create-catalog-service.dto';
import { UpdateCatalogServiceDto } from './dto/update-catalog-service.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/enums';

const catalogImageStorage = diskStorage({
  destination: './uploads/catalog',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname);
    callback(null, `catalog-${uniqueSuffix}${fileExtName}`);
  },
});

@Controller('catalog/services')
export class CatalogServicesController {
  constructor(
    private readonly catalogServicesService: CatalogServicesService,
  ) {}

  /** Public — prestations affichées sur le site (actives uniquement). */
  @Get()
  findPublic() {
    return this.catalogServicesService.findPublic();
  }

  /** Authentifié — toutes les lignes (y compris inactives) pour la gestion. */
  @Get('manage')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAllManage() {
    return this.catalogServicesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: catalogImageStorage,
    }),
  )
  create(
    @UploadedFile() file: any,
    @Body() dto: CreateCatalogServiceDto,
  ) {
    if (file) {
      dto.image = `/uploads/catalog/${file.filename}`;
    }
    return this.catalogServicesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: catalogImageStorage,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
    @Body() dto: UpdateCatalogServiceDto,
  ) {
    if (file) {
      dto.image = `/uploads/catalog/${file.filename}`;
    }
    return this.catalogServicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogServicesService.remove(id);
  }
}
