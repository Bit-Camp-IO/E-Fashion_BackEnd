import { HttpStatus } from '@server/utils/status';
import { Router } from 'express';
import { version } from '../../../../package.json';

export function initVersion(router: Router) {
  router.get('/version', (_, res) => res.JSON(HttpStatus.Ok, { version }));
}
