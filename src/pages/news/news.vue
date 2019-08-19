<template>
  <el-container class="video-wrapper">
    <el-header height="34px">
      <img height="21"  src="../login/logo.png" alt="统一客户端">
      <span>统一客户端</span>
      <span class="tab"><i class="el-icon-video-camera"></i>视屏预览</span>
      <span @click="logout" class="logout"> <i class="iconfont iconsignout"></i> 退出</span>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <div class="aside-wrapper">
            <div class="aside-header">
              <el-input
                size="mini"
                placeholder="搜索"
                prefix-icon="el-icon-search"
                clearable
                v-model="filterText">
              </el-input>
            </div>
            <div class="aside-tree-wrapper">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                node-key="id"
                default-expand-all
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @check-change="checkChange"
                >
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span v-if="data.level==0"><i class="icon el-icon-office-building"></i>  {{ node.label }}</span>
                    <span v-else-if="data.level==1"><i class="icon el-icon-school"></i> {{ node.label }}</span>
                    <span class="draggable-tag" v-else draggable="true" :id="data.id"><i class="icon iconfont iconshexiangtou1"></i>{{ node.label }}</span>
                  </span>
              </el-tree>
            </div>
        </div>
      </el-aside>
      <el-main class="main" >
        <el-row class="main-top">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="showSingle" style="position: relative;top: -7px;padding:6px 8px"></el-button>
            <el-button type="text" size="medium" icon="el-icon-menu" @click="showMore"></el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="text" icon="el-icon-video-play" @click="start" v-if="showStart">开始</el-button>
            <el-button type="text" icon="el-icon-video-pause" @click="stop" v-else>停止</el-button>
            <el-button type="text" icon="el-icon-circle-close" @click="clear">清空</el-button>
          </el-col>
        </el-row>

        <div class="video-list-wrapp">
          <div class="single-wrapper" id="single-wrapper" v-if="showStateCount ==1">
            <div class="nodata" v-if="!currentPageList[0]" to-elem="0">
              <div class="empty-text">
                <i class="iconfont iconshexiangtou1"></i>
                <p>未添加节目源</p>
              </div>
            </div>
            <div v-else style="width: 100%;height: 100%;">
              <video :src="currentPageList[0].hdAddress" id="myPlayer1" controls playsInline webkit-playsinline autoplay style="width: 100%;height: 100%;" to-elem="0">
                  <source :src="currentPageList[0].hdAddress" type="application/x-mpegURL" />
              </video>
            </div>
          </div>
          <div class="more-wrapper" v-else>
            <div :id="listId(i)" :key="i" class="list" v-for="i in 4">
              <div class="nodata" v-if="!currentPageList[i-1]" :to-elem="i-1">
                <div class="empty-text">
                  <i class="iconfont iconshexiangtou1"></i>
                  <p>未添加节目源</p>
                </div>
              </div>
              <div v-else style="width: 100%;height: 100%;">
                <video :src="currentPageList[i-1].hdAddress" :id="myPlayerId(i)" controls playsInline webkit-playsinline autoplay style="width: 100%;height: 100%;" :to-elem="i-1">
                  <source :src="currentPageList[i-1].hdAddress" type="application/x-mpegURL" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapGetters} from 'vuex';
// import Cookies from 'js-cookie';
import TreeExamnode from 'base/tree-examnode/tree-examnode';
import {removeToken} from 'common/js/token';
// import {formatDate} from 'common/js/date';
import {getysCameraList} from 'api/api';
import EZUIKit from 'EZUIKit';
// const PAGINATION_SIZE = 'PAGINATION_SIZE';

