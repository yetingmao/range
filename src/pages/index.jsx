import React, { Component } from 'react';
import { Card, Col, Row, Steps, Icon } from 'antd';
import { connect } from 'dva';
import { CustomBreadcrumb } from '../component'
import './style.less';
const { Meta } = Card;
const { Step } = Steps;


const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

@connect(mapStateToProps, mapDispatchToProps)

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="container">
                <CustomBreadcrumb />
                <div className="content">
                    <div className="content_home">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title="摄像头管理" bordered={false} >
                                    <Steps className="card_list" progressDot current={6} direction="vertical">
                                        <Step title="摄像头信息" description="配置流地址，实现多个摄像头视频流的接入，支持列表导出" />
                                        <Step title="摄像头实时显示" description="实时调用模型返回的图片存档管理，支持查询、导出" />
                                        <Step title="识别图片管理" description="配置摄像头的流地址，进行视频下载、图像抽帧操作" />
                                    </Steps>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="样本采集" bordered={false} >
                                    <Steps className="card_list" progressDot current={6} direction="vertical">
                                        <Step title="摄像头实时显示" description="多路摄像头画面显示，选择摄像头和算法进行弹框实时识别" />
                                        <Step title="清洗任务管理" description="图片清洗任务管理，去除重复样本" />
                                        <Step title="视频处理" description="对视频文件夹路径进行批量抽帧任务创建" />
                                    </Steps>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title="模型应用" bordered={false} >
                                    <Steps className="card_list" progressDot current={6} direction="vertical">
                                        <Step title="模型上传" description="进行模型上传服务" />
                                        <Step title="模型配置管理" description="管理模型调用服务" />
                                        <Step title="模型传图体验" description="上传图片进行模型的在线体验" />
                                        <Step title="目标通知管理" description="告警日志的集中管理展示" />
                                    </Steps>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="样本管理" bordered={false} >
                                    <Steps className="card_list" progressDot current={6} direction="vertical">
                                        <Step title="数据统计" description="样本熟练、操作数据展示" />
                                        <Step title="样本目录" description="样本目录结构" />
                                        <Step title="设备管理" description="主设备标签管理" />
                                        <Step title="缺陷管理" description="缺陷特征标签管理" />
                                        <Step title="关联设备缺陷" description="设备-缺陷 1对多关联关系配置" />
                                    </Steps>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div >
        );
    }
}
export default Main
