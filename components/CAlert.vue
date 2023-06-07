<template>
  <v-alert
    :value="alert ? true : false"
    :type="alert.type"
    transition="scale-transition"
    :dismissible="alert.needCloseButton"
  >
    {{ alert.text }}
  </v-alert>
</template>
<script>
export default {
  name: 'CAlert',
  props: {
    alert: {
      type: [Object,Boolean],
      default(){
        return false;
      },
    },
  },
  methods: {
    hideAlert() {
      this.$emit('input');
      return "1";
    }
  },
  watch: {
    alert(val){
      if(val){
        setTimeout(() => this.hideAlert(),this.alert.duration);
      }
    }
  }
}
</script>
