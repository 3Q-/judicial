<template>
  <div class="container clearfix">
  <!-- <city-picker field="city" placeholder="选择城市" :city-list="cityList" :no-hot="false" :value="cityId"
    @on-city-change="onCityChange"></city-picker> -->
    <h1><div class="time"><el-button disabled icon="el-icon-date" @click="selectCity">{{time|formatDate}}</el-button></div>2018年国家统一法律职业资格考试监控视频-北京考区</h1>
    <div class="wrap" v-if="list.length">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="player" >
          <video :id="'myPlayer'+index" poster="./video.png" controls playsInline webkit-playsinline autoplay :width="videoW" :height="videoH" >
            <source :src="hd ? item.rtmpHd: item.rtmp" type="rtmp/flv" />
            <source :src="hd ? item.hdAddress : item.liveAddress" type="application/x-mpegURL" />
          </video>
        </div>
        <div class="title" :title="item">{{item.channelName}}</div>
      </div>
    </div>
    <div v-else class="no-video">暂无监控视频</div>
    <div class="page" v-if="list.length">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :page-sizes="pagination.pagesizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <tree-examnode></tree-examnode>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Cookies from 'js-cookie';
import TreeExamnode from 'base/tree-examnode/tree-examnode';
import cityPicker from 'base/city-picker/city-picker';
import cityList from 'common/data/china-city-data';
import {formatDate} from 'common/js/date';
import {getLiveVideoList} from 'api/api';
import EZUIPlayer from 'EZUIPlayer';
const PAGINATION_SIZE = 'PAGINATION_SIZE';

export default {
  components: {TreeExamnode, cityPicker},
  data(){
    // const SIZE = Cookies.get(PAGINATION_SIZE) || 6;
    return {
      cityList,
      cityId: '410100',
      time: new Date(),
      screenWidth: document.body.clientWidth,
      videoList: [],
      pagination: {
        pagesizes: [3, 6, 9],
        total: 0,
        size: 6,
        current: 1
      },
      hd: false
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
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    const SIZE = Cookies.get(PAGINATION_SIZE);
    if (SIZE){
      this.pagination.size = +SIZE;
    }
    if (this.$route.query.hd === 'true'){
      this.hd = true;
    } else {
      this.hd = false;
    }
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
    initMedia(id){
      let player = new EZUIPlayer(id);
      player.on('error', function(){
        console.log('error');
      });
      player.on('play', function(){
        console.log('play');
      });
      player.on('pause', function(){
        console.log('pause');
      });
      // player.play();
    },
    onCityChange(cityId){
      this.cityId = cityId;
    },
    selectCity(){},
    getLiveVideoList(){
      const me = this;
      const data = {};

      data.nodeId = me.nodeId;
      data.administrativeId = me.administrativeId;
      data.pageIdx = me.pagination.current;
      data.pageSize = me.pagination.size;
      getLiveVideoList(data).then(res => {
        me.pagination.total = res.page.total;
        const videoList = res.page.rows;

        me.videoList = [];
        me.$nextTick(() => {
          me.videoList = videoList;
          me.$nextTick(() => {
            me.videoList.forEach((item, i) => {
              var videoId = `myPlayer${i}`;
              me.initMedia(videoId);
            });
          });
        });
      });
    },

    handleCurrentChange(val){
      this.pagination.current = val;
      this.getLiveVideoList();
    },
    handleSizeChange(val){
      Cookies.set(PAGINATION_SIZE, val, { expires: 7 });
      this.pagination.size = val;
      this.getLiveVideoList();
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
  min-height: 100%;
  box-sizing: border-box;
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
  .no-video
    font-size 18px
    text-align center
    padding-top 50px
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
