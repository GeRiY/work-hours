<template>
  <v-text-field
    :value="value"
    :type="type"
    :label="label"
    :outlined="outlined"
    :dense="dense"
    @input="onInput"
    :rules="rules"
    :hint="hint"
    :disabled="disabled"
    :readonly="readOnly"
    persistent-hint
  />
</template>

<script>
export default {
  name: "TextField",
  props: {
    type: {
      type: String,
      default(){
        return "text";
      },
    },
    label: {
      type: String,
      default(){
        return "label";
      },
    },
    outlined: {
      type: Boolean,
      default() {
        return true;
      },
    },
    dense: {
      type: Boolean,
      default() {
        return true;
      },
    },
    value: {
      default(){
        return '';
      },
    },
    rules: {
      type: Array,
      default(){
        return [];
      },
    },
    hint: {
      type: String,
      default(){
        return '';
      },
    },
    disabled: {
      type: Boolean,
      default(){
        return false;
      },
    },
    readOnly: {
      type: Boolean,
      default(){
        return false;
      },
    },
  },
  beforeMount() {},
  data(){
    return {
      model: '',
    };
  },
  methods: {
    onInput(value){
      this.$emit('input',value);
    }
  }
}
</script>

<style scoped>

</style>
