type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K
}[keyof T];

type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T extends Object> = Exclude<
  Exclude<Extract<ValuesOf<T>, object>, never>,
  Array<any>
>;

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;
  
export type DeepFlatten<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten2<ObjectValuesOf<T>>>
: never;

type DeepFlatten2<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten3<ObjectValuesOf<T>>>
: never;

type DeepFlatten3<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten4<ObjectValuesOf<T>>>
: never;

type DeepFlatten4<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten5<ObjectValuesOf<T>>>
: never;

type DeepFlatten5<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten6<ObjectValuesOf<T>>>
: never;

type DeepFlatten6<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten7<ObjectValuesOf<T>>>
: never;

type DeepFlatten7<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten8<ObjectValuesOf<T>>>
: never;

type DeepFlatten8<T> = T extends any
? Pick<T, NonObjectKeysOf<T>> &
    UnionToIntersection<DeepFlatten9<ObjectValuesOf<T>>>
: never;

type DeepFlatten9<T> = T extends any
? Pick<T, NonObjectKeysOf<T>>
: UnionToIntersection<ObjectValuesOf<T>>;