import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Table, Upload, Select, Modal, Input, Radio, Divider, Icon, Tag } from 'antd';
import './style.less';
import { getDocument, addDocument, updateDocument } from "@/api";
import router from 'umi/router';
const { confirm } = Modal;

export default function () {
    //用户列表数据
    const [showUpload, setShowUpload] = useState(false);
    const [dataList, setDataList] = useState([]);
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

    });
    const [query, setQuery] = useState({});
    const [files, setFiles] = useState([]);
    const uploadConfig = {
        className: 'upload_list',
        multiple: true,
        showUploadList: showUpload,
        // withCredentials: true,
        // headers: {
        //     Authorization: localStorage.getItem("token"),
        // },
        beforeUpload: (file, fileList) => {
            setShowUpload(true)
            setFiles(fileList);
            return false
        },
        onRemove: (file) => {
            const temp = files.filter(item => item.uid !== file.uid);
            setFiles(temp)
            return true
        }
    };
    const columns = [
        { title: "名称", key: "name", dataIndex: "name", align: "center" },
        { title: "数量", key: "lineNumber", dataIndex: "lineNumber", align: "center" },
        {
            title: "实体-关系标注状态", key: "entityRelationshipStatus", dataIndex: "entityRelationshipStatus", align: "center", render: (text, record, index) => {
                return <div>
                    <Tag color="green">{text}</Tag>
                </div>
            }
        },
        {
            title: "实体标注状态", key: "entityTagStatus", dataIndex: "entityTagStatus", align: "center", render: (text, record, index) => {
                return <div>
                    <Tag color="blue">{text}</Tag>
                </div>
            }
        },
        {
            title: "创建时间", key: "createTime", dataIndex: "createTime", align: "center", render: (text, record, index) => {
                return <div>
                    {text}
                </div>
            }
        },

        {
            title: "操作",
            dataIndex: "active",
            width: "30%",
            key: "active",
            align: "center",
            render: (text, record, index) => {
                return <div>
                    <Button type="primary" onClick={() => {
                        router.push(`/data/entity?id=${record["id"]}`)
                    }} >实体标注</Button>
                    <Divider type="vertical" />
                    <Button type="primary" onClick={() => {
                        router.push(`/data/relmark?id=${record["id"]}`)
                    }} >实体关系标注</Button>
                    {/* <Button type="primary" shape="circle" icon="edit" onClick={() => {
                        setData(record)
                        setModelShow(true)
                    }} />
                    <Divider type="vertical" />
                    <Button type="danger" shape="circle" icon="delete" onClick={() => {
                        del(record["id"])
                    }} />
                    <Divider type="vertical" />
                    <Button type="primary" shape="circle" icon="tool" onClick={() => {
                        router.push(`/data/entity?id=${record["id"]}`)
                    }} /> */}
                </div>
            }
        }
    ];
    return (
        <div className="container" >
            <Modal
                wrapClassName="template_model"
                title={data.id === "" ? "添加数据集" : "修改数据集"}
                visible={modelShow}
                onOk={() => addOrUp()}
                onCancel={() => { resetInit() }}
            >
                <div className="model_menu">
                    <div className="menu_name"> <div className="name_wain">*</div>数据集名称：</div>
                    <div className="menu_value">
                        <Input placeholder="" value={data.name} onChange={(e) => { setData({ ...data, name: e.target.value }) }} />
                    </div>
                </div>
                {data.id ? "" : <div className="model_menu">
                    <div className="menu_name"><div className="name_wain">*</div>上传TXT文件：</div>
                    <div className="menu_value">
                        <Upload {...uploadConfig}>
                            <Button>
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </div>
                </div>}
            </Modal>
            <CustomBreadcrumb arr={["数据服务", "数据集管理"]} />
            <div className="content">
                <div className="content_web">
                    <div className="web_template">
                        <div className="template_body">
                            <div className="body_action">
                                <Button type="primary" icon="plus" onClick={() => {
                                    setModelShow(!modelShow)
                                }}>
                                    添加数据集
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
        const pageNum = pagination.current;
        const pageSize = pagination.pageSize;
        const data = await getDocument({ ...query, pageNum, pageSize });
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
            message.error("名称不能为空");
            return;
        }
        if (id) {
            const res = await updateDocument(data);
            if (res && res.code === 200) {
                message.success("更新成功");
            } else {
                message.error(res.msg);
            }
        } else {
            if (!files.length) {
                message.error("文件不能为空");
                return;
            }
            const fromdata = new FormData;
            for (const file of files) {
                fromdata.append("file", file);
            }
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    fromdata.append(key, data[key]);

                }
            }
            const res = await addDocument(fromdata);
            if (res && res.code === 200) {
                message.success("新增成功");
            } else {
                message.error(res.msg);
            }
        }
        await getList()
        resetInit()
    }
    function resetInit() {
        setData({
            type: "jpg"
        })
        setModelShow(!modelShow)
        setFiles([])
        setShowUpload(false)
    }
    function del(id) {
        confirm({
            content: '确定要删除这条记录吗',
            onOk: async () => {
                // await deleteFile(id)
                getList();
            },
        });
    }
}
