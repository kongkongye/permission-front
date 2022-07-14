import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import {getToken, loadLogin, saveLogin} from "@/util/login";
import {RequestConfig} from "@@/plugin-request/request";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      console.error(error)
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    // console.log('user>', currentUser);
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      // console.log(history);
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

loadLogin()
export const request: RequestConfig = {
  baseURL: isDev ? '/api' : 'http://localhost:8088',
  requestInterceptors: [
    (req) => {
      req.headers['X-Auth-Token'] = getToken() || '';
      return req;
    },
  ],
  responseInterceptors: [
    (resp) => {
      const xAuthToken = resp.headers['x-auth-token'];
      if (xAuthToken && xAuthToken !== getToken()) {
        saveLogin(xAuthToken);
      }
      //异常弹窗
      // if (resp.status === 200) {
      //   // @ts-ignore
      //   const data: Common.Result<any> = resp.data
      //   if (!data.success) {
      //     message.error(data.message)
      //     //未登陆
      //     if (data.code === 'notLogin') {
      //       history.push(loginPath)
      //     }
      //   }else {
      //     //自动解析
      //     // @ts-ignore
      //     if (!resp.config.manual) {
      //       // @ts-ignore
      //       resp.data = resp.data.map?.data
      //     }
      //   }
      // }
      return resp;
    },
  ],
};
