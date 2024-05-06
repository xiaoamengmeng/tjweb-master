function debounce(func, delay) {
    let timer; // 定义计时器变量
    return function() {
        clearTimeout(timer); // 清除之前设置的计时器
        timer = setTimeout(() => {
            func.apply(this, arguments); // 在指定的delay后调用传入的函数
        }, delay);
    };
}

export {
    debounce
}