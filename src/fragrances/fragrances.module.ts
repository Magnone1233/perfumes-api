import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { FragrancesController } from './fragrances.controller';
import { Fragrance } from './entities/fragrance.entity';
import { FragrancesService } from './fragrances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fragrance]), AdminModule],
  controllers: [FragrancesController],
  providers: [FragrancesService],
})
export class FragrancesModule {}
