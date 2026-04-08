import { PartialType } from '@nestjs/mapped-types';
import { CreateGalleryMediaDto } from './create-gallery-media.dto';

export class UpdateGalleryMediaDto extends PartialType(CreateGalleryMediaDto) {}

