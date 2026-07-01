import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { ApplicationModule } from '../application/application.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [ApplicationModule, TeacherModule],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
