<template>
  <v-row class="mt-2 ml-2">
    <v-col cols="12">
      <v-form lazy-validation v-model="formValid">
        <v-row class="justify-center">
          <CField label="Egységár Ft"
                  type="number"
                  :value="lPrice"
                  @input="val => lPrice = val"
                  :rules="[checkRequired,checkOnlyNumber]"
                  :hint="IS_REQUIRED"
                  class="mt-2"
          />
          <CField label="Liter"
                  type="number"
                  :value="lCount"
                  @input="val => lCount = val"
                  :rules="[checkRequired,checkOnlyNumber]"
                  :hint="IS_REQUIRED"
                  class="mt-2"
          />
          <CField :label="`Teljes ár ${lPrice*lCount ? lPrice*lCount+' Ft' : 0+' Ft'}`"
                  type="number"
                  :value="fullPrice"
                  @input="val => fullPrice = val"
                  :rules="[checkOnlyNumber]"
                  :hint="IS_OPTIONAL"
                  class="mt-2"
          />
          <CField label="Kilóméter állás"
                  type="number"
                  :value="kmState"
                  @input="val => kmState = val"
                  :rules="[checkRequired,checkOnlyNumber]"
                  :hint="IS_REQUIRED"
                  class="mt-2"
          />

          <v-btn @click="addNew" class="ml-2 mt-2">
            Felvitel
          </v-btn>
        </v-row>
      </v-form>
    </v-col>

    <v-col cols="12" class="mt-2">
      <v-data-table
        :headers="[
          { text: 'Egyésgár Ft', value: 'lPrice' },
          { text: 'Liter', value: 'lCount' },
          { text: 'Teljes ár Ft', value: 'fullPrice' },
          { text: 'Kilóméter állás', value: 'kmState' },
          { text: 'Fizetve', value: 'isPaidString' },
          { text: 'Felvitel dátuma', value: 'createdAt' },
        ]"
        :items="dataset"
        class="elevation-1"
      ></v-data-table>
    </v-col>



    <v-col cols="12">
      <CAlert :alert="alert" @input="alert = false"/>
    </v-col>
  </v-row>
</template>

<script>
import {checkOnlyNumber, checkRequired} from '@/utils/validationRules'
import {IS_OPTIONAL, IS_REQUIRED} from '@/utils/constans'
import {newAlert} from '@/utils/alerts'
import CAlert from "@/components/CAlert";
import moment from "moment/moment";
import CField from "@/components/Fields/CField";

export default {
  name: "fuelLoadForm",
  components: {CField, CAlert},
  setup(){
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
    }
  },
  data(){
    return {
      formValid: true,

      lPrice: 480,
      lCount: 0,
      fullPrice: 0,
      kmState: 0,

      dataset: [],

      alert: false,
      isLoading: false,
    };
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async addNew(){
      if(this.formValid){
        this.isLoading = true;
        this.dataset.push({
          lPrice: this.lPrice,
          lCount: this.lCount,
          fullPrice: this.fullPrice ? this.fullPrice : this.lPrice*this.lCount,
          kmState: this.kmState,
          isPaid: 0,
          isPaidString: 'Nem',
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        this.alert = newAlert();
      } else {
        this.alert = newAlert('warning','Nem adtál meg minden adatot!');
      }
      this.isLoading = false;
    },
  },
}
</script>

