import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FragrancesController } from './fragrances.controller';
import { Fragrance } from './entities/fragrance.entity';
import { FragrancesService } from './fragrances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fragrance])],
  controllers: [FragrancesController],
  providers: [FragrancesService],
})
export class FragrancesModule {}