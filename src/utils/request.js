/*
 * @Description: 
 * @Autor: yetm
 * @Date: 2019-11-14 11:23:16
 * @LastEditors: yetm
 * @LastEditTime: 2020-04-28 09:08:18
 */
import router from 'umi/router';
import { SERVERURL } from "../config";
import axios from 'axios';
import {
  message
} from 'antd';


function dealErrWith(err) {
  console.log('request-err-msg======>', JSON.stringify(err));
  message.error({
    background: true,
    content: '网络错误，稍后再试',
  });
}


const service = axios.create({
  timeout: 5 * 60 * 1000, // 请求超时时间   文档上传过慢  
  withCredentials: true,  //axios带着cookie 请求
  baseURL: SERVERURL, //将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
});
//发送拦截
service.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  //const token = sessionStorage.getItem("token");
  const token = localStorage.getItem("token");
  if (token) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = token; //请求头加上token
  }
  return config;
}, err => {
  dealErrWith(err);
});
//响应拦截
service.interceptors.response.use(response => {
  let res;
  if (response.status === 200) {
    res = response.data;
    if (res.code === 401) {
      window.localStorage.removeItem('token');
      router.push("/login")
    }
  } else if (response.status === 401) {
    window.localStorage.removeItem('token');
    router.push("/login")
  } else {
    res = response
  }
  return res;
}, err => {
  dealErrWith(err);
});

export default service;