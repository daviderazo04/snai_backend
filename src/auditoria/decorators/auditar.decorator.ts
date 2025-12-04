import { SetMetadata } from '@nestjs/common';

export const AUDIT_ENTITY_KEY = 'auditEntity';
export const Auditar = (entity: any) => SetMetadata(AUDIT_ENTITY_KEY, entity);
