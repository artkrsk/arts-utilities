export type TBrand<K, T> = K & { __brand: T }
export type TURI = TBrand<string, 'URI'>
export type TSelector = TBrand<string, 'Selector'>
export type TAttributeName = TBrand<string, 'AttributeName'>
export type TScope = Element | Document
export type TElement = HTMLElement | Element
