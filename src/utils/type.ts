export type Merge<A, B> = Omit<B, keyof A> & A;
