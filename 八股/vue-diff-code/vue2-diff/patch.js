export function patch(oldVnode, vnode) {
    // 通过是否有nodeType，来判断oldVnode是否为元素节点
    if (oldVnode.nodeType) {
        // 是真实元素节点
        // 创建新的真实节点，添加到该节点上
        const el = createElm(vnode);
        oldVnode.appendChild(el);
    } else {
        // 是虚拟节点
        patchVnode(oldVnode, vnode)
    }
}

// 相同节点：标签 和 key相同
function isSameVnode(oldVnode, vnode) {
    return (oldVnode.tag === vnode.tag) && (oldVnode.key === vnode.key)
}

function patchVnode(oldVnode, vnode) {
    // 比较两个节点，用vnode更新oldVnode
    if (!isSameVnode(oldVnode, vnode)) {
        // 两个节点不同，创建新的真实节点，将老dom元素替换成新元素
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }

    // 两个节点相同，复用节点
    const el = vnode.el = oldVnode.el

    // debugger

    if (!oldVnode.tag) { // 文本
        if (oldVnode.text !== vnode.text) {
            // 通过更新el，实现复用
            el.textContent = vnode.text
        }
    }

    // 元素
    // 更新属性
    updateProperties(vnode, oldVnode.data)

    // 更新子节点
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []

    // console.log(oldChildren.length, newChildren.length);


    if (oldChildren.length > 0 && newChildren.length > 0) {
        // 双方都有子节点
        updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
        // 老节点有子节点，而新节点没有。直接删除子节点
        el.innerHTML = ''
    } else if (newChildren.length > 0) {
        // 老节点没有子节点，而新节点有。添加子节点
        for (let i = 0; i < newChildren.length; i++) {
            el.appendChild(createElm(newChildren[i]))
        }
    }

}

// 给DOM元素添加样式
function updateProperties(vnode, oldProps = {}) {
    const newProps = vnode.data || {}
    const el = vnode.el

    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle) {
        // 样式：老元素有的而新元素没有，从老元素中删去
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    for (let key in oldProps) {
        // 属性同理
        if (!newProps[key]) {
            el.removeAttribute(key, newProps[key])
        }
    }

    for (let key in newProps) {
        if (key == 'style') {
            for (let styleName in newProps.style)
                el.style[styleName] = newProps.style[styleName]
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

function createElm(vnode) {
    let { tag, data, key, children, text } = vnode;
    // 如果标签名是字符串，说明是一个元素节点
    if (typeof tag === "string") {
        // 创建真实节点el，绑定到虚拟节点上
        vnode.el = document.createElement(tag); // createElement: DOM api
        updateProperties(vnode);
        // 递归创建子节点
        children.forEach((child) => {
            return vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function updateChildren(el, oldChildren, newChildren) {
    // 双端比对+双指针
    let oldStartIdx = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIdx = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIdx]

    let newStartIdx = 0;
    let newStartVnode = newChildren[0];
    let newEndIdx = newChildren.length - 1
    let newEndVnode = newChildren[newEndIdx]

    function makeIndexByKey(children) {
        let map = {};
        children.forEach((child, index) => {
            map[child.key] = index;
        })
        return map
    }
    // 老节点的key与索引的映射
    const map = makeIndexByKey(oldChildren)
    console.log(map);



    // 通过dom常见操作，优化diff算法：
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 跳过空节点
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIdx]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIdx]
        }
        // 情况1：针对【新节点在后面添加了新子元素】的情况
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode) // 递归
            // 从前往后比较
            oldStartVnode = oldChildren[++oldStartIdx]
            newStartVnode = newChildren[++newStartIdx]
        }
        // 情况2：针对【新节点在前面添加了新子元素】的情况
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            // 从后往前比较
            oldEndVnode = oldChildren[--oldEndIdx]
            newEndVnode = newChildren[--newEndIdx]
        }
        // 情况3：针对【新节点将末尾子元素移到开头】的情况 
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            // 将尾部移动到头部
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIdx]
            newStartVnode = newChildren[++newStartIdx]
        }
        // 情况4：针对【新节点将开头子元素移到末尾】的情况 
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            // 将头部移动到尾部
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIdx]
            newEndVnode = newChildren[--newEndIdx]
        }
        else {
            // 用新的子节点去老节点里面找，找到就复用，否则创建
            // debugger
            // 用新的子节点去老节点里面找索引
            let moveIndex = map[newStartVnode.key]

            if (moveIndex == undefined) {
                // 创建新节点
                el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                let moveVnode = oldChildren[moveIndex]
                // 将节点插入到头部
                el.insertBefore(moveVnode.el, oldStartVnode.el)
                oldChildren[moveIndex] = null
                patchVnode(moveVnode, newStartVnode);
            }
            newStartVnode = newChildren[++newStartIdx]
        }
    }

    // 删除多余的老子节点
    if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            let child = oldChildren[i]
            if (child) {
                el.removeChild(child.el)
            }
        }
    }

    // 新子节点还有剩余，插入
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            let ele = newChildren[i]

            // 判断是插入头部还是末尾
            let anchor = newChildren[newEndIdx + 1] == null ? null : newChildren[newEndIdx + 1].el

            el.appendChild(createElm(ele), anchor)
        }
    }

}