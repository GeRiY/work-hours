<template>
  <div>
    <v-col v-if="cols" :cols="cols">
      <TextField v-if="$attrs.type === 'text' || $attrs.type === 'number'" v-bind="$attrs" @input="onInput"/>
      <v-switch
        v-if="$attrs.type === 'check'"
        v-bind="$attrs"
        @change="onInput"
      ></v-switch>
      <v-autocomplete
        v-if="$attrs.type === 'select'"
        v-bind="$attrs"
        @change="onInput"
      ></v-autocomplete>
    </v-col>
    <div v-if="!cols">
      <TextField v-if="$attrs.type === 'text' || $attrs.type === 'number'" v-bind="$attrs" @input="onInput"/>
      <v-switch
        v-if="$attrs.type === 'check'"
        v-bind="$attrs"
        @change="onInput"
      ></v-switch>
      <v-autocomplete
        v-if="$attrs.type === 'select'"
        v-bind="$attrs"
        @change="onInput"
      ></v-autocomplete>
    </div>
  </div>
</template>
<script>
import TextField from "@/components/Fields/TextField";
export default {
  name: 'CField',
  components: {
    TextField,
  },
  setup(){
    return {};
  },
  beforeMount() {},
  data(){
    return {
      //
    };
  },
  props: {
    cols: {
      type: Number,
      default(){
        return 0;
      },
    },
  },
  methods: {
    onInput(value){
      this.$emit('input',value);
    }
  },
  watch: {
    //
  }
}
</script>
