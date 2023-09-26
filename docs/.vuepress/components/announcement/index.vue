<template>
  <div
    v-if="itemsNum > 0"
    class="klk-announcement"
    :style="cStyle"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @click="onClick"
  >
    <div class="klk-announcement-main" :style="mainStyle">
      <Items
        v-if="renderItems"
        :cur-index="curIndex"
        :items="items"
        :max-lines="maxLines"
        :loop-fix.sync="loopFix"
        :max-item-height.sync="maxItemHeight"
        :key-map="keyMap"
        :item-align="itemAlign"
        :line-height="lineHeight"
      ></Items>
    </div>
  </div>
</template>

<script>

import Items from './items.vue'

export default {
  name: 'KlkAnnouncement',
  components: {
    Items
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    maxContentWidth: {
      type: [String, Number],
      default: '100%'
    },
    fixed: Boolean,
    offsetTop: {
      type: Number,
      default: 0
    },
    maxLines: {
      type: Number,
      default: 1
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    keyMap: {
      type: Object,
      default: () => ({
        icon: 'icon',
        label: 'label'
      })
    },
    itemAlign: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      curIndex: 0,
      autoplayTimer: null,
      autoplayInterval: 3000,
      loopFix: false,
      maxItemHeight: null,
      renderItems: true
    }
  },
  computed: {
    cStyle() {
      return {
        position: this.fixed ? 'fixed' : '',
        top: this.fixed ? `${this.offsetTop}px` : '',
        left: this.fixed ? 0 : '',
        right: this.fixed ? 0 : '',
        zIndex: this.fixed ? 600 : ''
      }
    },
    mainStyle() {
      const maxWidth = typeof this.maxContentWidth === 'number'
        ? `${this.maxContentWidth}px`
        : this.maxContentWidth
      return {
        maxWidth,
        maxHeight: this.maxItemHeight ? `${this.maxItemHeight}px` : ''
      }
    },
    itemsNum() {
      return this.items.length
    }
  },
  watch: {
    items(val) {
      if (val.length > 1) {
        this.startAutoplay()
      } else { this.stopAutoplay() }
      // when items change
      this.reRender()
    }
  },
  mounted() {
    this.startAutoplay()
  },
  beforeDestroy() {
    this.stopAutoplay()
  },
  methods: {
    startAutoplay() {
      if (this.itemsNum <= 1) { return }
      // clear previous timer
      this.stopAutoplay()
      this.autoplay()
    },
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearTimeout(this.autoplayTimer)
        this.autoplayTimer = null
      }
    },
    autoplay() {
      this.autoplayTimer = setTimeout(() => {
        this.setIndex(this.curIndex + 1)
        this.autoplay()
      }, this.autoplayInterval)
    },
    setIndex(index) {
      if (index === this.curIndex) { return }
      this.loopFix = false
      // handle edge cases
      if (index > this.itemsNum - 1) {
        this.curIndex = 0
        this.loopFix = true
      } else { this.curIndex = index }
    },
    onClick() {
      const item = this.items[this.curIndex]
      if (item && item.link) {
        window.open(item.link)
      }
      this.$emit('click', this.curIndex)
    },
    // handle cases that when items change and item's height not set right.
    reRender() {
      this.curIndex = 0
      this.loopFix = false
      this.maxItemHeight = null
      this.renderItems = false
      this.stopAutoplay()
      this.$nextTick(() => {
        this.renderItems = true
        this.startAutoplay()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$announcement-color: #FF5B00 ;
$announcement-bg: #FCF3DE;

.klk-announcement {
  color: $announcement-color;
  background-color: $announcement-bg;
  border: 1px solid #FFD0BD;
  padding: 12px;
  border-radius: 12px;
  &:hover {
    cursor: default;
  }
  &-main {
    overflow: hidden;
    margin: 0 auto;
    display: flex;
    align-items: center;
    svg {
      margin-right: 8px;
      flex-shrink: 0;
      color: $announcement-color;
    }
    .klk-announcement-warning-icon {
      font-size: 20px;
      margin-right: 8px;
    }
    .klk-announcement-link-icon {
      font-size: 16px;
      margin-left: 8px;
    }
    /deep/ .klk-announcement-items {
      flex: 1;
      align-self: flex-start;
      transition: transform 320ms cubic-bezier(0.22, 0, 0.08, 1);
    }
    /deep/ .klk-announcement-item {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: $announcement-bg;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      position: relative;

      img {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 2px;
        margin-right: 8px;
      }

      span {
        display: block;
      }

      &.klk-announcement-item-img {
        span {
          margin-left: 28px;
        }
      }
    }
  }
}

</style>
