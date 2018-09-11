<template>
  <div class="login-wrap">
    <div class="ms-title">西北政法大学创新创业学分管理系统</div>
    <div class="ms-login">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
        </el-form-item>
        <div class="login-btn">
           <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          <!-- <el-button type="primary" @click="submitForm('loginForm')">登录</el-button> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

import { isvalidUsername } from 'common/js/validate';
// import store from 'store/index';
export default {
  components: { },
  name: 'login',
  data(){
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)){
        callback(new Error('请输入正确用户名'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6){
        callback(new Error('密码不能少于6位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    };
  },
  methods: {
    handleLogin(){
      var me = this;
      me.$refs.loginForm.validate(valid => {
        if (valid){
          me.loading = true;
          // store.dispatch('user.loginByUsername', me.loginForm).then(() => {
          //   me.loading = false;
          //   me.$router.push({ path: '/info' });
          // }).catch(() => {
          //   me.loading = false;
          // });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan(){
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created(){
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed(){
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style scoped lang="stylus">
.login-wrap{
  position: relative;
  width:100%;
  height:100%;
  background: #324157;
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
    .login-btn{
      text-align: center;
    }
    .login-btn button{
      width:100%;
      height:36px;
    }
  }
}
</style>
