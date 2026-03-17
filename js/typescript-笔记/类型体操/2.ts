// 类型体操！2 字符串篇

// ======================================================================================
// 1. 首字母大写
// ======================================================================================

export type CapitializeString<T> = T extends string ? `${Capitalize<T>}` : T;

type a1 = CapitializeString<"parent">;
type a2 = CapitializeString<233>;

// ======================================================================================
// 2. 获取字符串的首尾字符
// ======================================================================================

export type FirstChar<T> = T extends `${infer L}${infer R}` ? L : never;

type A = FirstChar<"abc">;
type B = FirstChar<"a">;
type C = FirstChar<"">;

// 用模板字符串把字符串逐字符拆掉，L 保留当前字符，R 继续递归。当 R 为空时，F 就是最后一个字符。
export type LastChar<T, F = never> = T extends `${infer L}${infer R}`
  ? LastChar<R, L>
  : F;

type D = LastChar<"abc">;

// ======================================================================================
// 3. 字符串转换为元组类型
// ======================================================================================

// 不停地取字符串的每一项，将其放在数组中，最终返回结果
type StringToTuple<T, F extends any[] = []> = T extends `${infer L}${infer R}`
  ? StringToTuple<R, [...F, L]>
  : F;

type a = StringToTuple<"abc.def">;

// ======================================================================================
// 4. 元组转换为字符串类型
// ======================================================================================

type TupleToString<T extends any[], F extends string = ""> = T extends [
  infer L,
  ...infer R
]
  ? TupleToString<R, `${F}${L & string}`>
  : F;

type aa = TupleToString<["a", "b", "c"]>;

// ======================================================================================
// 5. 循环字符
// ======================================================================================

// 复制字符 T 为字符串类型，长度为 C

type ReapeatString<
  T extends string, // 要循环的字符
  C extends number, // 目标长度
  A extends any[] = [], // 数组计数器（用数组长度来数到 C），通过每次添加一个undefined来计数
  F extends string = "" // 结果字符串
> = C extends A["length"]
  ? F
  : ReapeatString<T, C, [...A, undefined], `${F}${T}`>;

type AA = ReapeatString<"a", 3>;

// ======================================================================================
// 6. 分割字符串
// ======================================================================================

// 将字符串字面量类型按照指定字符，分割为元组。无法分割则返回原字符串字面量

type SplitString<
  T extends string,
  S extends string,
  A extends any[] = []
> = T extends `${infer L}${S}${infer R}`
  ? SplitString<R, S, [...A, L]>
  : [...A, T];

type b = SplitString<"handle-open-flag", "-">;

// ======================================================================================
// 6. 计算字符串字面量类型的长度
// ======================================================================================

type LengthOfString<
  T extends string,
  A extends any[] = []
> = T extends `${infer L}${infer R}`
  ? LengthOfString<R, [...A, L]>
  : A["length"];

type c = LengthOfString<"abc">;

// ======================================================================================
// 7. 驼峰命名转横杠命名
// ======================================================================================

type RemoveFirst<T, K extends string> = T extends `${K}${infer R}` ? R : T;

// 将每个字符与它的大写做比较，若相等，就转化为 `-小写`
type KebabCase<
  T extends string,
  F extends string = ""
> = T extends `${infer L}${infer R}`
  ? KebabCase<R, `${F}${Capitalize<L> extends L ? `-${Lowercase<L>}` : L}`>
  : RemoveFirst<F, "-">;

type d = KebabCase<"HandleOpenFlag">;

// ======================================================================================
// 8. 横杠命名转化为驼峰命名
// ======================================================================================

type CamelCase<
  T extends string,
  F extends string = ""
> = T extends `${infer L}-${infer R1}${infer R2}`
  ? CamelCase<R2, `${F}${L}${Capitalize<R1>}`>
  : `${Capitalize<`${F}${T}`>}`;

type e = CamelCase<"handle-open-flag">; // HandleOpenFlag

// ======================================================================================
// 9. 得到对象中的值访问字符串
// ======================================================================================

// 将联合类型K，进行分发分别取值
type ObjectAccessPaths<
  T,
  F extends string = "",
  K = keyof T
> = K extends keyof T
  ? T[K] extends object
    ? // 如果当前的值时对象就继续递归拼接，并且将当前解析的key拼接到结果集中
      ObjectAccessPaths<T[K], `${F}.${K & string}`>
    : RemoveFirst<`${F}.${K & string}`, "."> // 这里会丢失不是对象的最后一个key，需要加入到结果集中
  : never;

// --------------- test ------------------
// 实现：只能传合法路径
function createI18n<Schema>(
  schema: Schema
): (path: ObjectAccessPaths<Schema>) => void {
  return (path) => {};
}

const i18n = createI18n({
  home: {
    topBar: {
      title: "顶部标题",
      welcome: "欢迎登录",
    },
    bottomBar: {
      notes: "XXX备案，归XXX所有",
    },
  },
  login: {
    username: "用户名",
    password: "密码",
  },
});

i18n("home.topBar.title"); // correct
i18n("home.topBar.welcome"); // correct
i18n("home.bottomBar.notes"); // correct

// i18n('home.login.abc')              // error，不存在的属性
// i18n('home.topBar')                 // error，没有到最后一个属性

// ======================================================================================
// 10. 判断传入的字符串字面量类型中是否含有某个字符串
// ======================================================================================

type Include<T extends string, C extends string> = T extends ""
  ? C extends ""
    ? true
    : false
  : T extends `${infer L}${C}${infer R}`
  ? true
  : false;

type f1 = Include<"Jiang", "J">; // true
type f2 = Include<"Jiang", "J">; // true
type f3 = Include<"", "">; // true 空字符串时需要特殊处理
type f4 = Include<"abs", "ddd">;

// ======================================================================================
// 11. Trim
// ======================================================================================

type TrimLeft<T extends string> = T extends ` ${infer R}` ? TrimLeft<R> : T;
type TrimRight<T extends string> = T extends `${infer L} ` ? TrimRight<L> : T;
type Trim<T extends string> = TrimRight<TrimLeft<T>>;

type j = Trim<"   Jiang    ">;

// ======================================================================================
// 12. replace
// ======================================================================================

// 将 T 中的 C 替换为 RC
/**
 * 先考虑特殊情况
思路：
如果C为空：
- 如果T为空，直接返回RC
- 如果T非空，返回RC+T
如果C非空：
- 使用infer来判断C是否在T中
  - 如果存在，继续递归C右边的字符串，并将C所在的位置替换为RC
  - 否则返回结果
    - 注意返回时要加上剩下的右边(即T)：`${F}${T}`
 */
type Replace<
  T extends string,
  C extends string,
  RC extends string,
  F extends string = ""
> = C extends ""
  ? T extends ""
    ? RC
    : `${RC}${T}`
  : T extends `${infer L}${C}${infer R}`
  ? Replace<R, C, RC, `${F}${L}${RC}`>
  : `${F}${T}`;

type aaa = Replace<"ha ha ha", "ha", "he">;

// ======================================================================================
// 13. 定义组件的监听事件类型
// ======================================================================================

// 实现 ComponentEmitsType<Emits> 类型，将
type ComponentEmitsType<T> = {
  [K in keyof T as `on${CamelCase<K & string>}`]: T[K] extends (
    ...args: infer P
  ) => any
    ? (...args: P) => void // 将返回值变为void
    : never;
};

type h = {
  "handle-open": (flag: boolean) => true;
  "preview-item": (data: { item: any; index: number }) => true;
  "close-item": (data: { item: any; index: number }) => true;
};

type i = ComponentEmitsType<h>;
