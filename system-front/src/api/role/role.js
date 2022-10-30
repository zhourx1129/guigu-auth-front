import request from '@/utils/request'

const api_name = '/admin/system/sysRole'
export default {
    // 查询
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    // 删除
    removeId(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },
    // 添加
    saveRole(role) {
        return request({
            url: `${api_name}`,
            method: 'post',
            data: role
        })
    },
    // 根据id查询
    getRoleId(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'get'
      })  
    },
    // 修改
    updateRole(role) {
        return request({
            url: `${api_name}`,
            method: 'put',
            data: role,
        })
    },
    // 批量删除
    batchRemove(ids) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: ids,
        })
    },
}
