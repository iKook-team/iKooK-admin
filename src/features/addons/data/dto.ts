import { GenericResponse } from '../../../app/data/dto.ts';
import { AddonClient } from './model.ts';

export type GetAllAddonsResponse = GenericResponse<Array<Addon & AddonClient>>;
