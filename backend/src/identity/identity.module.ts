import { Module } from '@nestjs/common';
import { AcademicModule } from '../academic/academic.module';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

@Module({
  imports: [AcademicModule],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
