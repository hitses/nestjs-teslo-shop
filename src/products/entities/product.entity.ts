import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    description: 'Product ID',
    example: '04596ee7-13e0-4730-9d4a-f7c66358952c',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: "Jero's Shirt",
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.95,
    default: 0,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    nullable: true,
    default: null,
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product slug',
    example: 'jeros-shirt',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    description: 'Product stock',
    example: 22,
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Product sizes array',
    example: ['S', 'M', 'L', 'XL'],
    isArray: true,
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'F',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    example: ['shirts', 'trousers', 'jackets'],
    isArray: true,
    default: [],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
