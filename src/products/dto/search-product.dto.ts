import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class SearchProductDto extends PartialType(CreateProductDto) { }
