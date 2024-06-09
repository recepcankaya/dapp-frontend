export type Status = {
  success: unknown;
  message: string;
};

export const initialState: Status = {
  success: undefined,
  message: "",
};
