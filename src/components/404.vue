<template>
    <el-row class="no-found" type="flex" align="middle" style="flex-direction: column;">
        <img width="300" height="310" src="../assets/images/404.png" />
        <div class="msg-wrap m-t-20">访问出错！</div>
    </el-row>
</template>
<style scoped>
	.no-found {
		position: fixed;
		top: 0; bottom: 0;
		left: 0;right: 0;
		padding-top: 100px;
		background-color: #ffffff;
	}
	.msg-wrap {
		font-size: 20px;
		color: #666666;
	}
</style>