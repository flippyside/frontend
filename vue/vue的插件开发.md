## props

- 在使用 `<script setup>` 的单文件组件中，使用 defineProps 宏来声明
- 没有使用 `<script setup>` 的组件，使用 props 选项来声明

修改 props：父组件更新后，所有子组件中的 props 都会被更新到最新值。在子组件中不能修改 prop。

- 但是，当**对象或数组**作为 props 被传入时，虽然子组件无法更改 props 绑定，但仍然可以更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递

修改 props 的两种场景即解决方案：

- 子组件希望将 props 作为一个局部数据属性：新定义一个数据，拷贝 props 上的值
- 对 props 的值做进一步的转化：定义一个计算属性
