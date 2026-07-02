import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AcademicModule } from '../academic/academic.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AcademicModule, NotificationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
