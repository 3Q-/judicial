<template>
  <el-container class="video-wrapper">
    <el-header height="34px">
      <img height="21"  src="../login/logo.png" alt="视频监控系统">
      <span>视频监控系统</span>
      <span class="tab"><i class="el-icon-video-camera"></i>视频预览</span>
      <!-- <span @click="logout" class="logout"> <i class="iconfont iconsignout"></i> 退出</span> -->
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
            <el-button type="text" icon="el-icon-video-play" @click="start" v-if="showStart">循环播放</el-button>
            <el-button type="text" icon="el-icon-video-pause" @click="stop" v-else>停止循环</el-button>
            <el-button type="text" icon="el-icon-circle-close" @click="clear">清空</el-button>
          </el-col>
        </el-row>

        <div class="video-list-wrapp">
          <div class="single-wrapper" id="single-wrapper" v-if="showStateCount ==1">
            <div class="nodata" v-if="!currentPageList[0]" to-elem="0">
              <div class="empty-text">
                <i class="iconfont iconshexiangtou1"></i>
                <p>未添加视频源，可以把视频拖拽进来播放</p>
              </div>
            </div>
            <LiveVideo v-else video-id="myPlayer1" :url="currentPageList[0].hdAddress" to-elem="0"> </LiveVideo>
          </div>
          <div id="more-wrapper" class="more-wrapper" v-else >
            <div :id="listId(index-1)" :key="index" class="list" v-for="index in 4">
              <div class="nodata" v-if="!currentPageList[index-1]" :to-elem="index-1">
                <div class="empty-text">
                  <i class="iconfont iconshexiangtou1"></i>
                  <p>未添加视频源，可以把视频拖拽进来播放</p>
                </div>
              </div>
              <LiveVideo v-else :video-id="index-1" :url="currentPageList[index-1].hdAddress" :to-elem="index-1"> </LiveVideo>
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
import LiveVideo from './video';
// import EZUIKit from 'EZUIKit';
// const PAGINATION_SIZE = 'PAGINATION_SIZE';

