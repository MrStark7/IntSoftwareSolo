import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AcademicModule } from './academic/academic.module';
import { IdentityModule } from './identity/identity.module';
import { OfferModule } from './offer/offer.module';
import { ApplicationModule } from './application/application.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AcademicModule,
    IdentityModule,
    OfferModule,
    ApplicationModule,
    TeacherModule,
  ],
})
export class AppModule {}
