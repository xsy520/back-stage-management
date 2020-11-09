//根据服务器用户返回的menuList数据和allRoutes进行匹配，得到符合当前用户的有效路由配置
/**
 * 
 * @param {Array} allRoutes     用户名的有效完整的路由配置
 * @param {Array} menuList      服务器返回的用户菜单名字
 */
import allRoutes from "./../router/allRoutes"
const recursionRoutes = (allRoutes, menuList) => {
    let userRoutes = []
    //有children应该优先匹配children
    allRoutes.forEach(item => {
        menuList.forEach(v => {
            if (item.meta.name === v.name) {
                //或者用v.children.length > 0
                if (v.children && Array.isArray(v.children)) {
                    item.children = recursionRoutes(item.children, v.children)
                }
                userRoutes.push(item)
            }
        })
    })
    return userRoutes
}
export default recursionRoutes
