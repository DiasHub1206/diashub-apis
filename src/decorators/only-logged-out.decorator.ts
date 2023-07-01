import { SetMetadata } from '@nestjs/common';

export const ONLY_LOGGED_OUT_DEC_KEY = 'isLoggedOut';
export const OnlyLoggedOut = () => SetMetadata(ONLY_LOGGED_OUT_DEC_KEY, true);
