import { OrderStatus } from '../../../prisma/generated/client';

export class UpdateOrderDto {
  status!: OrderStatus;
}
