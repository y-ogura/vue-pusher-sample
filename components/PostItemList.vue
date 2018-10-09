<template>
  <div class="post">
    <el-card>
      <el-row>
        <h3>{{ post.content }}</h3>
        <p>{{ post.createdAt }}</p>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {
      post: {
        type: Object,
        default: () => {return {}}
      }
    }
  }
</script>

<style scoped>
.post {
  min-width: 500px;
}
</style>