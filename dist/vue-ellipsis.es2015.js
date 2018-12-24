
  /* !

  * vue-ellipsis v1.1.4

  * https://github.com/jypblue/vue-ellipsis

  * Released under the MIT License. 

  * 

  */

/**
 * @author zx.wang(zx.wang1991@gmail.com)
 * @version 1.0.0
 */

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }

  Vue.component('ellipsis', {
    props: {
      data: {
        type: String,
        default: ''
      },
      lineClamp: {
        type: Number,
        default: 1
      },
      lineHeight: {
        type: String,
        default: '22px'
      },
      endChar: {
        type: String,
        default: '...'
      },
      endHtml: {
        type: String,
        default: ''
      }
    },
    methods: {
      handleSubstrSentence: function () {
        var stNode = this.$refs.sentence;
        var html = this.data;
        if (html.length === 0) {
          console.error('the String is empty');
          return false;
        }
        stNode.innerHTML = html;
        // 开始及结束位置
        var startPos = 0;
        var endPos = html.length;
        // css 必须设置line-height 不然会报错
        //let stNodeStyles = window.getComputedStyle(stNode, null)
        var stNodeHeight = stNode.getBoundingClientRect().height || 22;
        // let stNodeLineHeight = stNodeStyles.lineHeight
        // stNodeLineHeight = stNodeLineHeight.slice(0, stNodeLineHeight.length - 2)
        // if (!!this.lineHeight) {
        //   stNodeLineHeight = !!this.lineHeight.indexOf('px') ? this.lineHeight.slice(0, this.lineHeight.length - 2) : this.lineHeight
        // }

        var stNodeLineHeight = this.lineHeight.slice(0, this.lineHeight.length - 2);
        var maxHeight = stNodeLineHeight * this.lineClamp;

        if (stNodeHeight > maxHeight) {
          while (Math.abs(endPos - startPos) > 1) {
            var half = Math.ceil((endPos + startPos) / 2);
            var newhtml = html.substring(0, half);
            stNode.innerHTML = newhtml;
            stNodeHeight = stNode.getBoundingClientRect().height || 22;
            if (stNodeHeight <= maxHeight) {
              startPos = half;
            } else {
              endPos = half;
            }
          }

          while (stNodeHeight > maxHeight) {
            var _newHtml = stNode.innerHTML.substring(0, stNode.innerHTML.trimRight().length - 1);
            stNode.innerHTML = _newHtml;
            stNodeHeight = stNode.getBoundingClientRect().height || 22;
          }

          var endStr = !!this.endHtml ? this.endHtml.replace(/<[^>]+>/g, "") : '';
          var endLen = this.endChar === '...' ? 3 : endStr.length + this.endChar.length;
          // 计算被截掉部分的空格
          var stNodeLen = stNode.innerHTML.trimRight().length;
          var stNodeDelStr = stNode.innerHTML.substring(stNodeLen - endLen, stNodeLen);
          var match = stNodeDelStr.match(/\s+/g);
          var extraLen = match && match.length ? match.length : 0;
          var newHtml = stNode.innerHTML.substring(0, stNodeLen - endLen - extraLen) + this.endChar + this.endHtml;
          stNode.innerHTML = newHtml;
        }
      },
      handleClick: function (e) {
        this.$emit('click', e);
      }
    },
    watch: {
      data: {
        immediate: true,
        deep: true,
        handler: function (value) {
          var _this = this;

          window.setTimeout(function () {
            _this.handleSubstrSentence();
          }, 300);
        }
      }
    },
    mounted: function () {
      // this.handleSubstrSentence()
    },

    template: '\n    <div ref="sentence" @click="handleClick"></div>\n    '
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
