<template>
  <section class="container">
    <el-row class="form">
      <el-form
        ref="postForm"
        :rules="rules"
        :model="postForm"
      >
        <el-form-item prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            class="input-content"
          />
        </el-form-item>
      </el-form>
      <el-button @click="submit">送信</el-button>
    </el-row>
    <el-row class="post">
      <PostItemList
        v-for="post in postList"
        :key="post.id"
        :post="post"
      />
    </el-row>
  </section>
</template>

<script>
import PostItemList from '~/components/PostItemList.vue'
import Pusher from 'pusher-js'

export default {
  components: {
    PostItemList
  },
  data () {
    const requireValid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('content is required'))
      }
      callback()
    }
    return {
      posts: [],
      postForm: {
        content: ''
      },
      rules: {
        content: [
          {validator: requireValid, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    postList () {
      return this.posts
    }
  },
  async created() {
    const res = await this.$axios.get('/api/posts')
    this.posts = res.data
    this.fetchPost()
  },
  methods: {
    async fetchPost () {
      const pusher = new Pusher('5cb0a26beb27693d86e5', {cluster: 'ap1'})
      pusher.subscribe('posts')
      await pusher.bind('post_added', async data => {
        const res = await this.$axios.get('/api/posts')
        this.posts = res.data
      })
    },
    async submit () {
      await this.$refs.postForm.validate((valid) => {
        if (valid) {
          const body = this.postForm
          const res = this.$axios.post('/api/posts', JSON.stringify(body), this.$store.state.headers)
          // this.fetchPost()
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 900px;
}
.form {
  /* width: 100vh; */
  min-width: 500px;
  margin: 60px auto;
}
.input-content {
  width: 500px;
}
.post {
  margin: 0 auto;
}
</style>
