import Qs from "querystring";
import { request } from "@/utils";

// 数据集
export async function getDocument(query) {
    const url = `/text/document/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}

export async function addDocument(body) {
    return await request({
        url: "/text/document",
        method: "post",
        data: body
    });
}

export async function updateDocument(body) {
    return await request({
        url: "/text/document",
        method: "put",
        data: body
    });
}
// 标签组
export async function addLableGroup(body) {
    return await request({
        url: "/text/group",
        method: "post",
        data: body
    });
}
export async function getLableGroup(query) {
    const url = `/text/group/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}
// 标签
export async function getLable(query) {
    const url = `/text/tag/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}
export async function addLable(body) {
    return await request({
        url: "/text/tag",
        method: "post",
        data: body
    });
}

export async function getContent(body) {
    const url = `/text/content/next`;
    return await request({
        url,
        method: "post",
        data: body
    });
}

export async function setEntityTag(data) {
    const url = `/text/entityTag`;
    return await request({
        url,
        method: "post",
        data
    });
}

export async function getEntityTag(query) {
    const url = `/text/entityTag/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}

export async function getRelationship(query) {
    const url = `/text/relationship/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}
export async function addEntityTag(data) {
    const url = `/text/relationship`;
    return await request({
        url,
        method: "post",
        data
    });
}

export async function addEntityRelationship(data) {
    const url = `/text/entityRelationship`;
    return await request({
        url,
        method: "post",
        data
    });
}

export async function getEntityRelationship(query) {
    const url = `/text/entityRelationship/list?${Qs.stringify(query)}`;
    return await request({
        url,
        method: "get",
    });
}