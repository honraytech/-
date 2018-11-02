<template>
  <div>
    <span>{{data}}</span>
    <el-button @click="callback">触发回调</el-button>
    <el-button @click="openDialog">开弹窗</el-button>
  </div>
</template>

<style>
</style>

<script>
  export default {
    props: ['data'],
    data() {
      return {
        key: ''
      }
    },
    mounted() {
      let component = require('./test.vue')
      this.key = _g.addDialog(component, {}, { callback: this.callback })
    },
    destroyed() {
      store.dispatch('removeDialog', this.key)
      alert('弹窗已经删除')
    },
    methods: {
      callback() {
        console.log(123)
        this.$emit('callback')
      },
      openDialog() {
        store.dispatch('openDialog', this.key)
      }
    },
    computed: {
      dialogList() {
        return store.state.dialogModule.dialogList
      }
    }
  }
</script>