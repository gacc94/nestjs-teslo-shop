import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @IsPositive()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset?: number;
}