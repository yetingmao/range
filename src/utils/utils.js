function arrayToJson(list, pid) {
        function _f(pid) {
            const a = [];
            for (const item of list) {
                const temp = { ...item };
                if (temp.pid === pid) {
                    temp.children = _f(temp.id)
                    a.push(temp);
                }
            }
            return a;
        }
        return _f(pid)
}

export {
  arrayToJson
}