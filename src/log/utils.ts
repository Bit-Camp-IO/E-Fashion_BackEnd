export function logRequest(method: string, path: string, ip: string, agent: string) {
  log.info(`[${method}] ${path} <- |Client ${ip}| |Agent ${agent}|`);
}

export function logResponse(method: string, path: string, statusCode: number, ms: number) {
  if (statusCode >= 500) {
    log.error(`[${method}] ${path} -> |${statusCode}| [${ms}ms]`);
    return;
  } else if (statusCode >= 400) {
    log.warn(`[${method}] ${path} -> |${statusCode}| [${ms}ms]`);
    return;
  } else {
    log.info(`[${method}] ${path} -> |${statusCode}| [${ms}ms]`);
  }
}
