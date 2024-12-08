import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from 'src/user/user.module';
import { OrgModule } from 'src/org/org.module';

@Module({
  imports:[UserModule,
    JwtModule.register({
      global: true,
      secret: 'KingKong',
      signOptions: { expiresIn: '600000m' },
    }),
   OrgModule
  ],
  controllers: [AuthController],
  
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

  ]
})
export class AuthModule {}
