import { useState } from "react";

function App() {
  const [num, setNum] = useState(() => {
    const num1 = 1 + 2; // 3
    const num2 = 2 + 3; // 5
    return num1 + num2; // 8
  }); // 计算初始值

  return <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>;
}

export default App;
