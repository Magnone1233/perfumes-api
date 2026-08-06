import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const emptyStringToUndefined = (value: unknown): unknown => {
  if (value === '') {
    return undefined;
  }

  return value;
};

const parseDecimalInput = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed;

  return Number(normalized);
};

export class CreateFragranceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @Transform(({ value }) => emptyStringToUndefined(value))
  @IsString()
  description?: string;

  @Transform(({ value }) => parseDecimalInput(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price!: number;

  @IsOptional()
  @Transform(({ value }) => emptyStringToUndefined(value))
  @Transform(({ value }) => parseDecimalInput(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  promotionalPrice?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  stock!: number;
}
