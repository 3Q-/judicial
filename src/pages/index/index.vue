<template>
  <div class="container clearfix">
    <h1><div class="time"><el-button disabled icon="el-icon-date">{{time|formatDate}}</el-button></div>国家统一法律职业资格考试监控视频</h1>
    <div class="wrap" v-if="list.length">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="player" >
          <video-player class="vjs-custom-skin"
            :options="item.playerOptions"
            @ready="playerReadied">
          </video-player>
        </div>
        <div class="title" :title="item">{{item.channelName}}</div>
      </div>
    </div>
    <div class="page" v-if="list.length">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <tree-examnode></tree-examnode>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapGetters} from 'vuex';
import TreeExamnode from 'base/tree-examnode/tree-examnode';
import {formatDate} from 'common/js/date';
import VideoPlayer from 'vue-video-player';
import {getLiveVideoList} from 'api/api';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
Vue.use(VideoPlayer);
const playerOptions = {
  autoplay: true,
  controlBar: {
    timeDivider: false,
    durationDisplay: false
  },
  flash: {hls: { withCredentials: false }},
  html5: {hls: { withCredentials: false }},
  poster: './static/images/video.png'
};
export default {
  components: {TreeExamnode},
  data(){
    return {
      time: new Date(),
      screenWidth: document.body.clientWidth,
      videoList: [],
      pagination: {
        total: 0,
        size: 9,
        current: 1
      }
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
      me.videoList.forEach(item => {
        let obj = Object.assign({
          width: me.videoW,
          height: me.videoH,
          sources: [{
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: item.liveAddress
          }]
        }, playerOptions);
        item.playerOptions = obj;
      });
      return me.videoList;
    }
  },
  created(){
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.getLiveVideoList();
  },
  mounted(){
    // const that = this;
    // window.onresize = () => {
    //   return (() => {
    //     window.screenWidth = document.body.clientWidth;
    //     that.screenWidth = window.screenWidth;
    //   })();
    // };
  },
  filters: {
    formatDate(time){
      let date = new Date(time);
      return formatDate(date, 'yyyy/MM/dd hh:mm:ss');
    }
  },
  methods: {
    getLiveVideoList(){
      const me = this;
      const data = {};
      data.nodeId = me.nodeId;
      data.administrativeId = me.administrativeId;
      data.pageIdx = me.pagination.current;
      data.pageSize = me.pagination.size;
      getLiveVideoList(data).then(res => {
        me.pagination.total = res.page.total;
        me.videoList = res.page.rows;
      });
    },

    handleCurrentChange(val){
      this.pagination.current = val;
      this.getLiveVideoList();
    },
    playerReadied(player){
      player.play();
      // console.log(player);
      // var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls;
      // console.log(hls);
      // player.tech_.hls.xhr.beforeRequest = function(options){
      //   // console.log(options);
      //   return options;
      // };
    }
  },
  watch: {
    nodeId(){
      this.getLiveVideoList();
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin.styl";
@import "~common/stylus/var.styl";
.container
  position: relative;
  margin: 0 auto;
  padding: 20px 0;
  background: #c7e1f7;
  h1
    position: relative;
    padding: 20px 0 ;
    font-size: 24px;
    text-align: center;
    .time
      position: absolute;
      left: 12px;
      top: 20px;
      font-size: 14px;
  .wrap
    display: flex;
    position: relative;
    flex-wrap: wrap;
    .item
      flex: 0 0 33.33333%;
      box-sizing: border-box;
      padding: 0 10px;
      margin-bottom: 20px;
      overflow: hidden;
      .title
        width: 100%;
        height: 18px;
        margin-top: 10px;
        line-height: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
  .el-pagination
    text-align: center;
  .point-wrap
    position: absolute;
    right: 12px
    top: 40px;
  .el-button
    color: #606266;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
    &:hover
      color: #409EFF;
  .el-icon-date,.is-disabled
    &:hover
      color: #606266;
      border-color: #c6e2ff;
      background-color: #ecf5ff !important;

</style>
