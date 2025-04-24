export function handleErr(err: unknown) {
  if (err instanceof Error) {
    return { errMsg: err.message };
  }
  return { errMsg: "Unknown Error" };
}