export default {
  components: {TreeExamnode,LiveVideo},
  data(){
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showStart: true,
      treeData: [],
      showStateCount: 4,
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
    // const data = [{
		// 	"id": "ougmup7ak01E6NUp8nA7ra1Taz0KeSdJ",
		// 	"liveAddress": "https://hls01open.ys7.com/openlive/dba3d446bab94250b082f190977f0431.hd.m3u8",
		// 	"deviceSerial": "E21104481",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://hls01open.ys7.com/openlive/dba3d446bab94250b082f190977f0431.hd.m3u8",
		// 	"channelName": "钦培中心多功能教室前",
		// 	"rtmp": "https://hls01open.ys7.com/openlive/dba3d446bab94250b082f190977f0431.hd.m3u8",
		// 	"rtmpHd": "https://hls01open.ys7.com/openlive/dba3d446bab94250b082f190977f0431.hd.m3u8",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 107,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7ak0LoqUgOWAX1_bKUShMc8rWo",
		// 	"liveAddress": "https://hls01open.ys7.com/openlive/d7b260c0827042f0ba7a940cc9a6a2cf.hd.m3u8",
		// 	"deviceSerial": "E21101460",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://hls01open.ys7.com/openlive/d7b260c0827042f0ba7a940cc9a6a2cf.hd.m3u8",
		// 	"channelName": "钦培中心多功能教室后",
		// 	"rtmp": "https://hls01open.ys7.com/openlive/d7b260c0827042f0ba7a940cc9a6a2cf.hd.m3u8",
		// 	"rtmpHd": "https://hls01open.ys7.com/openlive/d7b260c0827042f0ba7a940cc9a6a2cf.hd.m3u8",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 108,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7ajgetQv32Z3QGL9Wa00NlCbu1",
		// 	"liveAddress": "https://open.ys7.com/v3/openlive/167661060_1_1.m3u8?expire\u003d1655772690\u0026id\u003d328819552654336000\u0026t\u003d56f02da5cfad0431f976bba38101c26091df306340da68c62e8e83b8637c7150\u0026ev\u003d100",
		// 	"deviceSerial": "167661060",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://open.ys7.com/v3/openlive/167661060_1_1.m3u8?expire\u003d1655772690\u0026id\u003d328819552654336000\u0026t\u003d56f02da5cfad0431f976bba38101c26091df306340da68c62e8e83b8637c7150\u0026ev\u003d100",
		// 	"channelName": "钦培中心电教1前",
		// 	"rtmp": "https://open.ys7.com/v3/openlive/167661060_1_1.m3u8?expire\u003d1655772690\u0026id\u003d328819552654336000\u0026t\u003d56f02da5cfad0431f976bba38101c26091df306340da68c62e8e83b8637c7150\u0026ev\u003d100",
		// 	"rtmpHd": "https://open.ys7.com/v3/openlive/167661060_1_1.m3u8?expire\u003d1655772690\u0026id\u003d328819552654336000\u0026t\u003d56f02da5cfad0431f976bba38101c26091df306340da68c62e8e83b8637c7150\u0026ev\u003d100",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 109,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7ajgcVZTAE6J4d78ucdBV0TYa6",
		// 	"liveAddress": "https://hls01open.ys7.com/openlive/519252938ccb4167ae58bf9e521b3288.hd.m3u8",
		// 	"deviceSerial": "C03970737",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://hls01open.ys7.com/openlive/519252938ccb4167ae58bf9e521b3288.hd.m3u8",
		// 	"channelName": "钦培中心电教1后",
		// 	"rtmp": "https://hls01open.ys7.com/openlive/519252938ccb4167ae58bf9e521b3288.hd.m3u8",
		// 	"rtmpHd": "https://hls01open.ys7.com/openlive/519252938ccb4167ae58bf9e521b3288.hd.m3u8",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 110,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7ajgoa8MYY5kJD_a2lbTkX_dnW",
		// 	"liveAddress": "https://hls01open.ys7.com/openlive/2b624f3250eb41678d3ed5b651a33e12.hd.m3u8",
		// 	"deviceSerial": "C03970987",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://hls01open.ys7.com/openlive/2b624f3250eb41678d3ed5b651a33e12.hd.m3u8",
		// 	"channelName": "钦培中心电教2前",
		// 	"rtmp": "https://hls01open.ys7.com/openlive/2b624f3250eb41678d3ed5b651a33e12.hd.m3u8",
		// 	"rtmpHd": "https://hls01open.ys7.com/openlive/2b624f3250eb41678d3ed5b651a33e12.hd.m3u8",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 111,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7ajg4MYZe5OjklF8e1gAHX_HtO",
		// 	"liveAddress": "https://hls01open.ys7.com/openlive/cada1c27cb90472cada13159f96eb39b.hd.m3u8",
		// 	"deviceSerial": "C12976816",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://hls01open.ys7.com/openlive/cada1c27cb90472cada13159f96eb39b.hd.m3u8",
		// 	"channelName": "钦培中心电教2后",
		// 	"rtmp": "https://hls01open.ys7.com/openlive/cada1c27cb90472cada13159f96eb39b.hd.m3u8",
		// 	"rtmpHd": "https://hls01open.ys7.com/openlive/cada1c27cb90472cada13159f96eb39b.hd.m3u8",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 112,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }, {
		// 	"id": "ougmup7aj0d1nWJcgxAZkbfqE4gcuRmL",
		// 	"liveAddress": "https://open.ys7.com/v3/openlive/C03970906_1_1.m3u8?expire\u003d1655773085\u0026id\u003d328821210422321152\u0026t\u003da25ce272bf7a37462369fcfc914cb12ea496eebdbccd95694b90f20f873a71e1\u0026ev\u003d100",
		// 	"deviceSerial": "C03970906",
		// 	"nodeId": "oujkce7ii3aP_97xmWkYcbHLXr0UtGol",
		// 	"updateTime": 2021,
		// 	"updateBy": "admin",
		// 	"hdAddress": "https://open.ys7.com/v3/openlive/C03970906_1_1.m3u8?expire\u003d1655773085\u0026id\u003d328821210422321152\u0026t\u003da25ce272bf7a37462369fcfc914cb12ea496eebdbccd95694b90f20f873a71e1\u0026ev\u003d100",
		// 	"channelName": "钦培中心入场通道",
		// 	"rtmp": "https://open.ys7.com/v3/openlive/C03970906_1_1.m3u8?expire\u003d1655773085\u0026id\u003d328821210422321152\u0026t\u003da25ce272bf7a37462369fcfc914cb12ea496eebdbccd95694b90f20f873a71e1\u0026ev\u003d100",
		// 	"rtmpHd": "https://open.ys7.com/v3/openlive/C03970906_1_1.m3u8?expire\u003d1655773085\u0026id\u003d328821210422321152\u0026t\u003da25ce272bf7a37462369fcfc914cb12ea496eebdbccd95694b90f20f873a71e1\u0026ev\u003d100",
		// 	"administrativeId": "o1b4d5331nbGTAS43v4m59Fqhx2PIWSQ",
		// 	"nodeName": "广西开放大学",
		// 	"administrativeName": "南宁市",
		// 	"sort": 113,
		// 	"planId": "ougn75t0lj21CuTUyLkcobrpV9Q4YPD2"
		// }];
    const data = [{
      'id': 'ougmu0urpm9uevHa34kTKb1dy_O6uL7-',
      'deviceSerial': 'F51981584',
      'nodeId': 'oujikgde147eSY7vz34Dy8QwD73Y_nbF',
      'updateTime': 2021,
      'updateBy': 'admin',
      'hdAddress': 'https://hls01open.ys7.com/openlive/48ba45702ed94976b03d56653ffe16dd.hd.m3u8',
      'channelName': '梧州1',
      'rtmp': 'https://hls01open.ys7.com/openlive/48ba45702ed94976b03d56653ffe16dd.hd.m3u8',
      'rtmpHd': 'https://hls01open.ys7.com/openlive/48ba45702ed94976b03d56653ffe16dd.hd.m3u8',
      'administrativeId': 'o1b4d5331n4cDvVEzCAC49skhmeTcmBl',
      'nodeName': '广西开放大学',
      'administrativeName': '南宁市',
      'sort': 5,
      'planId': 'ougn75t0lj21CuTUyLkcobrpV9Q4YPD2'
      },
      {
      'id': 'ougmu8c71o9xCIjGbskSqa3EeRntXDQb',
      'liveAddress': 'https://hls01open.ys7.com/openlive/4fe463a0822d49d18b8331140dcfe208.hd.m3u8',
      'deviceSerial': 'F49652188',
      'nodeId': 'oujikgde147eSY7vz34Dy8QwD73Y_nbF',
      'updateTime': 2021,
      'updateBy': 'admin',
      'hdAddress': 'https://hls01open.ys7.com/openlive/4fe463a0822d49d18b8331140dcfe208.hd.m3u8',
      'channelName': '梧州2',
      'rtmp': 'https://hls01open.ys7.com/openlive/4fe463a0822d49d18b8331140dcfe208.hd.m3u8',
      'rtmpHd': 'https://hls01open.ys7.com/openlive/4fe463a0822d49d18b8331140dcfe208.hd.m3u8',
      'administrativeId': 'o1b4d5331n4cDvVEzCAC49skhmeTcmBl',
      'nodeName': '广西开放大学',
      'administrativeName': '南宁市',
      'sort': 6,
      'planId': 'ougn75t0lj21CuTUyLkcobrpV9Q4YPD2'
      },
      {
      'id': 'ougmu0urpmehfcThy6Ab89tddyMCjLHw',
      'liveAddress': 'https://hls01open.ys7.com/openlive/4bc2ce55ae674139a9d6fc9c3103c1f9.hd.m3u8',
      'deviceSerial': 'F60619423',
      'nodeId': 'oujikgde147eSY7vz34Dy8QwD73Y_nbF',
      'updateTime': 2021,
      'updateBy': 'admin',
      'hdAddress': 'https://hls01open.ys7.com/openlive/4bc2ce55ae674139a9d6fc9c3103c1f9.hd.m3u8',
      'channelName': '梧州3',
      'rtmp': 'https://hls01open.ys7.com/openlive/4bc2ce55ae674139a9d6fc9c3103c1f9.hd.m3u8',
      'rtmpHd': 'https://hls01open.ys7.com/openlive/4bc2ce55ae674139a9d6fc9c3103c1f9.hd.m3u8',
      'administrativeId': 'o1b4d5331n4cDvVEzCAC49skhmeTcmBl',
      'nodeName': '广西开放大学',
      'administrativeName': '南宁市',
      'sort': 7,
      'planId': 'ougn75t0lj21CuTUyLkcobrpV9Q4YPD2'
      },
      {
      'id': 'ougmu0urpm4KY3fwhxQri9e71OV_tgkx',
      'liveAddress': 'https://hls01open.ys7.com/openlive/e86c68f4909e4046ae27acb7e6cc0617.hd.m3u8',
      'deviceSerial': 'E83404608',
      'nodeId': 'oujikgde147eSY7vz34Dy8QwD73Y_nbF',
      'updateTime': 2021,
      'updateBy': 'admin',
      'hdAddress': 'https://hls01open.ys7.com/openlive/e86c68f4909e4046ae27acb7e6cc0617.hd.m3u8',
      'channelName': '玉林1',
      'rtmp': 'https://hls01open.ys7.com/openlive/e86c68f4909e4046ae27acb7e6cc0617.hd.m3u8',
      'rtmpHd': 'https://hls01open.ys7.com/openlive/e86c68f4909e4046ae27acb7e6cc0617.hd.m3u8',
      'administrativeId': 'o1b4d5331n4cDvVEzCAC49skhmeTcmBl',
      'nodeName': '广西开放大学',
      'administrativeName': '南宁市',
      'sort': 9,
      'planId': 'ougn75t0lj21CuTUyLkcobrpV9Q4YPD2'
      },
      {
      'id': 'ougmu0urp71TKfmIDzkxha0Qd3sbwFWq',
      'liveAddress': 'https://hls01open.ys7.com/openlive/2aad1d2635614865b3b46291f201779d.hd.m3u8',
      'deviceSerial': 'F49662833',
      'nodeId': 'oujikgde147eSY7vz34Dy8QwD73Y_nbF',
      'updateTime': 2021,
      'updateBy': 'admin',
      'hdAddress': 'https://hls01open.ys7.com/openlive/2aad1d2635614865b3b46291f201779d.hd.m3u8',
      'channelName': '玉林2',
      'rtmp': 'https://hls01open.ys7.com/openlive/2aad1d2635614865b3b46291f201779d.hd.m3u8',
      'rtmpHd': 'https://hls01open.ys7.com/openlive/2aad1d2635614865b3b46291f201779d.hd.m3u8',
      'administrativeId': 'o1b4d5331n4cDvVEzCAC49skhmeTcmBl',
      'nodeName': '广西开放大学',
      'administrativeName': '南宁市',
      'sort': 11,
      'planId': 'ougn75t0lj21CuTUyLkcobrpV9Q4YPD2'
      },
      ];
      me.allList = data;
      me.serializeTreeData(data.slice());
  },
  mounted(){
      this.bindMoveItem();
      this.$refs.tree.setCheckedNodes(this.treeData);
      this.currentList = this.allList.slice();
      this.start(); 
    // getysCameraList().then(res => {
    //   const {data} = res;
    //   if (data && data.length){
    //     me.allList = data;
    //     me.serializeTreeData(data.slice());
    //     me.bindMoveItem();
    //   } else {

    //   }
    // });

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

  methods: {

    bindMoveItem(){
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
    },

    bindDrop(){
      const me = this;
      const bindTarget = document.getElementById('more-wrapper');
      bindTarget.ondragover = function(ev){
        ev.preventDefault(); // 阻止向上冒泡
      };
      bindTarget.ondragenter = function(ev){
        ev.target.classList.add('over');
      };
      bindTarget.ondragleave = function(ev){
        ev.target.classList.remove('over');
      };
      bindTarget.ondrop = function(ev){
        ev.preventDefault();
        ev.target.classList.remove('over');
        var id = ev.dataTransfer.getData('id');
        var toElem = ev.toElement.getAttribute('to-elem'); // 放置位置
        me.currentPageList[toElem] = me.allList.find(item => item.id === id);
        me.$set(me.currentPageList, toElem, me.currentPageList[toElem]);
        me.$nextTick(() => {
          var domId = document.getElementById(id);
          if (domId){
            me.showStart = true;
            me.stop();
          }
        });
      };
    },

    listId(i){
      return 'list' + i;
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
        if (!map[item.administrativeId]){
          map[item.administrativeId] = {
             id: item.administrativeId,
            label: item.administrativeName,
            pid: '',
            children: [item],
            level: 0
          };
        } else {
          map[item.administrativeId]['children'].push(item);
        }
      });
      let arr = Object.keys(map).map((k) => {
        map[k]['children'] = me.serializeExamNode(map[k]['children']);
        return map[k];
      });
      //  console.log('arr :>> ', arr);
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
      if (len < 1) return this.$message.error('请先选择视频源');
      const showStateCount = this.showStateCount;
      const currentPageIndex = this.currentPageIndex;
      this.totalPage = Math.ceil(len / showStateCount);
      let currentPageList =  this.currentList.filter((item, index) => currentPageIndex * showStateCount <= index && index < (currentPageIndex + 1) * showStateCount);
      // const currentPageListLen = currentPageList.length % showStateCount;
      // console.log('currentPageListLen :>> ', currentPageListLen);
      // if(currentPageListLen !==0){
      //   for(var i = 0;i<4-currentPageListLen;i++){
      //     currentPageList.push({});
      //   }
      // }

      this.currentPageList = currentPageList;
      this.$nextTick(()=>{
        this.showStart = false;
        this.timer = setTimeout(() => {
          if (this.totalPage === 1){
          } else if (this.totalPage === currentPageIndex + 1 && this.totalPage > 1){
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
      vertical-align: middle;
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
      border-bottom: 3px solid #84c5ff;
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
          color: #ccc;
      .el-tree-node__expand-icon
        color: #4d4d4d;
      .el-checkbox__inner
        border: 1px solid #666;
        border-radius: 1px;
  .el-main.main
    display: flex;
    flex-direction: column;
    padding: 0;
    background-color: #f8f8fa;
    color: #333;
    .main-top
      flex: 0 0 43px;
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
      flex: 1;
      position: relative;
      video
        background: #000;
        border: 0 none !important;
        border-radius: 10px;
        overflow: hidden;
        &.over
          border: 1px dashed red !important;
          box-sizing: border-box;
      .nodata
        position: relative;
        border-radius: 10px;
        background: #fff;
        font-size: 20px;
        color: #9ba2b4;
        border: 1px solid #ebedf2;
        text-align: center;
        box-sizing: border-box;
        &.over
          border: 1px dashed red;
          box-sizing: border-box;
        .empty-text
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -180px;
          margin-top: -52px;
          pointer-events: none;
        .iconfont
          display: inline-block;
          margin-bottom: 20px;
          font-size: 60px;
      .single-wrapper
        position: absolute;
        left: 0;
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
        left: 0;
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
