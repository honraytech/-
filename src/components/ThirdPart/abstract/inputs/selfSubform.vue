<template>
  <div>
    <el-form-item label="子表中使用的字段">
      <el-button type="primary" size="small">添加</el-button>
      <el-table :data="childValue">
        <el-table-column label="选择字段"></el-table-column>
        <el-table-column label="默认值"></el-table-column>
        <el-table-column label="权限"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
export default {

  name: 'selfDemo',
  props: {
    name: {  // 当前字段名
      default() {
        return ''
      }
    },
    title: {  // 字段名称
      default() {
        return ''
      }
    },
    value: {  // 通过v-model绑定的值
      default() {
        return ''
      }
    },
    rule: {  // 验证规则
      default() {
        return {}
      }
    },
    disabled: { // 是否只读
      default() {
        return false
      }
    },
    config: { // 当前控件的配置数据
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      childValue: []
    }
  },
  watch: {
    'childValue'() {
      this.change(this.childValue)
    },
    'value'() {
      this.initValue()
    }
  },
  methods: {
    /**
     * [initValue 处理ChildValue和value的关系]
     */
    initValue() {
      if (this.value != this.childValue) {
        this.childValue = this.value
      } else if (_g.isRealEmpty(this.value)) {
        this.childValue = []
      }
      console.log(this.config)
    },
    change(value) {
      this.$emit('input', value)
    }
  },
  created() {
    this.initValue()
  }
}
</script>

<style lang="css" scoped>

</style>