// 创建元素节点（虚拟节点）
export function createElement(tag, data = {}, ...children) {
    let key = data.key;
    // 将data中的key删除
    if (key) {
        delete data.key;
    }
    return vnode(tag, data, key, children);
}

// 创建文本节点
export function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}

function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text,
    };
}
