
export enum PromiseResponseType {
  Resolved,
  Rejected,
  Expired
}

export type PromiseResponse<T> =
  {
    status: PromiseResponseType.Resolved
    value: T
    error: undefined
  } |
  {
    status: PromiseResponseType.Rejected
    value: undefined
    error: Error
  } |
  {
    status: PromiseResponseType.Expired
    value: undefined
    error: Error
  }

/**
 * This function waits for an array of promises to finish
 * 
 * Behavior:
 * 
 * As soon as any of the promises resolve,
 * this triggers an internal countdown (based on maxRunTimeAfterFirstResolveInMs)
 * after which the function will stop everything, and return the promises results.
 * Promises that finish after countdownAfterFirstResolveInMs will be ignored and their result discarded.
 * 
 * The result is an array matching the input number of promises, but with different status based on what happened:
 * 
 * Promises that resolved will be of type `{ status: PromiseResponseType.Resolved, value: ...... }`.
 * Promises that failed will be of type  `{ status: PromiseResponseType.Rejected, error: ...... }`.
 * Promises that failed will be of type  `{ status: PromiseResponseType.Expired, error: ...... }`.
 * 
 * Note that it is possible that no promises resolves at all,
 * which is why we also have a global expiration timeout (based on maxTotalRunTimeInMs) with more priority,
 * that will also stop the function and return the promises results (they will also have the expired status)
 * 
 * Note that maxTotalRunTimeInMs is reached, countdownAfterFirstResolveInMs becomes irrelevant,
 * so all promises that finish after maxTotalRunTimeInMs will be ignored and their result discarded.
 */
export async function waitPromisesUntil<T>(
  promises: Promise<T>[],
  countdownAfterFirstResolveInMs: number = 1000,
  maxTotalRunTimeInMs: number = 10000
): Promise<PromiseResponse<T>[]> {
  // This will store the result for each promise as it finishes or the operation is terminated.
  const results: PromiseResponse<T>[] = Array(promises.length).fill(undefined);
  /*{
    status: "expired",
    error: new Error("Promise expired")
  });
  */

  // Timer to handle maxTotalRunTimeInMs
  let globalTimeoutHandler: any;

  // Timer to handle countdownAfterFirstResolveInMs
  let firstResolveCountdownHandler: any;

  // Helper function to handle promise resolution
  const handleResolved = (index: number, value: T) => {
    if (!results[index]) { // If result isn't yet set
      results[index] = { status: PromiseResponseType.Resolved, value, error: undefined };
    }
    if (!firstResolveCountdownHandler) {
      // Start countdown after the first resolve
      firstResolveCountdownHandler = setTimeout(() => {
        finalizePromises(); // Stop accepting results after the countdown
      }, countdownAfterFirstResolveInMs);
    }
  };

  // Helper function to handle promise rejection
  const handleRejected = (index: number, error: any) => {
    if (!results[index]) {
      results[index] = { status: PromiseResponseType.Rejected, error, value: undefined };
    }
  };

  // Early finalization function to handle both timeouts
  const finalizePromises = () => {
    clearTimeout(globalTimeoutHandler);
    clearTimeout(firstResolveCountdownHandler);
    for (let i = 0; i < promises.length; i++) {
      if (!results[i]) { // Promises that have not been settled by either handler
        results[i] = { status: PromiseResponseType.Expired, error: new Error('Promise expired'), value: undefined };
      }
    }
  };

  // Wrap each promise with resolution and rejection handlers
  const watchedPromises = promises.map((promise, index) =>
    promise.then(
      value => handleResolved(index, value),
      error => handleRejected(index, error)
    )
  );

  // Set the global timeout
  globalTimeoutHandler = setTimeout(() => {
    finalizePromises();
  }, maxTotalRunTimeInMs);

  // Await all wrapped promises
  await Promise.all(watchedPromises.map(p => p.catch(() => {}))); // Catch errors to prevent early exits
  finalizePromises(); // Finalize to ensure all promises not settled are marked expired
  return results;
}