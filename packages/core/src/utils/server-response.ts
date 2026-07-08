export type TActionFieldErrors<T> = {
  [K in keyof T]?: string | string[];
} extends infer O ? { [K in keyof O]: O[K] } : never;

export type TActionResponse<TData = void, TFieldErrors = Record<string, string | string[]>> =
  | { success: true; data: TData; message?: string }
  | { success: false; fieldErrors?: TActionFieldErrors<TFieldErrors>; formError?: string };

export function actionSuccess<TData>(
  data: TData,
  message?: string,
): { success: true; data: TData; message?: string } {
  return { success: true, data, message };
}

export function actionError<TFieldErrors = Record<string, string | string[]>>(
  fieldErrors?: TActionFieldErrors<TFieldErrors>,
  formError?: string,
): { success: false; fieldErrors?: TActionFieldErrors<TFieldErrors>; formError?: string } {
  return { success: false, fieldErrors, formError };
}
