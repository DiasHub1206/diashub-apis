import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNVERIFIED_DEC_KEY = 'isUnverified';
export const AllowUnverified = () =>
  SetMetadata(ALLOW_UNVERIFIED_DEC_KEY, true);
