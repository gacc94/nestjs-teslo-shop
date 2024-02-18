import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
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

  async findAll() {
    try {
      return await this.productRepository.find();
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) throw new NotFoundException(`Product whit id: ${id} not found`);
      return product
    } catch (error) {
      this.handleException(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product whit id: ${id} not found`);
    await this.productRepository.delete(id);
    return { message: `This action removes a #${id} product` };
  }

  private handleException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Ayudaaa', { cause: error.message })
  }
}
