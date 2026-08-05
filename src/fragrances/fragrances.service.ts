import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { Fragrance } from './entities/fragrance.entity';

@Injectable()
export class FragrancesService {
  constructor(
    @InjectRepository(Fragrance)
    private readonly fragrancesRepository: Repository<Fragrance>,
  ) {}

  async create(
    createFragranceDto: CreateFragranceDto,
    image?: Express.Multer.File,
  ) {
    this.validatePromotionalPrice(
      createFragranceDto.price,
      createFragranceDto.promotionalPrice,
    );

    const fragrance = this.fragrancesRepository.create({
      ...createFragranceDto,
      description: createFragranceDto.description ?? null,
      promotionalPrice: createFragranceDto.promotionalPrice ?? null,
      image: image ? this.buildImagePath(image.filename) : null,
    });

    return this.fragrancesRepository.save(fragrance);
  }

  findAll() {
    return this.fragrancesRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const fragrance = await this.fragrancesRepository.findOne({ where: { id } });

    if (!fragrance) {
      throw new NotFoundException(`Fragrance with id ${id} was not found.`);
    }

    return fragrance;
  }

  async update(
    id: number,
    updateFragranceDto: UpdateFragranceDto,
    image?: Express.Multer.File,
  ) {
    const fragrance = await this.findOne(id);

    const nextPrice = updateFragranceDto.price ?? fragrance.price;
    const nextPromotionalPrice =
      updateFragranceDto.promotionalPrice !== undefined
        ? updateFragranceDto.promotionalPrice
        : fragrance.promotionalPrice;

    this.validatePromotionalPrice(nextPrice, nextPromotionalPrice);

    if (image && fragrance.image) {
      this.removeImageFile(fragrance.image);
    }

    Object.assign(fragrance, {
      ...updateFragranceDto,
      description:
        updateFragranceDto.description !== undefined
          ? updateFragranceDto.description
          : fragrance.description,
      image: image ? this.buildImagePath(image.filename) : fragrance.image,
    });

    return this.fragrancesRepository.save(fragrance);
  }

  async remove(id: number) {
    const fragrance = await this.findOne(id);

    if (fragrance.image) {
      this.removeImageFile(fragrance.image);
    }

    await this.fragrancesRepository.remove(fragrance);

    return { message: `Fragrance with id ${id} was deleted successfully.` };
  }

  private validatePromotionalPrice(
    price: number,
    promotionalPrice?: number | null,
  ) {
    if (promotionalPrice === undefined || promotionalPrice === null) {
      return;
    }

    if (promotionalPrice >= price) {
      throw new BadRequestException(
        'Promotional price must be lower than the regular price.',
      );
    }
  }

  private buildImagePath(fileName: string) {
    return `/uploads/fragrances/${fileName}`;
  }

  private removeImageFile(imagePath: string) {
    const normalizedPath = imagePath.replace(/^\/+/, '');
    const filePath = join(process.cwd(), normalizedPath);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}