import { OfferStatus } from '@prisma/client';

export interface OfferResponse {
  id: string;
  courseCode: string;
  courseName: string;
  nrc: string;
  professorEmail: string;
  professorName: string;
  vacancies: number;
  description: string;
  applicationStart: Date;
  applicationEnd: Date;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}
