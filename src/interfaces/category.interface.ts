import type { Type } from '../enums/category.enum';

export interface CreateCategoryDto {
  title: string;
  type: Type;
}
