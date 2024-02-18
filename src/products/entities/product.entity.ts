import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";

@Entity({
  schema: 'public',
})
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  // @Column('text', { unique: true })
  // sku: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true, nullable: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replaceAll(/\s+/g, '_').replaceAll("'", '');
  }
}
