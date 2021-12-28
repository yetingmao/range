import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Table, Modal, Input, Icon, Select } from 'antd';
import './style.less';
import { getLableGroup, getLable, addLable } from "@/api";
const { confirm } = Modal;
const { Option } = Select;

export default function () {
    //用户列表数据
    const [dataList, setDataList] = useState([]);
    const [group, setGroup] = useState([]);
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
        idNames: [{}],
    });
    // 用户
    const [query, setQuery] = useState({
    });

    const columns = [
        { title: "标签名称", key: "name", dataIndex: "name", align: "center" },
        {
            title: "标签组", key: "groupId", dataIndex: "groupId", align: "center", render: (text, record, index) => (
                <div>
                    {group.find(item => item.id === text) ? group.find(item => item.id === text).name : ""}
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
                        setData({
                            ...record, idNames: [{
                                id: record.id,
                                name: record.name,
                            }]
                        });
                        setModelShow(!modelShow);
                    }} />
                    {/* <Divider type="vertical" />
                    <Button type="danger" shape="circle" icon="delete" onClick={() => {
                        del(record["id"]);
                    }} /> */}
                </div>)
        }
    ];
    const ele = group.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
    const labelEle = data.idNames.map((item, i) => {
        let _ele;
        if (i === data.idNames.length - 1) {
            _ele = <div className="model_menu" key={i}>
                <div className="menu_name"> <div className="name_wain">*</div>标签名称：</div>
                <div className="menu_value">
                    <Input style={{ width: 200 }} placeholder="" value={item.name} onChange={(e) => {
                        const _name = [...data.idNames];
                        _name[i].name = e.target.value
                        setData({ ...data, idNames: _name })
                    }} />
                    {item.id ? "" : <Button style={{ marginLeft: 10 }} type="primary" icon="plus" onClick={() => {
                        const _name = [...data.idNames];
                        _name.push({});
                        setData({ ...data, idNames: _name })
                    }} />}
                </div>
            </div>
        } else {
            _ele = <div className="model_menu" key={i}>
                <div className="menu_name"> <div className="name_wain">*</div>标签名称：</div>
                <div className="menu_value">
                    <Input placeholder="" value={item.name} onChange={(e) => {
                        const _name = [...data.idNames];
                        _name[i].name = e.target.value
                        setData({ ...data, idNames: _name })
                    }} />
                </div>
            </div>
        }
        return _ele;
    });
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
                    <div className="menu_name"> <div className="name_wain">*</div> 标签组：</div>
                    <div className="menu_value">
                        <Select style={{ width: 200 }} value={data.groupId} onChange={(value) => {
                            setData({ ...data, groupId: value })
                        }}>
                            {ele}
                        </Select>
                    </div>
                </div>
                {labelEle}

            </Modal>
            <CustomBreadcrumb arr={["数据服务", "标签管理"]} />
            <div className="content">
                <div className="content_web">
                    <div className="web_template">
                        <div className="template_top">
                            <div className="top_item">
                                <div className="item_title">标签名称：</div>
                                <Input
                                    placeholder="标签名称"
                                    style={{ width: 200 }}
                                    onChange={(e) => {
                                        setQuery({ ...query, name: e.target.value })
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
        const data = await getLable({ ...query, pageNum: page, pageSize: limit });
        const { total, rows } = data;
        const tempPagination = { ...pagination, total };
        setPagination(tempPagination);
        setDataList(rows);
    }
    async function getGroupList() {
        const data = await getLableGroup();
        const { rows } = data;
        setGroup(rows)
    }
    /**
    * @description: 创建或更新
    * @param {type}
    * @return:
    * @author: yetm
    */
    async function addOrUp() {
        const {
            groupId,
            idNames,
        } = data;
        const temp = data.idNames.filter(item => item.name);
        if (!temp.length) {
            message.error("至少填一个标签名");
            return;
        }
        if (temp[0].id) {
            // 更新
            const res = await addLable({
                groupId,
                idNames: temp
            });
            if (res.code === 200) {
                message.success("更新成功");
            } else {
                message.error(res.msg);
            }
        } else {
            const res = await addLable({
                groupId,
                idNames: temp
            });
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
        setData({
            idNames: [{}],
        })
    }
}
