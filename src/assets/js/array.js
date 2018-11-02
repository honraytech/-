function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj))
}

Array.prototype.cutData = []

/**
 * [cut 对象剪切]
 * @param  {[Number]} cutIndex   [要剪切的值在数组中的]
 * @param  {[Boolean]} setFlag    [是否设置isCut标志]
 * @param  {[Object]} addItem    [需要追加或修改的属性和值]
 * @param  {[Array]} deleteAttr [需要删除的属性]
 */
Array.prototype.cut = function(cutIndex, addItem, deleteAttr) {
  let self = cloneDeep(this)
  let cutItem = this[cutIndex]
  let newTableObj = cloneDeep(cutItem)
  newTableObj.cutIndex = cutIndex
  self[cutIndex].isCut = true
  if (addItem && addItem instanceof Object) {
    self[cutIndex] = Object.assign({}, cutItem, addItem)
  }
  if (deleteAttr && deleteAttr instanceof Array) {
    for (let i = 0; i < deleteAttr.length; i++) {
      delete self[cutIndex][deleteAttr[i]]
    }
  }
  self.cutData.push(newTableObj)
  return self
}

/**
 * [cancelCut 取消剪切对象]
 * @param  {[Number]} cancelIndex   [要取消剪切的index]
 */
Array.prototype.cancelCut = function(cancelIndex) {
  if (this[cancelIndex] && this[cancelIndex] instanceof Object) {
    this[cancelIndex].isCut = false
    delete this[cancelIndex].isCut
  }
  let removeIndex = -1
  for (let i = 0; i < this.cutData.length; i++) {
    if (this.cutData[i].cutIndex == cancelIndex) {
      removeIndex = i
      break
    }
  }
  if (removeIndex != -1) {
    this.cutData.splice(removeIndex, 1)
  }
}

/**
 * [paste 对象粘贴]
 * @param  {[Number]} pasteIndex   [要在此处粘贴的对象的index]
 * @param  {[Boolean]} isInsert   [当可粘贴的数据为空时是否插入新数据isInsert]
 * @param  {[Object]} model   [新数据的模型]
 */
Array.prototype.paste = function(pasteIndex, isInsert, model) {
  if (this.cutData) {
    if (this.cutData.length == 0) {
      let newObj = cloneDeep(model)
      this.cutData = [newObj]
    } else {
      this.cutData.sort((a, b) => {
        return a.cutIndex > b.cutIndex
      })
    }
    let insertData = cloneDeep(this.cutData)
    for (let i = 0; i < insertData.length; i++) {
      delete insertData[i].cutIndex
    }
    this.splice(pasteIndex + 1, 0, ...insertData)
    let deleteIndex = -1
    while (true) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].isCut) {
          deleteIndex = i
          break
        }
      }
      if (deleteIndex != -1) {
        this.splice(deleteIndex, 1)
        deleteIndex = -1
      } else {
        break
      }
    }
    this.cutData.length = 0
  }
}

/**
 * [sortUp 上移]
 * @param  {[Number]} index   [需要上移的值index]
 */
Array.prototype.sortUp = function(index) {
  if (index > 0) {
    let temp = this[index]
    this.splice(index, 1)
    this.splice(index - 1, 0, temp)
  }
}

/**
 * [sortDown 下移]
 * @param  {[Number]} index   [需要下移的值index]
 */
Array.prototype.sortDown = function(index) {
  if (index < this.length - 1) {
    let temp = this[index]
    this.splice(index, 1)
    this.splice(index + 1, 0, temp)
  }
}

/**
 * [quickCopy 快速复制]
 * @param  {[Number]} index   [需要快速复制的值index]
 */
Array.prototype.quickCopy = function(index) {
  let temp = ''
  if (this[index] && this[index] instanceof Object) {
    temp = cloneDeep(this[index])
  } else {
    temp = this[index]
  }
  this.splice(index, 0, temp)
}
