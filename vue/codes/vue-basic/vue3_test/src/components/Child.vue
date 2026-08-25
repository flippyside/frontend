<template lang="">
    <div class="Child">
        <h1>Child {{ name }} {{ price }}</h1> 
    </div>
</template>
<script>
import { reactive, ref, toRefs, inject } from "vue"
export default {
    name:'Child',

    setup(){
        let car = inject('car')
        return {
            ...toRefs(car)
        }
    }
}
</script>
<style>
.Child{
    background-color: #8baaff88;
    padding: 10px;
}
</style>