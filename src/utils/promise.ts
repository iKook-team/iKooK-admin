/**
 * Error object thrown if the promise is canceled.
 */
export interface Cancellation {
  wasCancelled: boolean;
}

/**
 * A promise that can be canceled (primarily to be used in backend calls).
 *
 * When the promise is canceled, it will be rejected with a Cancellation error.
 */
export class CancellablePromise<T> implements Promise<T> {
  private static seq = 0;
  readonly id = CancellablePromise.seq++;
  readonly [Symbol.toStringTag]: string = 'CancellablePromise';
  private readonly promise: Promise<T>;
  private rejectInnerPromise?: (reason?: Cancellation) => void;
  private hasFinished = false;

  constructor(originalPromise: Promise<T>) {
    this.promise = new Promise<T>((resolve, reject) => {
      this.rejectInnerPromise = reject;
      originalPromise
        .then(
          (r) => resolve(r),
          (e) => reject(e)
        )
        .finally(() => (this.hasFinished = true));
    });
  }

  cancel() {
    if (!this.hasFinished) {
      // console.log('Cancel Promise:', this.id)
      this.rejectInnerPromise && this.rejectInnerPromise({ wasCancelled: true });
    }
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.promise.catch(onRejected);
  }

  finally(onFinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onFinally);
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected);
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
