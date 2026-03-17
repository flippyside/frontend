// Extract Exclude , NonNullable...
// 除了基于条件类型之外，我门还有基于对象类型

interface Person1 {
  handsome: string;
}
interface Person2 {
  high: string;
}

// for(let key in Object.keys(T) ) { }

type IKeys1 = keyof any; // string | number | symbol  使用场景比较多
type IKeys2 = keyof unknown; //  never
type Compute<T extends object> = {
  [xxxxxxxxx in keyof T]: T[xxxxxxxxx];
};
type Person3 = Compute<Person1 & Person2>;

// partial required pick omit.... 内置类型
interface IPerson {
  name: string;
  age: number;
}
interface ICompany {
  name: string;
  age: number;
  address: string;
  person: IPerson;
}

type Partial<T> = {
  [key in keyof T]?: T[key];
};
type DeepPartial<T> = {
  // 递归的深度可选
  [key in keyof T]?: T[key] extends object ? DeepPartial<T[key]> : T[key];
};
type PartialRes1 = DeepPartial<ICompany>;

type Required<T> = {
  [key in keyof T]-?: T[key];
};
type DeepRequired<T> = {
  // 递归的深度可选
  [key in keyof T]-?: T[key] & {} extends object
    ? DeepRequired<T[key]>
    : T[key];
};
type PartialRes2 = DeepRequired<PartialRes1>;

let company: PartialRes2 = {
  name: "string",
  age: 10,
  address: "string",
  person: {
    name: "jw",
    age: 30,
  },
};

export {};
