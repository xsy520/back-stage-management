import Home from "../pages/Home"
const dynamicRoutes = [

    {
        path: "/",
        component: Home,
        children: [],
    },
    {
        path: '*',
        name: "page404",
        component: () => import(/* webpackChunkName:"page404" */ "../pages/Page404")
    },
]

export default dynamicRoutes