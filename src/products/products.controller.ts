import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/enums';

const productImageStorage = diskStorage({
  destination: './uploads/products',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname);
    callback(null, `product-${uniqueSuffix}${fileExtName}`);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: productImageStorage,
    }),
  )
  create(
    @UploadedFile() file: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (file) {
      createProductDto.image = `/uploads/products/${file.filename}`;
    }
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get('low-stock')
  getLowStock() {
    return this.productsService.getLowStockProducts();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: productImageStorage,
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (file) {
      updateProductDto.image = `/uploads/products/${file.filename}`;
    }
    return this.productsService.update(+id, updateProductDto);
  }

  @Put(':id/stock')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(+id, quantity);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
