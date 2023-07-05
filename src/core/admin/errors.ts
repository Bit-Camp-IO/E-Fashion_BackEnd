export class ManagerExistError extends Error {
  constructor() {
    super('Manager aleady exists');
  }
}
