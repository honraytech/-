const commonFn = {
  j2s(obj) {
    return JSON.stringify(obj)
  },
  s2j(obj) {
    return JSON.parse(obj)
  },
  goBack() {
    router.go(-1)
  },
  toastMsg(obj, type, msg) {
    switch (type) {
      case 'normal':
        obj.$message(msg)
        break
      case 'success':
        obj.$message({
          message: msg,
          type: 'success',
          duration: 1500
        })
        break
      case 'warning':
        obj.$message({
          message: msg,
          type: 'warning',
          duration: 1500
        })
        break
      case 'error':
        // obj.$message.error(msg)
        // 缩短提示时间
        obj.$message({
          message: msg,
          type: 'error',
          duration: 1500
        })
        break
    }
  },
  clearVuex(cate) {
    store.dispatch(cate, [])
  },
  showJsonData(target) {
    console.log('target = ', this.j2s(target))
  },
  catchError(obj, func, msg) {
    try {
      func()
    } catch (e) {
      console.error('error in compoment: ' + obj.componentName)
      console.error(e)
      if (!msg) {
        msg = '系统异常，请联系开发人员进行修复'
      }
      this.toastMsg(obj, 'error', msg)
      return true
    }
    return false
  },
  dataTypeError(obj, duck, data, msg) {
    return this.catchError(obj, () => {
      let result = duck.errors(data)
      if (result != false) {
        console.error(result)
        throw new Error('数据类型不正确！')
      }
    }, msg)
  },
  reloadPage(obj) {
    let toParams = {
      name: obj.$route.name,
      params: obj.$route.params,
      query: obj.$route.query
    }
    router.replace({ name: 'reload', params: toParams })
  },
  parseFormula(value) { // 解析时间公式
    if (value) {
      let valueTrim = value.trim().replace(/\s/g, '') // 去空格
      let formulaArr = valueTrim.split('&')
      let result = moment(new Date())
      _(formulaArr).forEach((formula) => {
        let hasPlus = formula.indexOf('+') > -1
        let hasMinus = formula.indexOf('-') > -1
        let unit = ''
        if (formula.indexOf('Y') > -1) { // 年
          unit = 'years'
        } else if (formula.indexOf('M') > -1) { // 月
          unit = 'months'
        } else if (formula.indexOf('D') > -1) { // 日
          unit = 'days'
        } else if (formula.indexOf('h') > -1) { // 时
          unit = 'hours'
        } else if (formula.indexOf('m') > -1) { // 分
          unit = 'minutes'
        } else if (formula.indexOf('s') > -1) { // 秒
          unit = 'seconds'
        }
        if (unit) {
          let splitResult = ''
          let number = 0
          let times = 1
          if (hasPlus) {
            splitResult = formula.split('+')
            times = 1
          } else if (hasMinus) {
            splitResult = formula.split('-')
            times = -1
          }
          if (hasPlus || hasMinus) {
            _(splitResult).forEach((res) => { // 遍历切割的数组，把数字减掉
              if ((/^[0-9\.]+$/g).test(res)) {
                number += parseFloat(res) * times
              }
            })
          }
          result.add(number, unit)
        }
      })
      return new Date(result)
    } else {
      return ''
    }
  },
  /**
   * 更新头部信息
   *
   * @param {object} header
   * header = {
      token: {
        isDelete: false,
        value: this.form.token
      },
      debug: {
        isDelete: false,
        value: 1
      },
      projectid: {
        isDelete: true
      },
      envcode: {
        isDelete: true
      }
    }
   * @returns
   */
  updateHttpHeader(header) { // 更新http头部信息
    let headerObject = {}
    if (!_g.isRealEmpty(header)) {
      for (let proto in header) {
        if (header[proto].isDelete) {
          delete headerObject[proto]
        } else {
          headerObject[proto] = header[proto].value
        }
      }
    }
    return headerObject
  },
  isRealEmpty(value) { // 判断是否真的为空
    // value为以下值时返回true：undefined,null,'',空数组,空对象
    return value === '' ||
           _.isUndefined(value) ||
           _.isNull(value) ||
           ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value))
  },
  moveUpOrDown(arr, index, index2) { // 上移 下移 index < index2 下移 index > index2 上移
    let tempArr = arr
    // 第三个参数 向数组添加的新项目
    tempArr[index] = tempArr.splice(index2, 1, tempArr[index])[0]
    return tempArr
  },
  /**
   * [handleCompute 执行浮点数四则运算]
   * @param  {[Number]} a         [前置算数]
   * @param  {[Number]} b         [后置算数]
   * @param  {[String]} type      [运算类型（+、-、*、／）]
   * @return {[Number]} result    [运算结果]
   */
  handleCompute(a, b, type) {
    // js浮点数运算有bug，需转化成整形数运算再还原
    let result = 0
    let multiA = 1
    let multiB = 1
    if (!_g.isRealEmpty(a) && a.toString().indexOf('.') > -1) {
      let string = Math.abs(a).toString().replace(/\d+./, '')
      if (string) {
        multiA *= Math.pow(10, string.length)
      }
    }
    if (!_g.isRealEmpty(b) && b.toString().indexOf('.') > -1) {
      let string = Math.abs(b).toString().replace(/\d+./, '')
      if (string) {
        multiB *= Math.pow(10, string.length)
      }
    }
    let multi = Math.max(multiA, multiB)
    if (multiA == 1) {
      a *= multi
    } else {
      a = parseFloat(a.toString().replace('.', ''))
      a = a * multi / multiA
    }
    if (multiB == 1) {
      b *= multi
    } else {
      b = parseFloat(b.toString().replace('.', ''))
      b = b * multi / multiB
    }
    switch (type) {
      case '+':
        result = (a + b) / multi
        break
      case '-':
        result = (a - b) / multi
        break
      case '*':
        result = (a * b) / (multi * multi)
        break
      case '/':
        result = a / b
        break
    }
    return result
  },
  alertMsg(obj, type, msg, title, dangerouslyUseHTMLString) {
    title = title || '提示'
    dangerouslyUseHTMLString = dangerouslyUseHTMLString || false
    switch (type) {
      case 'normal':
        obj.$alert(msg, title)
        break
      case 'success':
        obj.$alert(msg, title, {
          type: 'success',
          dangerouslyUseHTMLString: dangerouslyUseHTMLString
        })
        break
      case 'warning':
        obj.$alert(msg, title, {
          type: 'warning',
          dangerouslyUseHTMLString: dangerouslyUseHTMLString
        })
        break
      case 'error':
        // 缩短提示时间
        obj.$alert(msg, title, {
          type: 'error',
          dangerouslyUseHTMLString: dangerouslyUseHTMLString
        })
        break
    }
  },
  confirmMsg(obj, type, msg, successCb, confirmText = '确定', cancelText = '取消', confirmClass = '', cancelClass = '') {
    obj.$confirm(msg, '提示', {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonClass: confirmClass,
      cancelButtonClass: cancelClass,
      type: type
    }).then(() => {
      if (successCb) {
        successCb()
      }
    })
  },
  parseToTimeStamp(value) { // 转化为时间戳（毫秒）
    let stamp = moment(value).unix()
    if (isNaN(stamp)) {
      stamp = ''
    } else {
      stamp *= 1000
    }
    return stamp
  },
  fixBase64(value) {  // 不知为何+号会变成空格，转码回来
    return value.replace(/\s/g, '+')
  },
  toastMsgForForm(obj) {
    this.alertMsg(obj, 'error', '请检查填入数据')
  },
  interceptionRouter(query) {
    let obj = {}
    if (query) {
      let arr = query.split('&')
      _(arr).forEach((res) => {
        obj[res.split('=')[0]] = res.split('=')[1]
      })
    }
    return obj
  },
  /**
   * [getOnlyKey 生成唯一字符串]
   * @param  {[String]} symbol [用来生产唯一字符串的头部]
   * @return {[String]}        [生成的随字符串]
   */
  getOnlyKey(symbol) {
    if (!symbol) {
      symbol = 'key'
    }
    return `${symbol}_${moment().unix()}_${parseInt(Math.random() * 1000) * parseInt(Math.random() * 1000)}`
  },
  changeMoneyToChinese(obj, money) {
    let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 汉字的数字
    let cnIntRadice = ['', '拾', '佰', '仟'] // 基本单位
    let cnIntUnits = ['', '万', '亿', '兆']// 对应整数部分扩展单位
    let cnDecUnits = ['角', '分', '毫', '厘'] // 对应小数部分单
    // let cnInteger = "整" // 整数金额时后面跟的字符
    let cnIntLast = '元' // 整型完以后的单位
    let maxNum = 999999999999999.9999 // 最大处理的数字
    let IntegerNum // 金额整数部分
    let DecimalNum // 金额小数部分
    let ChineseStr = '' // 输出的中文金额字符串
    let parts // 分离金额后用的数组，预定义
    let intLen
    if (money == '') {
      return ''
    }
    money = parseFloat(money)
    if (money >= maxNum) {
      this.toastMsg(obj, 'info', '超出最大处理数字')
      return ''
    }
    if (money == 0) {
      // ChineseStr = cnNums[0]+cnIntLast+cnInteger
      ChineseStr = cnNums[0] + cnIntLast
      // document.getElementById("show").value=ChineseStr
      return ChineseStr
    }
    money = money.toString() // 转换为字符串
    if (money.indexOf('.') == -1) {
      IntegerNum = money
      DecimalNum = ''
    } else {
      parts = money.split('.')
      IntegerNum = parts[0]
      DecimalNum = parts[1].substr(0,4)
    }
    if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
      let zeroCount = 0
      // let intLen = IntegerNum.length
      for (let i = 0; i < IntegerNum.length; i++) {
        let n = IntegerNum.substr(i,1)
        let p = IntegerNum.length - i - 1
        let q = p / 4
        let m = p % 4
        if (n == '0') {
          zeroCount++
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0]
          }
          zeroCount = 0 // 归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
        }
        if (m == 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q]
        }
      }
      ChineseStr += cnIntLast
      // 整型部分处理完毕
    }
    if (DecimalNum != '') { // 小数部分
      for (let i = 0; i < DecimalNum.length; i++) {
        let n = DecimalNum.substr(i, 1)
        if (n != '0') {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
        }
      }
    }
    if (ChineseStr == '') {
      // ChineseStr += cnNums[0]+cnIntLast+cnInteger
      ChineseStr += cnNums[0] + cnIntLast
    }
    /* else if( DecimalNum == '' ){
        ChineseStr += cnIntegerChineseStr += cnInteger
    } */
    return ChineseStr
  },
  /**
   * [handleTimeCompute 执行时间计算]
   * @param  {[Number]} a         [前置算数，格式：HH:mm]
   * @param  {[Number]} b         [后置算数，格式：HH:mm]
   * @param  {[String]} type      [运算类型（+、-）]
   * @param  {[String]} isFormat  [是否转化为间隔标准时间，若为true，则09:21+00:30=09:30, 09:31+00:30=10:00；若为false，则09:21+00:30=09:51
   * ]
   * @return {[Number]} result    [运算结果，格式HH:mm]
   */
  handleTimeCompute(a, b, type, isFormat) {
    let result = ''
    let regExp = /^\d{2}\:\d{2}$/
    if (regExp.test(a) && regExp.test(b)) {
      let aArr = a.split(':')
      let aHour = aArr[0]
      let aMin = aArr[1]
      let bArr = b.split(':')
      let bHour = bArr[0]
      let bMin = bArr[1]
      let aAllMin = parseFloat(aHour) * 60 + parseFloat(aMin)
      let bAllMin = parseFloat(bHour) * 60 + parseFloat(bMin)
      let sumMin = 0
      if (!isFormat) {
        switch (type) {
          case '+':
            sumMin = aAllMin + bAllMin
            break
          case '-':
            sumMin = aAllMin - bAllMin
            break
        }
      } else {
        let least = aAllMin % bAllMin
        switch (type) {
          case '+':
            sumMin = aAllMin + bAllMin - least
            break
          case '-':
            sumMin = aAllMin - least
            break
        }
      }
      if (sumMin >= 24 * 60) {  // 若超过了23:59，则重置为00:00
        sumMin = 0
      }
      let resultHour = parseInt(sumMin / 60)
      let resultMin = parseInt(sumMin % 60)
      if (resultHour < 10) {
        resultHour = '0' + resultHour
      }
      if (resultMin < 10) {
        resultMin = '0' + resultMin
      }
      result = `${resultHour}:${resultMin}`
    }
    return result
  },
  /**
   * [vaildTime 验证是否时间格式]
   * @param  {[String]} value [需要验证的值]
   * @param  {[String]} unit  [单位]
   * @return {[Boolean]}       [验证结果]
   */
  vaildTime(value, unit) {
    if (unit == 'm') {
      // 验证格式：00:00
      return (/^\d{2}\:\d{2}$/).test(value)
    } else if (unit == 's') {
      // 验证格式：00:00:00
      return (/^\d{2}\:\d{2}\:\d{2}$/).test(value)
    }
  },
  /**
   * [parseFormula 解析公式]
   * @param  {[String]} str [数学公式]
   * @return {[Array]}     [解析成后缀表达式的公式数组]
   */
  parseMathFormula(str) { // 解析数学公式
    str = str.replace(/\s/g, '').replace(/\"/g, '')
    var stack = new Stack.Stack()
    var outStack = []
    var cutIndex = 0
    for (var i = 0; i < str.length; ++i) {
      if (str[i] == ')') {
        let cut = str.substring(cutIndex, i)
        if (cut) {
          outStack[outStack.length] = cut
        }
        cutIndex = i + 1
        while (true) {
          var top = stack.peek()
          stack.pop()
          if (top != '(') {
            outStack[outStack.length] = top
          } else {
            break
          }
        }
      } else if (['-','+'].indexOf(str[i]) > -1) {
        let cut = str.substring(cutIndex, i)
        if (cut) {
          outStack[outStack.length] = cut
        }
        cutIndex = i + 1
        if (['*','/'].indexOf(stack.peek()) > -1) {
          while (['*','/'].indexOf(stack.peek()) > -1) {
            outStack[outStack.length] = stack.peek()
            stack.pop()
          }
          // outStack[outStack.length] = str[i]
        } else if (['+','-'].indexOf(stack.peek()) > -1) {
          while (['+','-'].indexOf(stack.peek()) > -1) {
            outStack[outStack.length] = stack.peek()
            stack.pop()
          }
        }
        stack.push(str[i])
      } else if (['(','*','/'].indexOf(str[i]) > -1) {
        let cut = str.substring(cutIndex, i)
        if (cut) {
          outStack[outStack.length] = cut
        }
        cutIndex = i + 1
        stack.push(str[i])
      }
      if (i == str.length - 1) {
        let cut = str.substring(cutIndex, str.length)
        if (cut) {
          outStack[outStack.length] = (cut)
        }
      }
    }
    while (stack.length()) {
      outStack[outStack.length] = stack.pop()
    }
    return outStack
  },
  /**
   * [contrastArrayObj 两个数组对象的交并集]
   * @param  Array[object] arrObjOne    [第一个数组对象]
   * @param  Array[object] arrObjTwo    [第二个数组对象]
   * @param  [String] params    [对象中对比的key]
   * @param  [Boolean]isSame  [决定取交集还是并集,true为交集,false为并集]
   */
  contrastArrayObj(arrObjOne, arrObjTwo, params, isSame) {
    let oneParamArr = []
    let twoParamArr = []
    let result = []
    _(arrObjOne).forEach((obj) => {
      _(obj).forEach((val, key) => {
        if (key == params) {
          oneParamArr.push(val)
        }
      })
    })
    _(arrObjTwo).forEach((obj) => {
      _(obj).forEach((val, key) => {
        if (key == params) {
          twoParamArr.push(val)
        }
      })
    })
    if (isSame) {
      // 交集
      let arr = []
      _(oneParamArr).forEach((res) => {
        if (_.indexOf(twoParamArr, res) > -1) {
          arr.push(res)
        }
      })
      _(arrObjOne).forEach((obj) => {
        _(obj).forEach((val, key) => {
          if (key == params) {
            if (_.indexOf(arr, val) > -1) {
              result.push(obj)
            }
          }
        })
      })
    } else {
      // 并集
      let arr1 = []
      let arr2 = []
      let diffArr = []
      arr1 = _.difference(oneParamArr, twoParamArr)
      arr2 = _.difference(twoParamArr, oneParamArr)
      diffArr = arr1.concat(arr2)
      _(arrObjOne).forEach((obj) => {
        _(obj).forEach((val, key) => {
          if (key == params) {
            if (_.indexOf(diffArr, val) > -1) {
              result.push(obj)
            }
          }
        })
      })
      _(arrObjTwo).forEach((obj) => {
        _(obj).forEach((val, key) => {
          if (key == params) {
            if (_.indexOf(diffArr, val) > -1) {
              result.push(obj)
            }
          }
        })
      })
    }
    return result
  },
  /**
   * 校验控件中文标点符号
   *  。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
   *  [\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]
   * @return {[type]} [description]
   */
  vaildChinesePunctuationFormat(value) {
    let req = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
    if (req.test(value)) {
      return true
    }
    return false
  }
}
export default commonFn
