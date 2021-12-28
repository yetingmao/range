import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Table, Modal, Input, Divider, Select } from 'antd';
import './style.less';
import { addEntityTag, getLable, getRelationship } from "@/api";
const { confirm } = Modal;
const { Option } = Select;

export default function () {
    //用户列表数据
    const [dataList, setDataList] = useState([]);
    const [lable, setLable] = useState([]);
    //分页
    const [pagination, setPagination] = useState({
        hideOnSinglePage: true,//只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 10,//每页多少条
        total: 0,//总数目
        onChange: (page, pageSize) => { //回调函数
            const tempPagination = { ...pagination, pageSize, current: page };
            setPagination(tempPagination);
        }
    });
    //首页初次加载，只根据分页去更新列表
    useEffect(() => {
        getGroupList();
    }, []);
    useEffect(() => {
        getList();
    }, [pagination.current]);
    // 模态框显示 
    const [modelShow, setModelShow] = useState(false);
    // 
    const [data, setData] = useState({
    });
    // 用户
    const [query, setQuery] = useState({
    });

    const columns = [
        { title: "关系名称", key: "name", dataIndex: "name", align: "center" },
        {
            title: "开始标签", key: "startTagId", dataIndex: "startTagId", align: "center", render: (text, record, index) => (
                <div>
                    {lable.find(item => item.id === text) ? lable.find(item => item.id === text).name : ""}
                </div>)
        },
        {
            title: "结束标签", key: "endTagId", dataIndex: "endTagId", align: "center", render: (text, record, index) => (
                <div>
                    {lable.find(item => item.id === text) ? lable.find(item => item.id === text).name : ""}
                </div>)
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (text, record, index) => (
                <div>
                    <Button type="primary" shape="circle" icon="edit" onClick={() => {
                        setData(record);
                        setModelShow(!modelShow);
                    }} />
                    {/* <Divider type="vertical" />
                    <Button type="danger" shape="circle" icon="delete" onClick={() => {
                        del(record["id"]);
                    }} /> */}
                </div>)
        }
    ];
    const startele = lable.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
    const endele = lable.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
    return (
        <div className="container" >
            <Modal
                wrapClassName="template_model"
                title={data.id ? "修改" : "添加"}
                visible={modelShow}
                onOk={() => addOrUp()}
                onCancel={() => { reset() }}
            >
                <div className="model_menu">
                    <div className="menu_name"> <div className="name_wain">*</div>关系标签名称：</div>
                    <div className="menu_value">
                        <Input placeholder="" value={data.name} onChange={(e) => { setData({ ...data, name: e.target.value }) }} />
                    </div>
                </div>
                <div className="model_menu">
                    <div className="menu_name"> <div className="name_wain">*</div>开始标签：</div>
                    <div className="menu_value">
                        <Select disabled={data.id ? true : false} style={{ width: 200 }} value={data.startTagId} onChange={(value) => {
                            setData({ ...data, startTagId: value })
                        }}>
                            {startele}
                        </Select>
                    </div>
                </div>
                <div className="model_menu">
                    <div className="menu_name"> <div className="name_wain">*</div> 结束标签：</div>
                    <div className="menu_value">
                        <Select disabled={data.id ? true : false} style={{ width: 200 }} value={data.endTagId} onChange={(value) => {
                            setData({ ...data, endTagId: value })
                        }}>
                            {endele}
                        </Select>
                    </div>
                </div>
            </Modal>
            <CustomBreadcrumb arr={["数据服务", "标签管理"]} />
            <div className="content">
                <div className="content_web">
                    <div className="web_template">
                        <div className="template_top">
                            <div className="top_item">
                                <div className="item_title">关系名：</div>
                                <Input
                                    placeholder="关系名"
                                    style={{ width: 200 }}
                                    onChange={(e) => {
                                        setQuery({ ...query, relationshipName: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="top_item">
                                <Button type="primary" icon="search" onClick={() => {
                                    getList()
                                }}>
                                    查询
                            </Button>
                            </div>
                        </div>
                        <div className="template_body">
                            <div className="body_action">
                                <Button type="primary" icon="plus" onClick={() => {
                                    reset()
                                }}>
                                    添加
                            </Button>
                            </div>
                            <div className="body_middle">
                                <div className="middle_table">
                                    <Table
                                        rowKey={record => record.id}
                                        columns={columns}
                                        pagination={pagination}
                                        dataSource={dataList}
                                        scroll={{ y: 450, scrollToFirstRowOnChange: true }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
    /**
    * @description: 获取列表
    * @param {type}
    * @return:
    * @author: yetm
    */
    async function getList() {
        const page = pagination.current;
        const limit = pagination.pageSize;
        const data = await getRelationship({ ...query, pageNum: page, pageSize: limit });
        const { total, rows } = data;
        const tempPagination = { ...pagination, total };
        setPagination(tempPagination);
        setDataList(rows);
    }
    async function getGroupList() {
        const data = await getLable();
        const { rows } = data;
        setLable(rows)
    }
    /**
    * @description: 创建或更新
    * @param {type}
    * @return:
    * @author: yetm
    */
    async function addOrUp() {
        const {
            id,
            name,
            startTagId,
            endTagId
        } = data;
        if (!name) {
            message.error("名称不能为空");
            return;
        }
        if (!startTagId) {
            message.error("开始标签不能为空");
            return;
        }
        if (!endTagId) {
            message.error("结束标签不能为空");
            return;
        }

        if (id) {
            // 更新
            const res = await addEntityTag(data);
            if (res.code === 200) {
                message.success("更新成功");
            } else {
                message.error(res.msg);
            }
        } else {
            const res = await addEntityTag(data);
            if (res.code === 200) {
                message.success("新增成功");
            } else {
                message.error(res.msg);
            }
        }
        await getList()
        reset()
    }
    function del(id) {
        confirm({
            content: '确定要删除这条记录吗',
            onOk: async () => {
                // const res = await delFlaw({ id: id })
                // if (res.code !== 200) {
                //     message.error(res.msg);
                // }
                getList();
            },

        });
    }
    function reset() {
        setModelShow(!modelShow)
        setData({})
    }
}
