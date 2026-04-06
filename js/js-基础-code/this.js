let dom = {
    addEventListener(type, cb) {
        dom["on" + type] = cb
    },
    trigger(type) {
        dom.onclick()
        console.log(this)
    }
}
dom.addEventListener('click', function(){
    console.log(this)
})
dom.trigger('click')
