export * from "./permissions";
export * from "./settings";

// Useful type utilities

export type ArrayElement<T> = T extends (infer U)[] ? U : never;
