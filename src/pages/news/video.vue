<template>
<div style="width: 100%;height: 100%;">
  <video
    :id="makeVideoId"
    class="video-js vjs-default-skin vjs-big-play-centered"
    muted
    controls
    autoplay
    preload="auto"
    data-setup="{}"
    :to-elem="toElem"
  ></video>
</div>
  
</template>

<script>
import lang from './lang.json';
export default {
  name: 'ezuikit-live-video',
  props: {
    videoId: {
      type: [Number, String],
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    toElem:[Number, String]
  },

  computed: {
    styleObject() {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      };
    },
    makeVideoId() {
      return `ezuikit_live_${this.videoId}`;
    }
  },
  data: function() {
    return {
      player: null
    };
  },
  mounted: function() {
    this.initVideo();
  },
  methods: {
    initVideo() {
      const me = this;
      me.$nextTick(function() {
        window.videojs.addLanguage('zh-CN', lang);
        me.player = window.videojs(me.makeVideoId, {
          autoplay: true,
          controls: true,
          language: 'zh-CN',
          sources: [
            {
              src: me.url,
              type: 'application/x-mpegURL'
            }
          ]
        },function(){
          this.play();
        });
      });
    }
  },

  watch: {
    url(nVal, oVal) {
      // console.log('nVal :>> ', nVal);
      this.player.src(nVal);
      // this.player.reset(); //重置 video
      // this.player.src([
      //   {
      //     type: 'application/x-mpegURL',
      //     src: nVal
      //   }
      // ]);
      // this.player.load();
      // this.player.play();
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
};
</script>

<style lang="stylus">
.video-js
  height: 100% !important;
  width: 100% !important;
</style>

