import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchProductDto } from '../dto/search-product.dto';

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

  async findAll(paginationDto: PaginationDto, searchDto: SearchProductDto) {
    try {
      const { description, slug, title } = searchDto;
      const { limit = 10, offset = 0 } = paginationDto;
      const where: any = {}
      if (title) {
        where.title = Like(`%${title}%`);
      }
      if (description) {
        where.description = Like(`%${description}%`);
      }
      if (slug) {
        where.slug = Like(`%${slug}%`);
      }
      const [products, total] = await this.productRepository.findAndCount({
        take: limit,
        skip: offset,
        where
      });
      return {
        data: products,
        meta: { total }
      }
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAllProducts(paginationDto: PaginationDto, searchDto: SearchProductDto) {
    try {
      const { description, slug, title } = searchDto;
      if (!description && !slug && !title) {
        return this.findAll(paginationDto, searchDto);
      }
      const [products, total] = await this.productRepository.createQueryBuilder('product')
        .where('product.title LIKE :title OR product.slug LIKE :slug', {
          title: `%${title}%`,
          slug: `%${slug}%`
        })
        .getManyAndCount();

      return {
        data: products,
        meta: { total }
      }

    } catch (error) {

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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({ id, ...updateProductDto });
    if (!product) throw new NotFoundException(`Product whit id: ${id} not found`);
    return await this.productRepository.save({ ...product, ...updateProductDto });
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
