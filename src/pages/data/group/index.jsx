import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Table, Modal, Input, Divider, Icon } from 'antd';
import './style.less';
import { getLableGroup, addLableGroup, delFlaw } from "@/api";
const { confirm } = Modal;

export default function () {
    //用户列表数据
    const [dataList, setDataList] = useState([]);

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
        getList();
    }, [pagination.current]);
    // 模态框显示 
    const [modelShow, setModelShow] = useState(false);
    // 
    const [data, setData] = useState({
        id: "",
        name: "", //名字

    });
    // 用户
    const [query, setQuery] = useState({
        name: "", //名字
    });

    const columns = [
        { title: "标签组名称", key: "name", dataIndex: "name", align: "center" },
        { title: "描述", key: "remark", dataIndex: "remark", align: "center" },
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
    return (
        <div className="container" >
            <Modal
                wrapClassName="template_model"
                title={data.id === "" ? "添加" : "修改"}
                visible={modelShow}
                onOk={() => addOrUp()}
                onCancel={() => { reset() }}
            >
                <div className="model_menu">
                    <div className="menu_name"> <div className="name_wain">*</div>标签组名称：</div>
                    <div className="menu_value">
                        <Input placeholder="" value={data.name} onChange={(e) => { setData({ ...data, name: e.target.value }) }} />
                    </div>
                </div>
                <div className="model_menu">
                    <div className="menu_name"> 描述：</div>
                    <div className="menu_value">
                        <Input placeholder="" value={data.remark} onChange={(e) => { setData({ ...data, remark: e.target.value }) }} />
                    </div>
                </div>
            </Modal>
            <CustomBreadcrumb arr={["数据服务", "标签组管理"]} />
            <div className="content">
                <div className="content_web">
                    <div className="web_template">
                        <div className="template_top">
                            <div className="top_item">
                                <div className="item_title">标签组名称：</div>
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
        const data = await getLableGroup({ ...query, pageNum: page, pageSize: limit });
        const { total, rows } = data;
        const tempPagination = { ...pagination, total };
        setPagination(tempPagination);
        setDataList(rows);
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
            name
        } = data;
        if (!name) {
            message.error("标签名不能为空");
            return;
        }

        if (id) {
            // 更新
            const res = await addLableGroup(data);
            if (res.code === 200) {
                message.success("更新成功");
            } else {
                message.error(res.msg);
            }
        } else {
            const res = await addLableGroup(data);
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
                const res = await delFlaw({ id: id })
                if (res.code !== 200) {
                    message.error(res.msg);
                }
                getList();
            },

        });
    }
    function reset() {
        setModelShow(!modelShow)
        setData({})
    }
}
