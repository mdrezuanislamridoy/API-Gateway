import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateOrderDto) {
    const total = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId: data.userId,
        total,
        items: { create: data.items },
      },
      include: { items: true },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.order.delete({ where: { id } });
  }
}
