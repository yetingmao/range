/*
 * @Description:加载laoding组件，父级必须为 position: relative;
 * @Autor: yetm
 * @Date: 2020-04-01 09:09:42
 * @LastEditors: yetm
 * @LastEditTime: 2020-04-29 14:16:22
 */
import { Spin } from 'antd'
import './style.less';

const Loading = (props) => (
    <Spin className={`loading ${props.loading ? "show" : ""}`} size="large" spinning={props.loading} />
)
export default Loading