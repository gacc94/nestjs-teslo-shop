import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) { }
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      console.log({ product });
      return await this.productRepository.save(product);
    } catch (error: any) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Ayudaaa', { cause: error.message })
  }
}