export default {
  components: {TreeExamnode},
  data(){
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showStart: true,
      treeData: [],
      showStateCount: 1,
      currentList: [],
      currentPageList: [],
      currentPageIndex: 0,
      totalPage: 0,
      allList: [],
      timer: 0
    };
  },
  computed: {
    ...mapGetters([
      'area',
      'nodeId',
      'administrativeId'
    ]),
    videoW(){
      return this.screenWidth / 3 - 20;
    },
    videoH(){
      return this.videoW / 1.765;
    },
    list(){
      const me = this;
      return me.videoList;
    }

  },
  created(){
    const me = this;
    getysCameraList().then(res => {
      const {data} = res;
      if (data && data.length){
        me.allList = data;
        me.serializeTreeData(data.slice());
        me.bindMoveItem();
      } else {

      }
    });

    // setInterval(() => {
    //   this.time = new Date();
    // }, 1000);
    // const SIZE = Cookies.get(PAGINATION_SIZE);
    // if (SIZE){
    //   this.pagination.size = +SIZE;
    // }
    // if (this.$route.query.hd === 'true'){
    //   this.hd = true;
    // } else {
    //   this.hd = false;
    // }
    // this.getLiveVideoList();
  },
  mounted(){
    // const that = this;
    // window.onresize = () => {
    //   return (() => {
    //     window.screenWidth = document.body.clientWidth;
    //     that.screenWidth = window.screenWidth;
    //   })();
    // };
    //

  },

  methods: {

    bindMoveItem(){
      this.$nextTick(() => {
        var moveItem = document.getElementsByClassName('draggable-tag');
        for (let i = 0; i < moveItem.length; i++){
          // 动态设置label元素id
          // moveItem[i].setAttribute('id', 'label' + i);
          moveItem[i].ondragstart = function(ev){
            // dataTransfer.setData() 方法设置被拖数据的数据类型和值
            ev.dataTransfer.setData('id', this.id);
          };
        }
        this.bindDrop();
      });
    },

    bindDrop(){
      const me = this;
      document.getElementById('single-wrapper').ondragover = function(ev){
        ev.preventDefault(); // 阻止向上冒泡
      };
      document.getElementById('single-wrapper').ondragenter = function(ev){
        ev.target.classList.add('over');
      };
      document.getElementById('single-wrapper').ondragleave = function(ev){
        ev.target.classList.remove('over');
      };
      document.getElementById('single-wrapper').ondrop = function(ev){
        ev.preventDefault();
        ev.target.classList.remove('over');
        var id = ev.dataTransfer.getData('id');
        var toElem = ev.toElement.getAttribute('to-elem'); // 放置位置
        me.currentPageList[toElem] = me.allList.find(item => item.id === id);
        me.$set(me.currentPageList, toElem, me.currentPageList[toElem]);
        me.$nextTick(() => {
          var id = 'myPlayer' + (+toElem + 1);
          var domId = document.getElementById(id);
          if (domId){
            me.showStart = true;
            domId.src = me.currentPageList[toElem].hdAddress;
            var p = new EZUIKit.EZUIPlayer(id);
            p.play();
          }
        });
      };
    },

    listId(i){
      return 'list' + i;
    },
    myPlayerId(i){
      return 'myPlayer' + i;
    },
    serializeExamNode(ary = []){
      var map = {};
      ary.forEach(function(item){
        var obj = {
          id: item.id,
          label: item.channelName,
          level: 2,
          pid: item.nodeId
        };
        if (!map[item.nodeId]){
          map[item.nodeId] = {
            id: item.nodeId,
            label: item.nodeName,
            pid: item.administrativeId,
            children: [obj],
            level: 1
          };
        } else {
          map[item.nodeId]['children'].push(obj);
        }
      });
      let arr = Object.keys(map).map((k) => {
        return map[k];
      });
      return arr;
    },
    serializeTreeData(ary = []){
      const me = this;
      var map = {};
      ary.forEach(function(item){
        if (!map[item.provinceId]){
          map[item.provinceId] = {
            id: item.provinceId,
            label: item.provinceName,
            pid: '',
            children: [item],
            level: 0
          };
        } else {
          map[item.provinceId]['children'].push(item);
        }
      });
      let arr = Object.keys(map).map((k) => {
        map[k]['children'] = me.serializeExamNode(map[k]['children']);
        return map[k];
      });
      console.log(arr);
      me.treeData = arr;
      return arr;
    },
    filterNode(value, data){
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showSingle(){
      this.showStateCount = 1;
      this.clear();
    },
    showMore(){
      this.showStateCount = 4;
      this.clear();
    },
    logout(){
      console.log('good');
      removeToken();
      this.$router.push('/login');
    },
    stop(){
      this.showStart = true;
      clearTimeout(this.timer);
    },
    clear(){
      this.currentPageList = [];
      this.currentPageIndex = 0;
      this.stop();
    },
    start(){
      var len = this.currentList.length;
      if (len < 1) return this.$message.error('请先选择节目源');
      this.totalPage = Math.ceil(len / this.showStateCount);
      this.currentPageList = this.currentList.filter((item, index) => this.currentPageIndex * this.showStateCount <= index && index < (this.currentPageIndex + 1) * this.showStateCount);
      this.$nextTick(() => {
        this.showStart = false;
        for (let i = 1; i <= 4; i++){
          var id = 'myPlayer' + i;
          var domId = document.getElementById(id);
          if (domId){
            domId.src = this.currentPageList[i - 1].hdAddress;
            var p = new EZUIKit.EZUIPlayer(id);
            p.play();
          }
        }
        this.timer = setTimeout(() => {
          if (this.totalPage === 1){
            return;
          } else if (this.totalPage === this.currentPageIndex + 1 && this.totalPage > 1){
            this.currentPageIndex = 0;
          } else {
            this.currentPageIndex++;
          }
          this.start();
        }, 30 * 1000);
      });
    },
    checkChange(data, isChecked){
    // 获取播放列表
      if (data.level !== 2) return;
      var obj = this.allList.find(item => item.id === data.id);
      if (isChecked){
        var flag = this.currentList.find(item => obj.id === item.id);
        if (!flag){
          this.currentList.push(obj);
        }
      } else {
        var index = this.currentList.findIndex(item => obj.id === item.id);
        if (index > -1){
          this.currentList.splice(index, 1);
        }
      }
    }
  },
  filters: {
    formatDate(time){
      // let date = new Date(time);
      // return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    }
  },
  watch: {
    filterText(val){
      this.$refs.tree.filter(val);
    }
    // nodeId(){
    //   this.getLiveVideoList();
    // }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  body>.video-wrapper.el-container
    height: 100%;
    >.el-container
      border: 1px solid #a8aeb6;
      border-bottom: 0 none;
      background-color: #f8f8fa;
    >.el-header
      position: relative;
      background-color: #1478f2;
      color: #9bc5fa;
      text-align: left;
      line-height: 34px;
      height: 34px;
      font-size: 14px;
      img
        position: relative;
        top: -2px;
        margin-left: 12px;
        margin-right: 12px;
        vertical-align: middle
      .tab
        position: relative;
        top: 2px;
        display: inline-block;
        width: 100px;
        height: 32px;
        margin-left: 45px;
        text-align: center;
        font-size: 12px;
        color: #d0e8ff;
        border-radius: 3px 3px 0 0;
        border-bottom: 3px solid #84c5ff
        background: #3d9aff;
        box-sizing: border-box;
      .logout
        position: absolute;
        right: 20px;
        top: 0;
        z-index: 9;
        cursor: pointer;
    .el-aside
      display: flex;
      flex-direction: column;
      padding: 2px 0 0 2px;
      border-radius: 3px;
      background-color: #ffffff;
      color: #333;
      text-align: center;
      box-sizing: border-box;
      .aside-wrapper
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        border: 1px solid #eceef2;
        box-sizing: border-box;
        .aside-header
          flex: 0 0 43px;
          padding: 7px 33px 7px 20px;
          border-bottom: 1px solid #eceef2;
          box-sizing: border-box;
        .aside-tree-wrapper
          flex: 1;
          height: 0;
          overflow-y: auto;
      .el-tree
        .custom-tree-node
          font-size: 14px;
          color: #131d27;
          .icon
            font-size: 16px;
            padding-left: 3px;
            color: #ccc
        .el-tree-node__expand-icon
          color: #4d4d4d
        .el-checkbox__inner
          border: 1px solid #666;
          border-radius: 1px
    .el-main.main
      display: flex;
      flex-direction: column;
      padding: 0;
      background-color: #f8f8fa;
      color: #333;
      .main-top
        flex 0 0 43px;
        height: 43px;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 43px;
        .button
          cursor: pointer;
        .el-button--medium
          font-size: 14px;
          i
            font-size: 18px;
      .video-list-wrapp
        flex: 1
        position: relative;
        video
          background: #000;
          border: 0 none !important;
          border-radius: 10px;
          &.over
            border: 1px dashed red !important;
            box-sizing: border-box;
        .nodata
          position: relative;
          border-radius: 10px;
          background: #fff;
          font-size: 20px;
          color: #9ba2b4;
          border:1px solid #ebedf2;
          text-align: center;
          box-sizing: border-box;
          &.over
            border: 1px dashed red;
            box-sizing: border-box;
          .empty-text
            position: absolute;
            left:50%;
            top: 50%;
            margin-left: -72px;
            margin-top: -52px;
          .iconfont
            display: inline-block;
            margin-bottom: 20px;
            font-size: 60px;
        .single-wrapper
          position: absolute;
          left:0;
          top: 0;
          right: 0;
          bottom: 0;
          padding: 3px;
          box-sizing: border-box;
          .nodata
            width: 100%;
            height: 100%;
        .more-wrapper
          position: absolute;
          left:0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          box-sizing: border-box;
          .list
            float: left;
            width: 50%;
            height: 50%;
            padding: 3px;
            box-sizing: border-box;
            overflow: hidden;
            >div
              overflow: hidden;
              width: 100%;
              height: 100%;

</style>
