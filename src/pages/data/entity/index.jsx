import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Input, Tabs, Popover, Select, Modal } from 'antd';
import './style.less';
import { getContent, getLableGroup, getLable, setEntityTag, getEntityTag, addLable } from "@/api";
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
export default function (props) {
    const [selection, setSelection] = useState();
    const [range, setRange] = useState();

    const [texts, setTexts] = useState([]);
    const [number, setNumber] = useState(1);

    const [selectN, setSelectN] = useState(0);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [popoverStyle, setPopoverStyle] = useState({});
    const [status, setStatus] = useState(0);

    //
    const [labels, setLabels] = useState([]);
    const [query, setQuery] = useState({
        entityTagStatus: 2
    });
    const [count, setCount] = useState({
        labeledCount: 0,
        unlabeledCount: 0,
    });
    let markEle;
    if (texts.length) {
        markEle = texts.map((item, i) => {
            const { content, lable } = item;
            let ele = <span key={i}>{content}</span>;
            if (lable) {
                ele = <span key={i} className="bottom_info">
                    <span className="info_text">{content}</span>
                    <span className="info_lable" onContextMenu={(e) => {
                        setSelectN(i)
                        change(e)
                    }}>{lable}</span>
                </span >
            }
            return ele
        })
    }
    useEffect(() => {
        setSelection(document.getSelection());
        const { id } = props.location.query;
        getList({ documentId: id })
        getLableList()
        getGroupList()
    }, [])
    const labelEle = labels.map((item, i) => {
        return <Button type="link" key={i}>{item.name}</Button>
    })
    const labelC = labels.map((item, i) => {
        return <div key={i} className="lable_item" onClick={() => {
            selectLable(item.name, item.id)
        }}>{item.name}</div>
    })
    const content = (
        <div className="popover_lable">
            {labelC}
            {status ? <div className="lable_action">
                <Button type="primary" onClick={() => {
                    cancle()
                }}>取消标注</Button>
            </div> : ""}
        </div>
    );
    const [group, setGroup] = useState([]);
    // 模态框显示 
    const [modelShow, setModelShow] = useState(false);
    // 
    const [data, setData] = useState({
        idNames: [{}],
    });
    const ele = group.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
    const labelEleModel = data.idNames.map((item, i) => {
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
        <div className="container">
            <CustomBreadcrumb arr={["数据服务", "实体标注"]} />
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
                {labelEleModel}

            </Modal>
            <div className="content">
                <div className="content_web">
                    <div className="web_template content_entity">
                        <div className="entity_mark">
                            <Tabs defaultActiveKey={`${query.entityTagStatus}`} size="large" onChange={(key) => {
                                getList({ entityTagStatus: key, getLast: "", currentContentId: "" })
                            }}>
                                <TabPane tab={`全部(${count.labeledCount + count.unlabeledCount})`} key={2} >
                                </TabPane>
                                <TabPane tab={`无标注信息(${count.unlabeledCount})`} key={0} >
                                </TabPane>
                                <TabPane tab={`有标注信息(${count.labeledCount})`} key={1} >
                                </TabPane>
                            </Tabs>
                            <div className="mark_body">
                                <div className="body_top">
                                    {/* <Search
                                        onSearch={value => console.log(value)}
                                        style={{ width: 300 }}
                                    /> */}
                                    <div></div>
                                    <div className="">
                                        {/* <Button icon="delete" type="link">删除文本</Button> */}
                                        <Button type="link" disabled={number === 1 ? true : false} onClick={() => {
                                            next(true)
                                        }}>上一篇</Button>
                                        <Button type="link" onClick={() => {
                                            next(false)
                                        }}>下一篇</Button>
                                    </div>
                                </div>
                                <div className="body_bottom" id="_entity" onMouseUp={(e) => {
                                    //console.log(e)
                                    mark(e)
                                }}>
                                    {markEle}
                                    <div className="bottom_popover" style={popoverStyle}>
                                        <Popover overlayStyle={{ userSelect: "none" }}
                                            trigger="click" placement="rightTop"
                                            visible={popoverVisible}
                                            content={content} title="请选择实体标签类别">
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="entity_lable">
                            <div className="lable_title">
                                <div>
                                    标签栏
                                </div>
                                <div className="lable_add">
                                    <Button type="primary" onClick={() => { reset() }} >添加标签</Button>
                                </div>

                            </div>
                            <div className="lable_notice">根据文本内容，选择标签(标签内容不支持编辑)</div>
                            <div className="lable_list">
                                {labelEle}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    function mark(e) {
        e.persist()
        setPopoverVisible(false)
        const temp = selection.getRangeAt(0);
        setRange(temp)
        const text = temp.toString();
        if (text) {
            setStatus(0)
            const { clientX, clientY } = e;
            setPopoverStyle({
                left: clientX - 220,
                // top: clientY,
            })
            setPopoverVisible(true)
            const n = texts.findIndex(item => item.content == temp.commonAncestorContainer.parentNode.textContent);
            setSelectN(n)
        }
    }
    function selectLable(lable, tagId) {
        setPopoverVisible(false)
        const temptexts = JSON.parse(JSON.stringify(texts))
        if (status === 0) {
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            const content = texts[selectN].content;
            const id = texts[selectN].id;
            const temp1 = content.substring(0, startOffset)
            const temp2 = content.substring(endOffset)
            const arr = [];
            if (temp1) {
                arr.push({
                    id,
                    content: temp1
                })
            }
            let n = 0;
            for (let index = 0; index < selectN; index++) {
                n = n + texts[index].content.length;
            }
            arr.push({
                id,
                content: range.toString(),
                lable,
                startCoordinate: startOffset + n,
                endCoordinate: endOffset + n,
                tagId,
            })
            if (temp2) {
                arr.push({
                    id,
                    content: temp2
                })
            }
            temptexts.splice(selectN, 1, ...arr);
        } else if (status === 1) {
            temptexts[selectN].lable = lable;
            temptexts[selectN].tagId = tagId;
        }
        setTexts(temptexts)
    }
    function change(e) {
        e.preventDefault();
        e.persist()
        setStatus(1)
        const { clientX } = e;
        setPopoverStyle({
            left: clientX - 220,
        })
        setPopoverVisible(true)
    }
    function cancle() {
        setPopoverVisible(false)
        const temptexts = JSON.parse(JSON.stringify(texts))
        const content = temptexts[selectN].content;
        if (temptexts[selectN - 1] && !temptexts[selectN - 1].lable) {
            temptexts[selectN - 1].content = temptexts[selectN - 1].content + content;
            temptexts.splice(selectN, 1);
        } else if (temptexts[selectN + 1] && !temptexts[selectN + 1].lable) {
            temptexts[selectN + 1].content = content + temptexts[selectN + 1].content;
            temptexts.splice(selectN, 1);
        } else {
            temptexts[selectN].lable = "";
        }
        setTexts(temptexts)
    }
    async function getList(opt) {
        let temp = { ...query };
        if (opt) {
            temp = { ...query, ...opt };
            setQuery({ ...query, ...opt })
        }
        const { content, id, labeledCount, unlabeledCount, num } = await getContent(temp);
        if (!id) {
            message.error("已经是最后一条了~")
            return;
        }
        setNumber(num)
        const data = [{ content, id }];
        const { rows } = await getEntityTag({ contentId: id });
        if (rows.length) {
            for (const item of rows) {
                const { startCoordinate, endCoordinate, tagId, tagName, entityName } = item;
                const lastContent = { ...data[data.length - 1] };
                const content = lastContent.content;
                const id = lastContent.id;
                let n = 0;
                for (let index = 0; index < data.length - 1; index++) {
                    n = n + data[index].content.length;
                }
                const temp1 = content.substring(0, startCoordinate - n)
                const temp2 = content.substring(endCoordinate - n)
                const arr = [];
                if (temp1) {
                    arr.push({
                        id,
                        content: temp1
                    })
                }
                arr.push({
                    id,
                    content: entityName,
                    lable: tagName,
                    startCoordinate,
                    endCoordinate,
                    tagId,
                })
                if (temp2) {
                    arr.push({
                        id,
                        content: temp2
                    })
                }
                data.splice(data.length - 1, 1, ...arr);
            }
        }
        setTexts(data)
        setCount({
            labeledCount,
            unlabeledCount,
        })
    }
    async function getGroupList() {
        const data = await getLableGroup();
        const { rows } = data;
        setGroup(rows)
    }
    async function getLableList() {
        const data = await getLable();
        const { rows } = data;
        setLabels(rows);
    }
    async function next(last) {
        const { code, msg } = await postLableList();
        if (code === 200) {
            getList({ currentContentId: texts[0].id, getLast: last })
        } else {
            message.error(msg)
        }

    }
    async function postLableList() {
        const reqs = texts.filter(item => item.tagId).map(_item => {
            return {
                endCoordinate: _item.endCoordinate,
                entityName: _item.content,
                startCoordinate: _item.startCoordinate,
                tagId: _item.tagId,
            }
        });
        console.log(reqs)
        return await setEntityTag({ reqs, contentId: texts[0].id });
    }
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
        const res = await addLable({
            groupId,
            idNames: temp
        });
        if (res.code === 200) {
            message.success("新增成功");
        } else {
            message.error(res.msg);
        }
        await getLableList()
        reset()
    }
    function reset() {
        setModelShow(!modelShow)
        setData({
            idNames: [{}],
        })
    }
}