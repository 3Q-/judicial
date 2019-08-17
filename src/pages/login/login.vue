<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <img height="80" width="70" src="./logo.png" alt="统一客户端">
        <div style="color:#7f97ff"> 统一客户端 </div>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input name="username" size="small" type="text" v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-phone" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" size="small" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" placeholder="密码"  prefix-icon="el-icon-goods"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="code" size="small" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.code" placeholder="验证码"  prefix-icon="el-icon-goods" >
            <template slot="append">
              <div>
                <img :src="codeUrl" height="34" alt="验证码" @click="freshVcode">
              </div>
            </template>
          </el-input>
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
import { setToken } from 'common/js/token';
import {login} from 'api/api';
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
    const validateCode = (rule, value, callback) => {
      if (!isvalidUsername(value)){
        callback(new Error('请输入正确验证码'));
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
        username: 'monitor',
        password: 'monitor',
        code: '',
        randomStr: +new Date()
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    };
  },
  computed: {
    codeUrl(){
      return '/code?randomStr=' + this.loginForm.randomStr;
    }
  },
  methods: {
    freshVcode(){
      this.loginForm.randomStr = +new Date();
    },
    handleLogin(){
      var me = this;
      me.$refs.loginForm.validate(valid => {
        if (valid){
          me.loading = true;
          const params = {
            username: me.loginForm.username,
            password: me.loginForm.password,
            randomStr: me.loginForm.randomStr,
            code: me.loginForm.code,
            grant_type: 'password',
            scope: 'server'
          };
          login(params)
            .then(res => {
              setToken(res.access_token);
              me.$router.push('./news');
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              me.loading = false;
            });
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
<style lang="stylus">
.login-wrap
  position: relative;
  width:100%;
  height:100%;
  background: url(./bg.png) no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  .ms-title
    padding-top: 40px;
    margin-bottom: 15px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    line-height: 1.2;
  .ms-login
    position: absolute;
    left: 50%;
    top: 50%;
    width: 320px;
    height: 440px;
    margin-top: -220px;
    margin-left: 160px;
    background: linear-gradient(top, #1b3aaf, #102082);
    border-radius: 5px;
    .login-btn
      text-align: center;
    .el-form
      margin: auto;
      width: 240px;
      .el-input__inner
        background-color:#152c97;
        border: 1px solid #3a4ca4;
        color: #dce0e6
      .el-input-group__append
        padding: 0;
        >div
          height: 30px;
          width: 78px;
          overflow: hidden;
          position: relative;
          border-radius: 0 4px 4px 0;
          >img
            position: absolute;
            top: -1px;
            left: -5px;
    .login-btn button
      width:100%;
      height:36px;
</style>
