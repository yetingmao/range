/*
 * @Description:
 * @Autor: yetm
 * @Date: 2020-04-01 09:15:36
 * @LastEditors: zzj
 * @LastEditTime: 2020-08-17 15:19:43
 */
const sun = "http://172.22.179.234:8080/";
const chen = "http://172.22.189.24:8091";
const long = "http://172.22.189.47:8080";
const test = "http://172.22.189.114:8080";
const line = "http://114.116.247.159:8083/aip";
const SERVERURL = process.env.NODE_ENV === "development" ? sun : line;
// const AUTH = {
//     "标注员": [8, 9, 11],
//     "专家": [9, 10, 11],
//     "数据员": [6, 7, 11, 12],
//     "管理员": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
// }
export {
    SERVERURL
}