<template>
  <v-row class="mt-2">
    <v-col cols="12">
      <v-form lazy-validation>
        <v-row>
          <v-col cols="6" md="2">
            <TextField
              label="Óraszám"
              type="number"
              :value="hourCount"
              @input="hourCount = $event"
              :rules="[checkOnlyNumber]"
              :hint="IS_REQUIRED"
              :disabled="!!(workType && workType.isFullDay)"
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="workType"
              :items="workTypes"
              item-text="name"
              item-value="id"
              no-data-text="Nincs felvéve még típus..."
              label="Munka tipus"
              return-object
              outlined
              dense
            ></v-select>
          </v-col>

          <v-col cols="6" md="2">
            <TextField
              label="Órabér"
              type="number"
              :value="hourlyPrice"
              @input="hourlyPrice = $event"
              :rules="[checkOnlyNumber]"
              disabled
            />
          </v-col>

          <v-col cols="6" md="2">
            <TextField
              label="összesen"
              type="text"
              :value="fullPriceStr"
              disabled
            />
          </v-col>
        </v-row>

      </v-form>
    </v-col>

    <v-col cols="12">
      <v-btn @click="felvitel" :disabled="!workType || (workType && !workType.isFullDay && !hourCount)">
        Felvitel
      </v-btn>
    </v-col>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="cyan"
    ></v-progress-linear>

    <v-col cols="12">
      <CAlert :alert="alert" @input="alert = false"/>
    </v-col>

    <v-col cols="12">
      <v-card class="import-field">
        <div class="title">Import Munkaidők</div>
        <textarea
          cols="30"
          rows="10"
          v-model="workHoursStr"
        ></textarea>
        <v-btn class="action" @click="importWorkHours">Import</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {checkOnlyNumber, checkRequired} from '@/utils/validationRules'
import {IS_OPTIONAL, IS_REQUIRED} from '@/utils/constans'
import {newAlert} from '@/utils/alerts'
import CAlert from "@/components/CAlert";
import {getDataFromSheet, insertDataToSheet} from "@/api/sheetBest";
import moment from 'moment/moment'
import TextField from "@/components/Fields/TextField";

export default {
  name: "workHourForm",
  components: {CAlert,TextField},
  setup(){
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
    }
  },
  async beforeMount() {
    this.isLoading = true;
    const res = await getDataFromSheet('workType');
    if(res){
      this.workTypes = res;
    }
    this.isLoading = false;
  },
  data(){
    return {
      hourCount: 0,
      workType: null,
      hourlyPrice: 0,
      fullPrice: 0,

      workHours: [],

      workTypes: [
        /*{id: 0, name: 'Piacozás', hourlyPrice: 5000},
        {id: 1, name: 'Traktorozás', hourlyPrice: 4000},
        {id: 2, name: 'Egyéb', hourlyPrice: 1000},*/
      ],

      isLoading: false,
      alert: false,

      workHoursStr: '',
    };
  },
  computed: {
    fullPriceStr(){
      if(this.fullPrice && checkOnlyNumber(this.fullPrice)){
        return this.fullPrice+' Ft';
      }
    }
  },
  watch: {
    hourCount(){
      this.calc();
    },
    workType(val){
      if(val){
        this.hourlyPrice = val.hourlyPrice;
        if(val.isFullDay){
          this.hourCount = 0;
        }
      }
      this.calc();
    },
    hourlyPrice(){
      this.calc();
    }
  },
  methods: {
    calc(){
      if(this.workType && this.hourlyPrice && (this.workType.isFullDay || this.hourCount)){
        this.fullPrice = this.workType.hourlyPrice*this.hourCount;
      }
    },
    async felvitel(){
      if(this.fullPrice || this.workType.isFullDay){
        this.isLoading = true;
        const res = await insertDataToSheet({
          hourCount: this.hourCount,
          workType: this.workType.name,
          hourlyPrice: this.workType.isFullDay ? 0 : this.hourlyPrice,
          fullPrice: this.workType.isFullDay ? this.workType.hourlyPrice : this.fullPrice,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        },'workHour');
        if(res){
          this.alert = newAlert();
        } else {
          this.alert = newAlert('warning','Sikertelen felvitel!');
        }
        this.isLoading = false;
      } else {
        this.alert = newAlert('warning','Nem adtál meg minden adatot!');
      }
    },
    importWorkHours(){
      if(this.workHoursStr){
        this.workHours = JSON.parse(this.workHoursStr);
        this.workHours.forEach(async (workHour) => {
          localStorage.setItem('workHours',JSON.stringify(workHour));
          console.log(localStorage.getItem('workHour'));
          this.alert = newAlert();
        });
      }
    }
  },
}
</script>

<style>
  .import-field{
    padding: 10px;
    margin-top: 20px;
  }
  .import-field .title{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
  .import-field textarea{
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .import-field .action{
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    width: 100%;
    font-size: 18px;
  }
</style>

