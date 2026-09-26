import { test } from '@playwright/test';

type AsyncMethod<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Promise<Return>;

export function step<This extends object, Args extends unknown[], Return>(
  method: AsyncMethod<This, Args, Return>,
  context: ClassMethodDecoratorContext<This, AsyncMethod<This, Args, Return>>,
): AsyncMethod<This, Args, Return> {
  return function (this: This, ...args: Args) {
    const details = args.filter((arg) => typeof arg === 'string').join(', ');
    const title = `${this.constructor.name}.${String(context.name)}(${details})`;
    return test.step(title, () => method.apply(this, args), { box: true });
  };
}
