<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
         <div><img src="./yun.png" alt=""></div>
        <h2> 国家统一法律职业资格考试<br>考务安全云平台 </h2>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" prefix-icon="el-icon-phone" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"  placeholder="密码"  prefix-icon="el-icon-goods"/>
        </el-form-item>
        <div class="login-btn">
           <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          <!-- <el-button type="primary" @click="submitForm('loginForm')">登录</el-button> -->
        </div>
      </el-form>
    </div>
    <div class="face"><img src="./center1.png" width="100%"></div>
  </div>
</template>
<script>
import { isvalidUsername } from 'common/js/validate';
import base64 from 'common/js/base64';
import {validate} from 'api/api';
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
          const data = {};
          data.loginId = base64.encoder(me.loginForm.username);
          data.passwd = base64.encoder(me.loginForm.password);
          validate(data).then((res) => {
            console.log(res);
            me.loading = false;
          }).catch(() => {
            me.loading = false;
          });
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
  background: url(./bg.png) no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  .ms-title{
    margin-bottom: 30px;
    text-align: center;
    font-size:30px;
    color: #fff;
    line-height: 1.2;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:450px;
    margin-top: -195px;
    margin-left: 60px;
    .login-btn{
      text-align: center;
    }
    .login-btn button{
      width:100%;
      height:36px;
    }
  }
  .face{
    position: absolute;
    top:50%;
    right: 50%;
    height: 450px;
    width:450px;
    margin-right: 60px;
    margin-top: -195px;
  }
}
</style>
