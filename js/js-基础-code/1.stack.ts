class Stack {
  private items: number[] = [];
  push(ele: number) {
    this.items.push(ele);
  }
  pop(): number | undefined {
    if (this.items.length > 0) return this.items.pop();
    return undefined;
  }
}

let stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());

function one() {
  function two() {
    function three() {
      console.log("3");
    }
    three();
  }
  two();
}
debugger;
one();
