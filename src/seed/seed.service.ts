import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async restoreData() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertNewProducts(user);

    return { message: 'Data restored!' };
  }

  private async deleteTables() {
    await this.productsService.removeAll();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const newUsers = initialData.users;

    const users: User[] = [];

    newUsers.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 12);

      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const insertPromises = [];

    products.forEach(async (product) => {
      insertPromises.push(await this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);
  }
}
