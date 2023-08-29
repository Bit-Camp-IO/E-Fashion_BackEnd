import { HttpStatus } from '@server/utils/status';
import { Router } from 'express';
import { version } from '../../../../package.json';

export function initVersion(router: Router) {
  /**
   * @openapi
   * /api/version:
   *  get:
   *    tags:
   *      - Version
   *    description: Response with api version
   *    responses:
   *      200:
   *        description: successful operation
   *
   */
  router.get('/version', (_, res) => res.JSON(HttpStatus.Ok, { version }));
}
