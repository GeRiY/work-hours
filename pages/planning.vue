<template>
  <div>
    <v-form ref="form" lazy-validation v-model="formValidity">
      <CField label="Órabér"
              type="text"
              :value="hourlyPrice"
              @input="val => hourlyPrice = val"
              :rules="[checkOnlyNumber]"
              :hint="IS_REQUIRED"/>
      <CField type="check"
              label="kapcsoló"
              color="success"
              :value="switchTest"
              dense
              outline
              hide-details
              @input="val => switchTest = val"
              />
      <br>
      <CField type="select"
              label="Select mező"
              :items="[
                {label: 'option1', value: 1},
                {label: 'option2', value: 2},
                {label: 'option3', value: 3},
              ]"
              item-text="label"
              item-value="value"
              :value="selectTest"
              @input="val => selectTest = val"
              return-object
              dense
              outlined
      />
    </v-form>

    <v-row>
      <v-col cols="12" v-if="tableData">
        <v-data-table
          :headers="tableData.header"
          :items="tableData.dataset"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { checkRequired, checkOnlyNumber } from '@/utils/validationRules'
import { IS_OPTIONAL, IS_REQUIRED } from '@/utils/constans'
import CField from "@/components/Fields/CField";

export default {
  name: "planning",
  components: {
    CField
  },
  watch: {
    hourlyPrice(val){},
    switchTest(val){},
    selectTest(val){},
    formValidity(val){},
  },
  mounted() {
    //
  },
  setup(){
   return {
     checkRequired,
     checkOnlyNumber,
     IS_OPTIONAL,
     IS_REQUIRED,
   };
  },
  data(){
    return {
      formValidity: true,
      selectTest: 1,
      switchTest: 0,
      hourlyPrice: 0,
      tableData: {
        header: [
          {text: 'Menüpontok', value: 'menus'},
          {text: 'Állapot', value: 'state'},
        ],
        dataset: [
          {
            menus: 'Munkaidő felvitel',
            state: 'kész'
          },
          {
            menus: 'Munka tipus felvite',
            state: 'kész'
          },
          {
            menus: 'Áttekintés',
            state: 'kész'
          },
          {
            menus: 'Sötét mód kibe kapcsolás',
            state: 'kész'
          },
          {
            menus: 'Fieldek egy komponensbe szervezés',
            state: 'valameddig kész'
          }
        ],
      },
    };
  },
  computed: {
    //
  },
  methods: {
    //
  },
}
</script>

<style scoped>

</style>
