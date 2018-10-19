<template>
  <div v-if="examNodes.length">
    <div class="point-wrap" v-if="!show" @click="show = !show">
      <el-button icon="el-icon-tickets">考点列表</el-button>
    </div>
    <transition name="bounce">
      <div class="tree-examNode-wrap" v-if="show">
        <div class="tree-examNode" @dblclick="show=false">
          <el-header >
            <div class="node-title">考点列表</div>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
            <i class="el-icon-close" @click="show = !show"></i>
          </el-header>
          <el-main>
            <el-tree class="filter-tree"
              show-checkbox
              accordion
              default-expand-all
              node-key="id"
              ref="examNodeTree"
              :data="list"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="selectNode"
              @check-change="checkChange">
            </el-tree>
          </el-main>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import {getExamNodes} from 'api/api';
export default {
  data(){
    return {
      examNodes: [],
      show: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  computed: {
    ...mapGetters([
    ]),
    tree(){
      return this.$refs.examNodeTree;
    },
    list(){
      const me = this;
      let areas = [];
      let map = {};
      me.examNodes.forEach(item => {
        if (!map[item.administrativeId]){
          areas.push({
            id: item.administrativeId,
            label: item.administrativeName,
            children: []
          });
          map[item.administrativeId] = true;
        }
      });
      areas.forEach(item => {
        me.examNodes.forEach(iitem => {
          if (item.id === iitem.administrativeId){
            item.children.push({
              pid: item.id,
              id: iitem.id,
              label: iitem.nodeName
            });
          }
        });
      });
      return areas;
    }
  },
  created(){
    this.getExamNodes();
  },
  methods: {
    getExamNodes(){
      const me = this;
      getExamNodes().then(res => {
        const rows = res.data;
        if (!rows || !rows.length){
          console.log('考点数据为空');
          return;
        }
        me.examNodes = rows;
      });
    },
    ...mapMutations({
      setExamNodeId: 'SET_EXAM_NODE_ID',
      setExamAdministrativeId: 'SET_EXAM_ADMINISTRATIVE_ID'
    }),
    checkChange(item, state, child){
      const keys = this.$refs.examNodeTree.getCheckedKeys();
      console.log(keys);
      this.setExamNodeId(keys.join(','));
    },
    selectNode(item, node, tree){
      if (item.pid){
        // this.setExamNodeId(item.id);
        // this.setExamAdministrativeId(item.pid);
      }
    },
    filterNode(value, data){
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val){
      this.$refs.examNodeTree.filter(val);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.tree-examNode-wrap
  position absolute
  top 30px
  right 10px
  width 300px
  height 500px
  z-index 2
  border-radius 10px
  border 1px solid #ccc
  .tree-examNode
    height 100%
    display flex
    flex-direction column
    background #fff
    border-radius 10px
    .el-header
      display: flex;
      line-height: 60px;
      padding-right:40px;
      border-radius 10px 10px 0 0
      border-bottom 1px solid #ccc
      .node-title
        width: 100px;
        height: 60px
      .el-input
        input
          background: #efe;
      .el-icon-close
        line-height: 60px;
        position: relative;
        left: 30px;
        cursor: pointer;
        color: #666
        &:hover
          color: #000;
    .el-main
      boxshadow(12px)
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

</style>
