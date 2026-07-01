import { IsString, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  offerId: string;
}
