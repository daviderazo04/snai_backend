import { Request } from 'express';

export interface AuditedRequest extends Request {
  auditoriaId?: number; // ID de auditoría (creado en el guard)
  params: {
    id?: string;
    [key: string]: any;
  };
}
