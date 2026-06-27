import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateModelDto } from './create-model.dto';

// All fields optional except ownerId (not updateable after creation)
export class UpdateModelDto extends PartialType(OmitType(CreateModelDto, ['ownerId'] as const)) {}
