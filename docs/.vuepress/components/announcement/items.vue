<template>
  <div ref="items" class="klk-announcement-items" :style="itemsStyle">
    <div
      v-for="(item, i) in items"
      :key="i"
      ref="item"
      :class="{
        'klk-announcement-item': true,
        'klk-announcement-item-current': i === curIndex,
        'klk-announcement-item-img': item[keyMap.icon],
      }"
      :style="itemStyle"
    >
      <img v-if="item[keyMap.icon]" :src="item[keyMap.icon]">
      <span class="ui-fs-16"> {{ item[keyMap.label] }} </span>
    </div>
  </div>
</template>

<script>
const TRANSITION_TIME = 300

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    curIndex: {
      type: Number,
      default: 0
    },
    maxLines: {
      type: Number,
      default: 1
    },
    loopFix: Boolean,
    maxItemHeight: {
      type: Number,
      default: 0
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    itemAlign: {
      type: String,
      default: 'top'
    },
    keyMap: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {
      translateY: 0,
      animating: false
    }
  },
  computed: {
    itemsStyle() {
      return {
        transform: `translateY(-${this.translateY}px)`,
        transition: this.animating ? '' : 'transform 0ms'
      }
    },
    itemStyle() {
      return {
        '-webkit-line-clamp': this.maxLines
      }
    }
  },
  watch: {
    curIndex() {
      this.updateTranslate()
    }
  },
  mounted() {
    this.initLoop()
    this.syncHeight()
  },
  methods: {
    initLoop() {
      if (this.items.length <= 1) {
        return
      }
      if (!this.$refs.items) { return }
      if (this.$refs.items.querySelector('.klk-announcement-item-copy')) { return }
      const items = this.$refs.items.querySelectorAll('.klk-announcement-item')
      const appendItem = items[0].cloneNode(true)
      appendItem.className += ' klk-announcement-item-copy'
      this.$refs.items.append(appendItem)
    },
    loopAdjust() {
      if (this.animating) { return }
      this.updateTranslate(this.curIndex)
    },
    // getTranslateOfItem (item) {
    //   let item = item
    // },
    updateTranslate(index) {
      if (!this.$refs.items) { return }
      this.animating = index === undefined
      const items = this.$refs.items.querySelectorAll('.klk-announcement-item')
      const idx = this.loopFix
        ? items.length - 1
        : index === undefined ? this.curIndex : index
      const item = items[idx]
      const translateY = item.offsetParent === item.parentNode
        ? item.offsetTop
        : item.offsetTop - item.parentNode.offsetTop
      this.translateY = translateY || 0
      // stop animating and fix loop
      if (this.animating) {
        setTimeout(() => {
          this.animating = false
          if (this.loopFix) {
            this.$emit('update:loop-fix', false)
            this.$nextTick(this.loopAdjust)
          }
        }, TRANSITION_TIME)
      }
    },
    syncHeight() {
      if (!this.$refs.items) { return }
      let maxItemHeight = this.lineHeight // set default
      function getItemHeight(item) {
        const { height = 0, paddingTop = 0, paddingBottom = 0 } = window.getComputedStyle(item)
        if (height) {
          return parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom)
        } else { return 0 }
      }
      const items = this.$refs.items.querySelectorAll('.klk-announcement-item')
      items.forEach((item) => {
        maxItemHeight = Math.max(maxItemHeight, getItemHeight(item))
      })
      const MAX_ITEM_HEIGHT = this.maxLines * this.lineHeight
      // maxItemHeight = maxItemHeight <= MAX_ITEM_HEIGHT ? maxItemHeight : MAX_ITEM_HEIGHT
      maxItemHeight = Math.min(maxItemHeight, MAX_ITEM_HEIGHT)
      this.updateMaxItemHeight(maxItemHeight)
      items.forEach((item) => {
        if (this.itemAlign === 'center') {
          const padding = maxItemHeight - getItemHeight(item)
          item.style.paddingTop = `${padding / 2}px`
          item.style.paddingBottom = `${padding / 2}px`
        } else {
          const padding = maxItemHeight - getItemHeight(item)
          item.style.paddingBottom = `${padding}px`
        }
        item.style.maxHeight = `${maxItemHeight}px`
      })
    },
    updateMaxItemHeight(height) {
      // console.log('>>> updateMaxItemHeight', height);
      this.$emit('update:max-item-height', height)
    }
  }
}
</script>
