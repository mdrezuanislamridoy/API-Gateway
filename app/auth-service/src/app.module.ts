import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
})
export class AppModule {}
