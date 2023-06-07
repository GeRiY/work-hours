<template>
  <v-row class="mt-2">
    <v-col cols="12">
      <v-form lazy-validation>
        <v-row>
          <v-col cols="6" md="2">
            <TextField
              label="Név"
              type="text"
              :value="workTypeName"
              @input="workTypeName = $event"
              :rules="[checkRequired]"
              :hint="IS_REQUIRED"
            />
          </v-col>

          <v-col cols="6" md="2">
            <TextField
              label="Órabér"
              type="number"
              :value="workTypePrice"
              @input="workTypePrice = $event"
              :rules="[checkRequired,checkOnlyNumber]"
              :hint="IS_REQUIRED"
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-switch
              v-model="isFullDay"
              :label="`Teljes nap: ${isFullDay ? 'Igen' : 'Nem'}`"
              color="success"
              :value="1"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col cols="12">
      <v-btn @click="addNew">
        Felvitel
      </v-btn>
      <v-btn class="ml-2" color="primary" dark @click="exportTypes" >Export</v-btn>
    </v-col>

    <v-col cols="12">
      <CAlert :alert="alert" @input="alert = false"/>
    </v-col>

    <v-col cols="12">
      <v-expansion-panels inset v-if="workTypes.length">
        <v-expansion-panel v-for="(card, cardIndex) in workTypes" :key="cardIndex">
          <v-expansion-panel-header><b>{{ card.name }}</b></v-expansion-panel-header>
          <v-expansion-panel-content>
            <ul class="attrs">
              <li>{{card.isFullDay ? 'Teljes bér' : 'Órabér'}}: {{card.hourlyPrice}} Ft</li>
              <li>Teljes nap: {{card.isFullDay ? 'Igen' : 'Nem'}}</li>
            </ul>
            <div class="actions">
              <v-btn color="error" dark @click="removeType(card.id)" >Törlés</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import {checkOnlyNumber, checkRequired} from '@/utils/validationRules'
import {IS_OPTIONAL, IS_REQUIRED} from '@/utils/constans'
import {newAlert} from '@/utils/alerts'
import CAlert from "@/components/CAlert";
import {insertDataToSheet} from "@/api/sheetBest";
import TextField from "@/components/Fields/TextField";
import {getWorkTypes, removeWorkTypeById} from '@/api/workTypeApi'

export default {
  name: "workTypeForm",
  components: {CAlert,TextField},
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
      workTypeName: '',
      workTypePrice: 0,
      isFullDay: 0,

      workTypes: [],

      alert: false,
      isLoading: false,
    };
  },
  beforeMount() {
    this.getTypes();
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async addNew(){
      if(this.workTypeName && this.workTypePrice > 0){
        const res = await insertDataToSheet({
          hourlyPrice: this.workTypePrice,
          name: this.workTypeName,
          isFullDay: this.isFullDay ? 1 : 0,
        },'workType');
        if(res){
          this.alert = newAlert();
          await this.getTypes();
        } else {
          this.alert = newAlert('warning','Sikertelen felvitel!');
        }
      } else {
        this.alert = newAlert('warning','Nem adtál meg minden adatot!');
      }
    },
    async removeType(id){
      if (!confirm('Biztosan törölni szeretnéd?')) return false;
      this.isLoading = true;
      const response = await removeWorkTypeById(id)
      if(response){
        await this.getTypes();
      }
      this.isLoading = false;
    },
    async getTypes(){
      this.isLoading = true;
      const res = await getWorkTypes();
      if(res){
        this.workTypes = res;
      } else {}
      this.isLoading = false;
    },
    exportTypes(){
      const jsonString = JSON.stringify(this.workTypes);
      const blob = new Blob([jsonString], {type: "application/json"});
      const url  = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download    = "workTypes.json";
      a.href        = url;
      a.textContent = "Download backup.json";
      a.click();
    },
  },
}
</script>

<style scoped>
.actions{
  display: flex;
  justify-content: flex-end;
}
</style>
