const TryCatchWrapper = (_: any, __: string, descriptor: PropertyDescriptor) => {
  const fn = descriptor.value;
  descriptor.value = async (...args: any) => {
    try {
      await fn.apply(this, args);
    } catch (error) {
      if (!error.code || error.code > 504) error.code = 500;
      const [, , next] = args;
      next(error);
    }
  };
  return descriptor;
};

export function Controller<T>() {
  return function (target: new (...params: any[]) => T) {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        descriptor = TryCatchWrapper(null, key, descriptor);
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
  };
}
