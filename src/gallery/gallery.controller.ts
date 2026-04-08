import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/enums';
import { GalleryService } from './gallery.service';
import { CreateGalleryMediaDto } from './dto/create-gallery-media.dto';
import { UpdateGalleryMediaDto } from './dto/update-gallery-media.dto';

const galleryStorage = diskStorage({
  destination: './uploads/gallery',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `gallery-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  /** Public — items actifs pour le landing. */
  @Public()
  @Get()
  findPublic() {
    return this.galleryService.findPublic();
  }

  /** Manage — liste complète. */
  @Get('manage')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAllManage() {
    return this.galleryService.findAllManage();
  }

  /** Create — multipart: `file` et/ou `poster` (pour vidéo). */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'poster', maxCount: 1 },
      ],
      { storage: galleryStorage },
    ),
  )
  create(
    @UploadedFiles()
    files: { file?: any[]; poster?: any[] },
    @Body() dto: CreateGalleryMediaDto,
  ) {
    const media = files?.file?.[0];
    const poster = files?.poster?.[0];
    if (media) dto.src = `/uploads/gallery/${media.filename}`;
    if (poster) dto.poster = `/uploads/gallery/${poster.filename}`;
    return this.galleryService.create(dto);
  }

  /** Update — multipart optionnel. */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'poster', maxCount: 1 },
      ],
      { storage: galleryStorage },
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: { file?: any[]; poster?: any[] },
    @Body() dto: UpdateGalleryMediaDto,
  ) {
    const media = files?.file?.[0];
    const poster = files?.poster?.[0];
    if (media) dto.src = `/uploads/gallery/${media.filename}`;
    if (poster) dto.poster = `/uploads/gallery/${poster.filename}`;
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.remove(id);
  }
}

