import React, { useState, useEffect } from 'react';
import { CustomBreadcrumb } from '@/component'
import { Button, message, Input, Tabs, Popover, Select, Modal, Icon, Checkbox, Tree } from 'antd';
import './style.less';
import { getContent, getLableGroup, getLable, addEntityRelationship, getEntityRelationship, addLable, getRelationship } from "@/api";
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
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
    const [relationship, setRelationship] = useState();
    // 点击标签时的坐标
    const [line, setLine] = useState();
    const [query, setQuery] = useState({
        entityRelationshipStatus: 2
    });
    const [count, setCount] = useState({
        labeledCount: 0,
        unlabeledCount: 0,
    });
    //选择的关系
    const [selectRelation, setSelectRelation] = useState();
    let markEle;
    if (texts.length) {
        markEle = texts.map((item, i) => {
            const { content, lable, relatList } = item;
            let man;// 图标

            if (line && line.n1 === i) {
                man = <Icon type="man" style={{ position: "absolute", top: "-12px", left: "50%", color: "orange" }} />;
            }
            let relat;//关系标签
            if (line && line.x2 && line.n2 === i) {
                if (line.relats.length) {
                    const temp = line.relats.map((relats, i) => {
                        return <div key={i} onClick={(e) => {
                            setRel(e, line.n1, line.n2, relats)
                        }}>
                            {relats.name}
                        </div>
                    })
                    relat = <div className="lable_relation" >
                        {temp}
                    </div>
                } else {
                    relat = <div className="lable_relation" >
                        <div>暂无关系</div>
                        <div>当前选中的实体类别标签无可添加的关系</div>
                    </div>
                }
            }
            if (line && line.style) {
                man = "";
            }
            let ele = <span key={i}>{content}</span>;
            if (lable) {
                let relN;
                let relEle;
                if (!line && relatList && relatList.length > 0) {
                    relN = `(${relatList.length})`;
                    const temp1 = relatList.map((relItem, j) => {
                        const { id, name, startTagName, endTagName, n1, n2 } = relItem;
                        return <div key={j}>
                            <Checkbox value={`${id}-${n1}-${n2}-${i}`} onClick={(e) => {
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()
                            }}>
                                <div className="selrel_option">
                                    {name}：{startTagName} <Icon type="arrow-right" style={{ margin: "0 10px" }} /> {endTagName}
                                </div>
                            </Checkbox>
                        </div>
                    })
                    relEle = <div className="lable_selrel">
                        <Checkbox.Group value={selectRelation} style={{ width: '100%' }} onChange={(value) => {
                            setSelectRelation(value)
                        }}>
                            {temp1}
                        </Checkbox.Group>
                        <div className="selrel_act">
                            <Button style={{ margin: "10px 10px 0 0" }} onClick={(e) => {
                                delRel(e)
                            }}>删除关系</Button>
                        </div>
                    </div>
                }
                ele = <span key={i} className="bottom_info">
                    <span className="info_text">{content}</span>
                    <span className="info_lable"
                        onContextMenu={(e) => {
                            setSelectN(i)
                            change(e)
                        }}
                        e onClick={(e) => {
                            clickLabel(e, i, lable)
                        }}
                    >{lable}{relN}
                        {man}
                        {relat}
                        {relEle}
                    </span>
                </span >
            }
            return ele
        })
    }
    useEffect(() => {
        setSelection(document.getSelection());
        const { id } = props.location.query;
        init({ documentId: id })
        getLableList()
        // getGroupList()
    }, [])
    let labelsSet = new Set();
    const relationshipEle = relationship && relationship.map((item, i) => {
        const { name, startTagName, endTagName, } = item;
        labelsSet.add(startTagName)
        labelsSet.add(endTagName)
        return <Button type="link" key={i}>{name}：{startTagName} | {endTagName}</Button>
    })
    const labelC = Array.from(labelsSet).map((item, i) => {
        return <div key={i} className="lable_item" onClick={() => {
            selectLable(item)
        }}>{item}</div>
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
            <CustomBreadcrumb arr={["数据服务", "实体关系标注"]} />
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
                            <Tabs defaultActiveKey={`${query.entityRelationshipStatus}`} size="large" onChange={(key) => {
                                getList({ entityRelationshipStatus: key, getLast: "", currentContentId: "" })
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
                                    {line && line.style ? <div className="bottom_border" style={line.style}>
                                        <Icon type="caret-down" style={{
                                            position: "absolute", right: `${line.x2 > line.x1 ? "-4px" : undefined}`, top: 8, color: "orange",
                                            transform: `${line.x2 > line.x1 ? "rotate(-40deg)" : "rotate(40deg)"}`,
                                            left: `${line.x2 > line.x1 ? undefined : "-4px"}`
                                        }} />
                                    </div> : ""}
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
                                {/* <div className="lable_add">
                                    <Button type="primary" onClick={() => { reset() }} >添加标签</Button>
                                </div> */}

                            </div>
                            <div className="lable_notice">根据文本内容，选择标签(标签内容不支持编辑)</div>
                            <div className="lable_list">
                                {relationshipEle}
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
    // 点击标签
    function clickLabel(e, i, lable) {
        e.preventDefault();
        e.persist()
        const { offsetTop, offsetLeft } = e.target;
        if (line) {
            if (line.style) {
                const _line = {
                    x1: offsetLeft,
                    y1: offsetTop,
                    n1: i,
                    startTagName: lable
                }
                setLine(_line)
                return;
            }
            const { startTagName, x1 } = line;
            const temp = relationship.filter(item => item.startTagName === startTagName && item.endTagName === lable);
            let _line
            if (temp) {
                const left = x1 < offsetLeft ? x1 + 20 : offsetLeft + 20
                const width = Math.abs(offsetLeft - x1);
                _line = {
                    ...line, x2: offsetLeft, y2: offsetTop, relats: temp, n2: i,
                    style: {
                        left,
                        top: 15,
                        width,
                        height: "40px",
                    }
                };
            } else {
                _line = { ...line, x2: offsetTop, y2: offsetLeft, };
            }
            setLine(_line)
        } else {
            const _line = {
                x1: offsetLeft,
                y1: offsetTop,
                n1: i,
                startTagName: lable
            }
            setLine(_line)
        }


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
    async function getList(opt, templist) {
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
        const res = await getEntityRelationship({ contentId: id });
        const obj = {};
        if (res && res.length) {
            for (const item of res) {
                const { startEntityTagName,//标签
                    startEntityStartCoordinate,//开始下表
                    startEntityEndCoordinate, //结束下标
                    startEntityName,// 实体名字
                    startEntityId,//实体id
                    startEntityTagId,

                    endEntityTagName,
                    endEntityStartCoordinate,
                    endEntityEndCoordinate,
                    endEntityName,
                    endEntityId,
                    endEntityTagId,
                    relationshipId,
                    id
                } = item;

                if (!obj[startEntityStartCoordinate]) {
                    obj[startEntityStartCoordinate] = {
                        startCoordinate: startEntityStartCoordinate,
                        endCoordinate: startEntityEndCoordinate,
                        entityName: startEntityName,
                        tagName: startEntityTagName,
                        id: startEntityId,
                        tagId: startEntityTagId,
                        start: [
                            { id, relationshipId }
                        ],
                    }
                } else {
                    obj[startEntityStartCoordinate].start.push({ id, relationshipId })
                }
                if (!obj[endEntityStartCoordinate]) {
                    obj[endEntityStartCoordinate] = {
                        startCoordinate: endEntityStartCoordinate,
                        endCoordinate: endEntityEndCoordinate,
                        entityName: endEntityName,
                        tagName: endEntityTagName,
                        id: endEntityId,
                        tagId: endEntityTagId,
                        end: [
                            id,
                        ],
                    }
                } else {
                    obj[endEntityStartCoordinate].end.push(id)
                }
            }
        }
        const arr = [];
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                arr.push(obj[key])
            }
        }
        arr.sort((a, b) => {
            return parseInt(a.startCoordinate, 10) - parseInt(b.startCoordinate, 10)
        })
        for (const item of arr) {
            const { startCoordinate, endCoordinate, tagId, tagName, entityName, start, end } = item;
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
            if (temp1 !== "") {
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
                start,
                end,
            })
            if (temp2) {
                arr.push({
                    id,
                    content: temp2
                })
            }
            data.splice(data.length - 1, 1, ...arr);
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.start) {
                let _templist = relationship;
                if (!_templist) {
                    _templist = templist;
                }
                for (const iterator of element.start) {
                    const { id, relationshipId } = iterator;
                    const n2 = data.findIndex(item => item.end && item.end.includes(id));
                    const relats = _templist.find(item => item.id === relationshipId);
                    if (element["relatList"]) {
                        element["relatList"].push({
                            ...relats,
                            n1: index,
                            n2,
                            value: `${relats.id}${index}${n2}`
                        })
                    } else {
                        element["relatList"] = [{
                            ...relats,
                            n1: index,
                            n2,
                            value: `${relats.id}${index}${n2}`
                        }]
                    }
                    if (data[n2]["relatList"]) {
                        data[n2]["relatList"].push({
                            ...relats,
                            n1: index,
                            n2,
                            value: `${relats.id}${index}${n2}`
                        })
                    } else {
                        data[n2]["relatList"] = [{
                            ...relats,
                            n1: index,
                            n2,
                            value: `${relats.id}${index}${n2}`
                        }]
                    }
                }


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
    async function getRelationList() {
        const data = await getRelationship();
        const { rows } = data;
        setRelationship(rows);
        return rows;
    }
    async function init(opt) {
        const temp = await getRelationList()
        getList(opt, temp)
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
        const m = {};
        let contentId;
        for (const item of texts) {
            const { id, relatList } = item;
            contentId = id;
            if (relatList && relatList.length) {
                for (const rel of relatList) {
                    const { value, n1, n2, startTagId, endTagId } = rel;
                    if (!m[value]) {
                        const data = texts[n1];
                        const data1 = texts[n2];
                        m[value] = {
                            relationshipId: rel.id,
                            startTagId,
                            startEntityName: data.content,
                            startEntityStartCoordinate: data.startCoordinate,
                            startEntityEndCoordinate: data.endCoordinate,
                            endTagId,
                            endEntityName: data1.content,
                            endEntityStartCoordinate: data1.startCoordinate,
                            endEntityEndCoordinate: data1.endCoordinate,
                        }
                    }
                }
            }
        }
        const reqs = [];
        for (const key in m) {
            if (Object.hasOwnProperty.call(m, key)) {
                const element = m[key];
                reqs.push(element)
            }
        }
        return await addEntityRelationship({ reqs, contentId });
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
    function setRel(e, n1, n2, relats) {
        e.nativeEvent.stopImmediatePropagation()
        e.stopPropagation()
        setLine()
        const temptexts = JSON.parse(JSON.stringify(texts))
        if (!temptexts[n1].relatList) {
            temptexts[n1].relatList = [{ ...relats, n1, n2, value: `${relats.id}${n1}${n2}` }]
        } else {
            temptexts[n1].relatList.push({ ...relats, n1, n2, value: `${relats.id}${n1}${n2}` })
        }
        if (!temptexts[n2].relatList) {
            temptexts[n2].relatList = [{ ...relats, n1, n2, value: `${relats.id}${n1}${n2}` }]
        } else {
            temptexts[n2].relatList.push({ ...relats, n1, n2, value: `${relats.id}${n1}${n2}` })
        }
        setTexts(temptexts)
    }
    function delRel(e) {
        e.nativeEvent.stopImmediatePropagation()
        e.stopPropagation()
        const temptexts = JSON.parse(JSON.stringify(texts))
        for (const str of selectRelation) {
            const arr = str.split("-");
            const obj1 = temptexts[arr[1]];
            const temp1 = obj1.relatList.filter((item) => item.id != arr[0]);
            temptexts[arr[1]].relatList = temp1;
            const obj2 = temptexts[arr[2]];
            const temp2 = obj2.relatList.filter((item) => item.id != arr[0]);
            temptexts[arr[2]].relatList = temp2;
        }
        console.log(temptexts)
        setTexts(temptexts)
    }
}