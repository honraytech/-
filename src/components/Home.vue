<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="配置开发" name="first">
       <div class="m-l-20 m-r-20 m-t-10">
         配置开发
        <el-form>
          <!-- 配置的组件写在这里 -->
        </el-form>
       </div>
     </el-tab-pane>
     <el-tab-pane label="表单控件实例化开发" name="second">
       <div class="m-l-20 m-r-20 m-t-10">
         表单控件实例化开发
         <el-form ref="instanceForm" :model="form" :rules="rule">
          <!-- 实例化的组件写在这里 -->
          <!-- 
          <self-component
            v-model="form[name]"
            :rule="rule[name]"
            :name="name"
            :title="title"
            :fieldId="fieldId"
            :dataId="dataId"
            :config="inputConfig">
          </self-component>
          -->
          <div class="m-t-10">
            <div>
              <el-button type="primary" size="small" @click="post">提交</el-button>
            </div>
          </div>
         </el-form>
       </div>
     </el-tab-pane>
     <el-tab-pane label="页面组件实例化开发" name="third">
      <div class="m-l-20 m-r-20 m-t-10">
        页面组件实例化开发
        <!-- 
        <self-component
          :dealId="dealId"
          @getDealConfig="getDealConfig"
          @questSelfMethod="questSelfMethod"
        </self-component>
        -->
      </div>
     </el-tab-pane>
   </el-tabs>
  </div>
</template>
<script>
  import 'assets/iconfont/iconfont.css'
  import http from 'assets/js/http'

  export default {
    data() {
      return {
        activeName: 'first',
        // 表单控件相关参数
        inputConfig: {},                // 控件配置数据（自行导入模拟数据）
        name: '',                       // 控件名（自行导入模拟数据）
        title: '',                      // 控件标题（自行导入模拟数据）
        fieldId: '',                    // 控件id（自行导入模拟数据）
        rule: {},                      // 验证规则
        form: {},                       // 表单数据
        // 表单控件相关参数
        // 页面组件相关参数
        dealId: ''                      // 页面组件id（自行导入数据）
        // 页面组件相关参数
      }
    },
    computed: {
    },
    async created() {
      if (this.$route.query.tabName) {
        this.activeName = this.$route.query.tabName
      }
      // 获取调试配置数据
      // this.getMockInputConfig(...)
      // 获取调试表单数据
      // this.getMockFormData(...)
    },
    methods: {
      /**
       * tab切换的方法
       * @param  {[Object]} tab [当前tab对象]
       */
      handleClick(tab) {
        this.activeName = tab.name
        router.push({
          path: this.$route.path,
          query: {
            tabName: this.activeName
          }
        })
      },
      /**
       * [post 提交数据]
       */
      post() {
        this.$refs.instanceForm.validate((pass) => {
          if (pass) {
            // this.postMockFormData(...)
          }
        })
      },
      /**
       * [getMockInputConfig 获取模拟调试的表单控件配置数据]
       * @param  {[String]} className [类名（后端提供）]
       * @param  {[String]} funcName  [方法名（后端提供）]
       * @param  {[String]} fieldId   [当前控件id]
       */
      async getMockInputConfig(className, funcName, fieldId) {
        let postData = {
          className: className,
          funcName: funcName,
          field_id: fieldId,
          type: 3
        }
        let res = await this.apiPost('admin/test/index', postData)
        if (res.code == 200) {
          this.config = res.data
        } else {
          _g.toastMsg(this, 'error', res.error)
        }
      },
      /**
       * [getMockFormData 获取模拟调试的表单数据]
       * @param  {[String]} className [类名（后端提供）]
       * @param  {[String]} funcName  [方法名（后端提供）]
       * @param  {[String]} fieldId   [当前控件id]
       */
      async getMockFormData(className, funcName, fieldId) {
        let postData = {
          formData: {   // id任意填写即可
            id: '1'
          },
          className: className,
          funcName: funcName,
          field_id: fieldId,
          type: 2
        }
        let res = await this.apiPost('admin/test/index', postData)
        if (res.code == 200) {
          this.$set(this.form, this.name, res.data)
        } else {
          _g.toastMsg(this, 'error', res.error)
          // 初始化表单数据
          // this.$set(this.form, this.name, '')
        }
      },
      /**
       * [postMockFormData 模拟提交数据]
       * @param  {[String]} className [类名（后端提供）]
       * @param  {[String]} funcName  [方法名（后端提供）]
       * @param  {[String]} fieldId   [当前控件id]
       * @param  {[Object]} formData  [表单值]
       */
      async postMockFormData(className, funcName, fieldId, formData) {
        let postData = {
          type: 1,
          className: className,
          funcName: funcName,
          field_id: fieldId,
          formData: formData
        }
        let res = await this.apiPost('admin/test/index', postData)
        if (res.code == 200) {
          _g.toastMsg(this, 'success', '提交成功')
        } else {
          _g.toastMsg(this, 'error', res.error)
        }
      },
      /**
       * [getMockDealConfig 获取模拟调试的页面组件配置数据]
       * @param  {[String]} className [类名（后端提供）]
       * @param  {[String]} funcName  [方法名（后端提供）]
       */
      async getMockDealConfig(className, funcName) {
        let postData = {
          className: className,
          functionName: funcName,
          deal_id: this.dealId
        }
        let res = await this.apiPost('admin/deal/index', postData)
        if (res.code != 200) {
          _g.toastMsg(this, 'error', res.error)
        }
        return res
      },
      /**
       * [questMockSelfMethod 请求接口调用指定方法]
       * @param  {[String]} className [类名（由开发者提供）]
       * @param  {[String]} funcName  [方法名名（由开发者提供）]
       * @param  {[-]} freeData       [开发者要提交的数据]
       */
      async questMockSelfMethod(className, funcName, freeData) {
        let postData = {
          freeData: freeData,
          className: className,
          functionName: funcName,
          deal_id: this.dealId
        }
        let res = await this.apiPost('admin/deal/index', postData)
        if (res.code != 200) {
          _g.toastMsg(this, 'error', res.error)
        }
        return res
      },
      /**
       * [getDealConfig 处理获取页面组件配置数据事件的回调]
       * @param  {[String]} className [类名（开发者传参）]
       * @param  {[String]} funcName  [方法名（开发者传参）]
       * @param  {[Function]} callback  [回调函数）]
       */
      async getDealConfig({ className, funcName, callback }) {
        let res = await this.getMockDealConfig(className, funcName)
        if (callback) {
          callback(res)
        }
      },
      /**
       * [questSelfMethod 处理请求接口调用指定方法事件的回调]
       * @param  {[String]} className [类名（开发者传参）]
       * @param  {[String]} funcName  [方法名（开发者传参）]
       * @param  {[Object]} freeData  [自定义参数]
       * @param  {[Function]} callback  [回调函数）]
       */
      async questSelfMethod({ className, funcName, freeData, callback }) {
        let res = await this.questMockSelfMethod(className, funcName, freeData)
        if (callback) {
          callback(res)
        }
      }
    },
    components: {
    },
    mixins: [http]
  }
</script>
<style scoped>
</style>