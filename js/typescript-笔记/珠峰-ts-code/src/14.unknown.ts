// unknown 和 any 都是顶级的类型

type keys1 = keyof any;
type keys2 = keyof unknown; //unknown 是无法识别的类型 没有key

type unionUnknown = unknown | string | true | false; // unknown 任何类型都可以赋予给unknown
type interUnknown = unknown & string; // string

// 如果无法确定的类型 不要贸然采用any
// any不校验 意味着可以调用 可以取值

let a: unknown = 1; // unknown 是any的安全类型

// 如果标识为unknown 类型 必须先类型保护再去使用 （收窄类型 在使用）

function isNumber(val: unknown): val is number {
  return typeof val === "number";
}
function isString(val: unknown): val is string {
  return typeof val === "string";
}

if (isNumber(a)) {
  a.toFixed; //
} else if (isString(a)) {
  a.charCodeAt;
}

export {};
