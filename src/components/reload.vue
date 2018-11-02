<template>
  <div></div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    created() {
      if (this.$route.params.name) {
        let to = {
          name: this.$route.params.name,
          params: this.$route.params.params,
          query: this.$route.params.query
        }
        this.$router.replace(to)
      }
    }
  }
</script>