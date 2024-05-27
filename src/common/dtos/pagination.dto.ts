import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    default: 20,
    description: 'Limit of items per page',
  })
  limit: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    default: 0,
    description: 'Page number',
  })
  page: number;
}
