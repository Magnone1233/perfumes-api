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
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { FragrancesService } from './fragrances.service';
import { fragranceImageUploadOptions } from './multer.config';

@Controller('fragrances')
export class FragrancesController {
  constructor(private readonly fragrancesService: FragrancesService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', fragranceImageUploadOptions))
  create(
    @Body() createFragranceDto: CreateFragranceDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.fragrancesService.create(createFragranceDto, image);
  }

  @Get()
  findAll() {
    return this.fragrancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fragrancesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', fragranceImageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFragranceDto: UpdateFragranceDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.fragrancesService.update(id, updateFragranceDto, image);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fragrancesService.remove(id);
  }
}
