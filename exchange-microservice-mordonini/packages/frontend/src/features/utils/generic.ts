/**
 * Map a generic object { ... key: generic-value, ...} to {... value: generic-value, label: generic-value }
 * @param input 
 * @returns corresponding mapped object
 */
export const mapObjectToAntdSelect = (input: Object) => Object.values(input).map(v => {return {value: v, label: v}})