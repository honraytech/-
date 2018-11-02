const selfFn = {
  /**
   * [debugCustomPage 本地调试自定义组件页面组件]
   *
   * 请注意，该方法只能运行于本地调试，线上环境不能运行，
   * 同时使用此方法的前提是该自定义页面组件已绑定某个页面，
   * 另外，若已在云平台对该自定义页面组件绑定执行函数，则className、functionName可不填，
   * 云平台绑定的执行函数优先级高于此方法传递的执行函数
   * obj: 对象值，调用该方法的vue实例对象
   * config: 对象值，包含调试所需的参数，具体如下，
   *   path: 字符串，请求地址，必填，如，http://a64api.wkuai.cc/
   *   token: 字符串，用户验证，必填（可以在云平台-开发者中心-token管理界面获取）
   *   dealId: 字符串，绑定该自定义页面组件的页面功能点ID，必填（可以在云平台-开发者中心-自定义页面组件界面获取）
   *   className: 字符串，定制函数的类名，由用户自定义，选填，如，app\\functions\\projectid298\\getUser（两个反斜杠是为了转移反斜杠）
   *   functionName: 字符串，定制函数的函数名，由用户自定义，选填，如，getUserInfo
   *   params: 对象值，所选定制函数所需参数，由用户自定义，选填，如，{ a: 1, b: [1] }
   */
  async debugCustomPage(obj, config) {
    if (process.env.NODE_ENV !== 'development') {
      _g.toastMsg(obj, 'warning', '本地调试方法不能在线上环境使用，请及时删除')
      return '本地调试方法不能在线上环境使用，请及时删除'
    }
    let postData = {}
    if (!_g.isRealEmpty(config.className) && typeof (config.className) === 'string') {
      postData.className = config.className
    }
    if (!_g.isRealEmpty(config.functionName) && typeof (config.functionName) === 'string') {
      postData.functionName = config.functionName
    }
    if (!_g.isRealEmpty(config.params) && typeof (config.params) === 'object') {
      for (let proto in config.params) {
        postData[proto] = config.params[proto]
      }
    }
    let header = {
      token: {
        value: config.token
      },
      debug: {
        value: 1
      }
    }
    if (config.path.charAt(config.path.length - 1) !== '/') {
      config.path = config.path + '/'
    }
    let res = await obj.apiPost(`${config.path}cms/contents/free/${config.dealId}`, postData, '', header)
    return res
  }
}
export default selfFn
