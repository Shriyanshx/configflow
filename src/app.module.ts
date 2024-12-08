import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConditionModule } from './condition-node/modules/condition.module';
import { AuthModule } from './auth/auth.module';
import { OrgModule } from './org/org.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'admin',
      username: 'postgres',
      entities: [User],
      database: 'configflow',
      synchronize: true,
      autoLoadEntities:true,
      logging: true,
    }),
    ConditionModule,
    UserModule,
    AuthModule,
    OrgModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
