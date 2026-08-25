<template lang="">
    <div class="son">
        <h1>Son {{ name }} {{ price }}</h1> 
        <button @click="price++">addd</button>
    </div>
</template>
<script>
import { reactive, ref, toRefs, inject } from "vue"
export default {
    name:'Son',
    setup(){
        let car = inject('car')
        return {
            ...toRefs(car)
        }
    }
}
</script>
<style>
.son{
    
    background-color: #abf5ef8f;
    /* margin: 10px, 10px, 10px, 10px; */
    padding: 10px;
}
</style>